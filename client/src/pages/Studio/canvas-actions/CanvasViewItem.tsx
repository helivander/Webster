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
  ModalCloseButton,
  useColorModeValue,
} from '@chakra-ui/react';
import { HiOutlineTrash, HiOutlinePencil } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { useDeleteCanvasMutation } from '~/store/api/canvas-slice';
import { IStageState, resetStage, setStage } from '~/store/slices/frame-slice';
import { ICanvas } from '~/types/canvas';
import CanvasUpdateForm from './CanvasUpdateForm';

type Props = ICanvas & { onClose: VoidFunction };

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

const CanvasViewItem = ({ id, name, description, updatedAt, onClose }: Props) => {
  const dispatch = useDispatch();
  const [remove, { isLoading: isDeleting }] = useDeleteCanvasMutation();
  const toast = useToast();
  const { isOpen: isDeleteModalOpen, onOpen: onOpenDeleteModal, onClose: onCloseDeleteModal } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onOpenEditModal, onClose: onCloseEditModal } = useDisclosure();
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const changeStage = (stage: IStageState) => {
    dispatch(setStage({ ...stage }));
    onClose();
  };

  const removeStage = () => {
    remove(id)
      .then(() => {
        dispatch(resetStage());
        toast({
          title: 'Seu canvas foi removido com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        onCloseDeleteModal();
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Card
        onClick={() => changeStage({ id, name, description })}
        variant="outline"
        _hover={{ bgColor: hoverBg, cursor: 'pointer' }}
        sx={{ w: '100%', p: 4, borderRadius: '10px' }}
        position="relative"
        role="group"
      >
        <VStack spacing={2} sx={{ alignItems: 'flex-start', w: '100%' }}>
          <Box>
            <Text fontSize="18px" fontWeight="600" color="pink.500">
              {name}
            </Text>
            <Text fontSize="16px" fontWeight="500" color="pink.500">
              {description}
            </Text>
          </Box>
          <Text w="100%" align="right" fontSize="14px" fontWeight="500">
            Última atualização: {formatDate(updatedAt)}
          </Text>
        </VStack>

        {/* Ícones que aparecem só no hover */}
        <Box
          position="absolute"
          top="3"
          right="3"
          display="flex"
          gap={2}
          opacity={0}
          _groupHover={{ opacity: 1 }}
          transition="opacity 0.2s"
        >
          <IconButton
            variant="ghost"
            colorScheme="blue"
            size="sm"
            bg="white"
            _hover={{ bg: "blue.100" }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenEditModal();
            }}
            aria-label="edit-stage"
            icon={<HiOutlinePencil />}
            shadow="md"
          />
          <IconButton
            variant="ghost"
            colorScheme="red"
            isLoading={isDeleting}
            size="sm"
            bg="white"
            _hover={{ bg: "red.100" }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDeleteModal();
            }}
            aria-label="remove-stage"
            icon={<HiOutlineTrash />}
            shadow="md"
          />
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

      <Modal isOpen={isEditModalOpen} onClose={onCloseEditModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Canvas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CanvasUpdateForm onClose={onCloseEditModal} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CanvasViewItem;
