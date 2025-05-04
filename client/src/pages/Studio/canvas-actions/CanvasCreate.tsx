import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import CanvasCreateForm from './CanvasCreateForm';

const CanvasCreate = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box sx={{ w: '100%' }}>
      <Button variant="ghost" colorScheme="pink" onClick={onOpen} sx={{ w: '100%' }}>
        Create a canvas
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent sx={{ p: 4 }}>
          <ModalHeader>Create a Canvas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CanvasCreateForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CanvasCreate;
