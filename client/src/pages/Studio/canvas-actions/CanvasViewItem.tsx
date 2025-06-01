import {
  Card,
  VStack,
  Box,
  Text,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  useColorModeValue,
} from '@chakra-ui/react';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { useDeleteCanvasMutation } from '~/store/api/canvas-slice';
import { IStageState, resetStage, setStage } from '~/store/slices/frame-slice';
import { ICanvas } from '~/types/canvas';

type Props = ICanvas & { 
  onClose: VoidFunction;
  onEdit?: () => void;
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

const CanvasViewItem = ({ id, name, description, updatedAt, onClose, onEdit }: Props) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const [deleteCanvas, { isLoading: isDeleting }] = useDeleteCanvasMutation();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onOpenDeleteModal,
    onClose: onCloseDeleteModal,
  } = useDisclosure();
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const bgCard = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSelectStage = () => {
    dispatch(setStage({ id, name, description }));
    onClose();
  };

  const handleEditClick = () => {
    if (onEdit) {
      dispatch(setStage({ id, name, description }));
      onEdit();
    }
  };

  const removeStage = async () => {
    try {
      await deleteCanvas(id).unwrap();
      dispatch(resetStage());
      onCloseDeleteModal();
      toast({
        title: 'Canvas excluído com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao excluir canvas:', error);
      toast({
        title: 'Erro ao excluir canvas',
        description: 'Não foi possível excluir o canvas. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Card
        variant="outline"
        bg={bgCard}
        borderColor={borderColor}
        _hover={{ borderColor: 'pink.500', cursor: 'pointer' }}
        onClick={handleSelectStage}
      >
        <Box p={4} position="relative">
          <VStack align="stretch" spacing={2}>
            <Text fontSize="lg" fontWeight="bold" noOfLines={1}>
              {name}
            </Text>
            <Text fontSize="sm" color="gray.500" noOfLines={2}>
              {description}
            </Text>
            <Text fontSize="xs" color="gray.500">
              Última atualização: {new Date(updatedAt).toLocaleString()}
            </Text>
          </VStack>

          <Box
            position="absolute"
            top={2}
            right={2}
            display="flex"
            gap={2}
            onClick={(e) => e.stopPropagation()}
          >
            <IconButton
              aria-label="Editar canvas"
              icon={<HiOutlinePencil />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={handleEditClick}
            />
            <IconButton
              aria-label="Excluir canvas"
              icon={<HiOutlineTrash />}
              size="sm"
              colorScheme="red"
              variant="ghost"
              onClick={onOpenDeleteModal}
            />
          </Box>
        </Box>
      </Card>

      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalBody>
            <Text>Tem certeza que deseja excluir o canvas &quot;{name}&quot;? Esta ação não pode ser desfeita.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseDeleteModal}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={removeStage} isLoading={isDeleting}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CanvasViewItem;
