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
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef, useState } from 'react';
import {
  useGetMinhaEmpresaQuery,
  useCreateEmpresaMutation,
  useUpdateEmpresaMutation,
  useUploadLogoEmpresaMutation,
} from '~/store/api/empresa-api-slice';
import { CreateEmpresaArg, Empresa as EmpresaType } from '~/types/empresa';
import InputMask from 'react-input-mask';

const companySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  cnpj: z.string().min(1, 'CNPJ é obrigatório'),
  phone: z.string().min(1, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  instagram: z.string().optional(),
  description: z.string().min(1, 'Área de atuação é obrigatória'),
  logo: z.any().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

// Função para formatar CNPJ
const formatCnpj = (cnpj: string | undefined): string => {
  if (!cnpj) return '';
  const cleaned = cnpj.replace(/\D/g, '');
  if (cleaned.length !== 14) return cnpj; // Retorna o original se não for um CNPJ completo
  return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Função para formatar Telefone
const formatPhone = (phone: string | undefined): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) { // (XX) XXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (cleaned.length === 11) { // (XX) XXXXX-XXXX
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone; // Retorna o original se não for um formato conhecido
};

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const { data: empresaData, isLoading: isLoadingEmpresa } = useGetMinhaEmpresaQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [createEmpresa, { isLoading: isCreatingEmpresa }] = useCreateEmpresaMutation();
  const [updateEmpresa, { isLoading: isUpdatingEmpresa }] = useUpdateEmpresaMutation();
  const [uploadLogo, { isLoading: isUploadingLogo }] = useUploadLogoEmpresaMutation();

  const isSavingEmpresa = isCreatingEmpresa || isUpdatingEmpresa || isUploadingLogo;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    control,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      cnpj: '',
      phone: '',
      email: '',
      address: '',
      instagram: '',
      description: '',
      logo: undefined
    }
  });

  useEffect(() => {
    if (empresaData) {
      const { name, cnpj, phone, email, address, logo, description } = empresaData;
      const formData: Partial<CompanyFormData> = {
        name,
        cnpj: formatCnpj(cnpj),
        phone: formatPhone(phone),
        email,
        address,
        description: description || '',
      };
      if (logo) {
        // Ajustando a URL para usar o caminho correto do servidor
        const formattedLogoUrl = logo.startsWith('http') ? logo : `${import.meta.env.VITE_API_URL}/uploads/logos/${logo.split('/').pop()}`;
        console.log('[ProfileMenu useEffect] URL da logo formatada:', formattedLogoUrl);
        formData.logo = formattedLogoUrl;
        setLogoPreview(formattedLogoUrl);
      } else {
        formData.logo = undefined;
        setLogoPreview(null);
      }
      reset(formData);
    } else {
      reset({
        name: '',
        cnpj: '',
        phone: '',
        email: '',
        address: '',
        instagram: '',
        description: '',
        logo: undefined
      });
      setLogoPreview(null);
    }
  }, [empresaData, reset]);

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
        console.log('[ProfileMenu handleLogoChange] Preview Base64 gerado.');
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = () => {
    console.error('[ProfileMenu] Erro ao carregar a imagem da logo');
    toast({
      title: 'Erro ao carregar logo',
      description: 'Não foi possível carregar a imagem da logo.',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const onSubmit = async (data: CompanyFormData) => {
    console.log('[ProfileMenu onSubmit] Dados do formulário inicial:', data);
    const { instagram, description, ...companyApiData } = data;
    let logoUrlToSave: string | undefined = undefined;

    if (typeof companyApiData.logo === 'string') {
      logoUrlToSave = companyApiData.logo;
      console.log('[ProfileMenu onSubmit] Usando logo existente (string/URL):', logoUrlToSave);
    } else if (companyApiData.logo instanceof File) {
      console.log('[ProfileMenu onSubmit] Tentando upload de novo arquivo de logo:', companyApiData.logo.name);
      const file = companyApiData.logo;
      const formData = new FormData();
      formData.append('file', file);

      try {
        const uploadResponse = await uploadLogo(formData).unwrap();
        logoUrlToSave = uploadResponse.filePath;
        console.log('[ProfileMenu onSubmit] Upload bem-sucedido. URL da logo do servidor:', logoUrlToSave);
        console.log('[ProfileMenu onSubmit] Atualizando logoPreview com URL do servidor.');
        setLogoPreview(logoUrlToSave);
        toast({
          title: 'Logo enviado com sucesso!',
          status: 'success',
          duration: 2000,
        });
      } catch (uploadError) {
        console.error('[ProfileMenu onSubmit] Falha ao enviar logo:', uploadError);
        toast({
          title: 'Erro ao enviar logo',
          description:
            (uploadError as any)?.data?.message ||
            'Ocorreu um erro inesperado no upload.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }

    const cleanPhoneNumber = (phone: string | undefined) =>
      phone?.replace(/\D/g, '');
    const cleanCnpj = (cnpj: string | undefined) => cnpj?.replace(/\D/g, '');

    const payload: CreateEmpresaArg = {
      name: companyApiData.name,
      cnpj: cleanCnpj(companyApiData.cnpj) || '',
      phone: cleanPhoneNumber(companyApiData.phone) || '',
      email: companyApiData.email,
      address: companyApiData.address,
      logo: logoUrlToSave,
      description: description,
    };
    console.log('[ProfileMenu onSubmit] Payload para criar/atualizar empresa:', payload);

    try {
      if (empresaData?.id) {
        console.log('[ProfileMenu onSubmit] Atualizando empresa existente ID:', empresaData.id);
        await updateEmpresa({ ...payload, id: empresaData.id }).unwrap();
        toast({
          title: 'Dados da empresa atualizados com sucesso!',
          status: 'success',
        });
      } else {
        console.log('[ProfileMenu onSubmit] Criando nova empresa.');
        await createEmpresa(payload).unwrap();
        toast({
          title: 'Dados da empresa salvos com sucesso!',
          status: 'success',
        });
      }
    } catch (err) {
      console.error('[ProfileMenu onSubmit] Falha ao salvar dados da empresa:', err);
      toast({
        title: 'Erro ao salvar dados',
        description:
          (err as any)?.data?.message || 'Ocorreu um erro inesperado.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const currentCompanyLogoUrl = logoPreview || empresaData?.logo;
  const avatarDisplayUrl = currentCompanyLogoUrl || user?.avatar;

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
          <Avatar size="sm" name={user?.name} src={avatarDisplayUrl} mr={2} />
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
                      <Avatar size="xl" name={user?.name} src={avatarDisplayUrl} />
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
                        <FormControl isInvalid={!!errors.logo}>
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
                              onClick={() => fileInputRef.current?.click()}
                              cursor="pointer"
                            >
                              {logoPreview ? (
                                <Image src={logoPreview} alt="Preview do logo" boxSize="full" objectFit="contain" />
                              ) : (
                                <AddIcon boxSize={6} color="gray.400" />
                              )}
                              <Input
                                type="file"
                                accept="image/png, image/jpeg, image/gif"
                                {...register('logo')}
                                ref={fileInputRef}
                                onChange={handleLogoChange}
                                style={{ display: 'none' }}
                              />
                            </Box>
                            <Button onClick={() => fileInputRef.current?.click()} size="sm">
                              Trocar Logo
                            </Button>
                          </HStack>
                          {errors.logo && (
                            <Text color="red.500" fontSize="sm">
                              {(errors.logo as any)?.message || (errors.logo?.type === 'custom' && 'Erro no logo')}
                            </Text>
                          )}
                        </FormControl>

                        <FormControl isInvalid={!!errors.name}>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <Input {...register('name')} />
                        </FormControl>

                        <FormControl isInvalid={!!errors.cnpj}>
                          <FormLabel htmlFor="cnpj">CNPJ</FormLabel>
                          <Controller
                            name="cnpj"
                            control={control}
                            render={({ field }) => (
                              <Input
                                as={InputMask}
                                mask="99.999.999/9999-99"
                                maskChar={null}
                                {...field}
                                id="cnpj"
                              />
                            )}
                          />
                        </FormControl>

                        <FormControl isInvalid={!!errors.phone}>
                          <FormLabel htmlFor="phone">Telefone</FormLabel>
                          <Controller
                            name="phone"
                            control={control}
                            render={({ field }) => (
                              <Input
                                as={InputMask}
                                mask="(99) 99999-9999"
                                maskChar={null}
                                {...field}
                                id="phone"
                              />
                            )}
                          />
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

                        <FormControl isInvalid={!!errors.description}>
                          <FormLabel htmlFor="description">Área de Atuação</FormLabel>
                          <Input {...register('description')} id="description" />
                        </FormControl>

                        <Button 
                          type="submit" 
                          colorScheme="pink" 
                          isLoading={isSavingEmpresa}
                          loadingText="Salvando..."
                          width="full"
                        >
                          Salvar Dados da Empresa
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
