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
import { IStageState, resetStage, setStage, setSize } from '~/store/slices/frame-slice';
import { ICanvas } from '~/types/canvas';

type Props = ICanvas & { 
  onClose: VoidFunction;
  onEdit?: () => void;
};

// Comente sempre o trexo de código abaixo.
const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

// TODO: Verificar se o width e height estão sendo passados corretamente
const CanvasViewItem = ({ 
  id, 
  name, 
  description, 
  updatedAt, 
  createdAt,
  content,
  width,
  height,
  onClose, 
  onEdit 
}: Props) => {
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

  // Função para selecionar o canvas
  const handleSelectStage = () => {
    // Primeiro, define o tamanho do canvas
    dispatch(setSize({
      width: width || 1920,
      height: height || 1080
    }));

    // Depois, define o estado do stage com o conteúdo parseado
    dispatch(setStage({ 
      id, 
      name, 
      description,
      content: typeof content === 'string' ? JSON.parse(content) : content,
      updatedAt,
      createdAt
    }));

    onClose();
  };

  // Função para editar o canvas
  const handleEditClick = () => {
    if (onEdit) {
      dispatch(setStage({ 
        id, 
        name, 
        description,
        content,
        updatedAt,
        createdAt
      }));

      dispatch(setSize({
        width: width || 1920,
        height: height || 1080
      }));

      onEdit();
    }
  };

  // Função para excluir o canvas
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
        p={4}
        cursor="pointer"
        onClick={handleSelectStage}
        _hover={{ bg: hoverBg }}
        bg={bgCard}
        borderColor={borderColor}
        borderWidth={1}
      >
        <VStack align="stretch" spacing={2}>
          <Box>
            <Text fontWeight="bold" fontSize="lg">
              {name}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {description}
            </Text>
          </Box>
          <Box textAlign="right">
            {onEdit && (
              <IconButton
                aria-label="Editar"
                icon={<HiOutlinePencil />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick();
                }}
              />
            )}
            <IconButton
              aria-label="Excluir"
              icon={<HiOutlineTrash />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              onClick={(e) => {
                e.stopPropagation();
                onOpenDeleteModal();
              }}
            />
          </Box>
        </VStack>
      </Card>

      {/* Modal de exclusão de canvas */}
      <Modal isOpen={isDeleteModalOpen} onClose={onCloseDeleteModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalBody>
            Tem certeza que deseja excluir o canvas &quot;{name}&quot;? Esta ação não pode ser desfeita.
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
