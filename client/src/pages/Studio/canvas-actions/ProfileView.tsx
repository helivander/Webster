import {
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  Box,
  VStack,
  Text,
  Avatar,
} from '@chakra-ui/react';
import { useAppSelector } from '~/hooks/use-app-selector';

const ProfileView = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Box sx={{ w: '100%' }}>
      <Button variant="ghost" colorScheme="pink" onClick={onOpen} sx={{ w: '100%' }}>
        View Profile
      </Button>

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
    </Box>
  );
};

export default ProfileView;
