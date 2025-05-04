import { Card, VStack, Box, Text, IconButton, useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@chakra-ui/react';
import { HiOutlineTrash } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { useDeleteCanvasMutation } from '~/store/api/canvas-slice';
import { IStageState, resetStage, setStage } from '~/store/slices/frame-slice';
import { ICanvas } from '~/types/canvas';

type Props = ICanvas & { onClose: VoidFunction };

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));

const CanvasViewItem = ({ id, name, description, updatedAt, onClose }: Props) => {
  const dispatch = useDispatch();
  const [remove, { isLoading }] = useDeleteCanvasMutation();
  const toast = useToast();
  const { isOpen, onOpen, onClose: onCloseModal } = useDisclosure();

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
        onCloseModal();
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <Card
        onClick={() => changeStage({ id, name, description })}
        variant="outline"
        _hover={{ bgColor: 'gray.100', cursor: 'pointer' }}
        sx={{ w: '100%', p: 4, borderRadius: '10px' }}
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
          <Box sx={{ display: 'flex', w: '100%', justifyContent: 'flex-end' }}>
            <IconButton
              variant="outline"
              colorScheme="pink"
              isLoading={isLoading}
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              aria-label="remove-stage"
              icon={<HiOutlineTrash />}
            />
          </Box>
        </VStack>
      </Card>

      <Modal isOpen={isOpen} onClose={onCloseModal} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirmar Exclusão</ModalHeader>
          <ModalBody>
            <Text>Tem certeza que deseja excluir o canvas "{name}"? Esta ação não pode ser desfeita.</Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onCloseModal}>
              Cancelar
            </Button>
            <Button colorScheme="red" onClick={removeStage} isLoading={isLoading}>
              Excluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CanvasViewItem;
