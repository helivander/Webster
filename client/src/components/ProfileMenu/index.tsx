import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Avatar,
  Text,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Box,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Image,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useDispatch } from 'react-redux';
import { logout } from '~/store/slices/auth-slice';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRef, useState } from 'react';

const companySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  instagram: z.string().optional(),
  businessArea: z.string().min(1, 'Área de atuação é obrigatória'),
  logo: z.any().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/sign-in');
  };

  const handleLogin = () => {
    navigate('/auth/sign-in');
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue('logo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: CompanyFormData) => {
    // TODO: Implementar lógica de salvamento dos dados da empresa
    console.log(data);
    toast({
      title: 'Dados salvos com sucesso!',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (!isLoggedIn) {
    return (
      <Button colorScheme="pink" onClick={handleLogin}>
        Entrar
      </Button>
    );
  }

  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          <Avatar size="sm" name={user?.name} src={user?.avatar} mr={2} />
          <Text display={{ base: 'none', md: 'inline' }}>{user?.name}</Text>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>Perfil</MenuItem>
          <MenuItem onClick={onSettingsOpen}>Configurações</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleLogout}>Sair</MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside" size="xl">
        <ModalOverlay />
        <ModalContent sx={{ p: 4 }}>
          <ModalHeader>Perfil</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Tabs variant="enclosed" colorScheme="pink">
              <TabList>
                <Tab>Perfil</Tab>
                <Tab>Dados da Empresa</Tab>
              </TabList>

              <TabPanels>
                {/* Aba de Perfil */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <HStack spacing={4}>
                      <Avatar size="xl" name={user?.name} src={user?.avatar} />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="lg" fontWeight="bold">
                          {user?.name}
                        </Text>
                        <Text fontSize="md" color="gray.600">
                          {user?.email}
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </TabPanel>

                {/* Aba de Dados da Empresa */}
                <TabPanel>
                  <VStack spacing={6} align="stretch">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <VStack spacing={4}>
                        <FormControl>
                          <FormLabel>Logo da Empresa</FormLabel>
                          <HStack spacing={4}>
                            <Box
                              borderWidth={1}
                              borderRadius="md"
                              p={2}
                              width="100px"
                              height="100px"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                              position="relative"
                            >
                              {logoPreview ? (
                                <Image src={logoPreview} alt="Logo preview" maxW="100%" maxH="100%" objectFit="contain" />
                              ) : (
                                <IconButton
                                  aria-label="Adicionar logo"
                                  icon={<AddIcon />}
                                  onClick={() => fileInputRef.current?.click()}
                                  variant="ghost"
                                />
                              )}
                            </Box>
                            <Input
                              type="file"
                              accept="image/*"
                              display="none"
                              ref={fileInputRef}
                              onChange={handleLogoChange}
                            />
                            <Button onClick={() => fileInputRef.current?.click()} size="sm">
                              {logoPreview ? 'Alterar Logo' : 'Adicionar Logo'}
                            </Button>
                          </HStack>
                        </FormControl>

                        <FormControl isInvalid={!!errors.name}>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <Input {...register('name')} />
                        </FormControl>

                        <FormControl isInvalid={!!errors.cnpj}>
                          <FormLabel>CNPJ</FormLabel>
                          <Input {...register('cnpj')} />
                        </FormControl>

                        <FormControl isInvalid={!!errors.phone}>
                          <FormLabel>Telefone</FormLabel>
                          <Input {...register('phone')} />
                        </FormControl>

                        <FormControl isInvalid={!!errors.email}>
                          <FormLabel>Email</FormLabel>
                          <Input {...register('email')} />
                        </FormControl>

                        <FormControl isInvalid={!!errors.address}>
                          <FormLabel>Endereço</FormLabel>
                          <Input {...register('address')} />
                        </FormControl>

                        <FormControl isInvalid={!!errors.instagram}>
                          <FormLabel>Instagram</FormLabel>
                          <Input {...register('instagram')} />
                        </FormControl>

                        <FormControl isInvalid={!!errors.businessArea}>
                          <FormLabel>Área de Atuação</FormLabel>
                          <Input {...register('businessArea')} />
                        </FormControl>

                        <Button type="submit" colorScheme="pink" width="full">
                          Salvar
                        </Button>
                      </VStack>
                    </form>
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent sx={{ p: 4 }}>
          <ModalHeader>Configurações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Text fontSize="lg" fontWeight="bold">
                Configurações
              </Text>
              <Text fontSize="md" color="gray.600">
                Aqui você pode configurar suas preferências.
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileMenu;
