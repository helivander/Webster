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
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useDispatch } from 'react-redux';
import { logout } from '~/store/slices/auth-slice';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/sign-in');
  };

  return (
    <>
      <Menu>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
          <Avatar size="sm" name={user?.name} src={user?.avatar} mr={2} />
          <Text display={{ base: 'none', md: 'inline' }}>{user?.name}</Text>
        </MenuButton>
        <MenuList>
          <MenuItem onClick={onOpen}>Profile</MenuItem>
          <MenuItem onClick={onSettingsOpen}>Settings</MenuItem>
          <MenuDivider />
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent sx={{ p: 4 }}>
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Avatar size="xl" name={user?.name} src={user?.avatar} />
              <Text fontSize="lg" fontWeight="bold">
                {user?.name}
              </Text>
              <Text fontSize="md" color="gray.600">
                Email: {user?.email}
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent sx={{ p: 4 }}>
          <ModalHeader>Settings</ModalHeader>
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
