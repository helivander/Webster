import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { HiOutlinePlus } from 'react-icons/hi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateCanvasMutation } from '~/store/api/canvas-slice';
import { useDispatch } from 'react-redux';
import { setStage } from '~/store/slices/frame-slice';

const layoutSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
  largura: z.number().min(1, 'Largura deve ser maior que 0'),
  altura: z.number().min(1, 'Altura deve ser maior que 0'),
});

type LayoutFormData = z.infer<typeof layoutSchema>;

const LayoutForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [createCanvas] = useCreateCanvasMutation();
  const dispatch = useDispatch();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LayoutFormData>({
    resolver: zodResolver(layoutSchema),
  });

  const onSubmit = async (data: LayoutFormData) => {
    try {
      // Criar o conteúdo inicial do canvas com as dimensões especificadas
      const initialContent = {
        version: '5.3.0',
        width: data.largura,
        height: data.altura,
        objects: [],
      };

      const response = await createCanvas({
        name: data.nome,
        description: data.descricao,
        content: JSON.stringify(initialContent),
      }).unwrap();

      // Atualizar o stage atual com o novo canvas
      dispatch(setStage({ 
        id: response.id,
        name: response.name,
        description: response.description,
        content: initialContent,
      }));

      toast({
        title: 'Layout criado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      reset();
      onClose();
    } catch (error) {
      console.error('Erro ao criar layout:', error);
      toast({
        title: 'Erro ao criar layout',
        description: 'Não foi possível criar o layout. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <IconButton
        aria-label="Adicionar layout"
        icon={<HiOutlinePlus />}
        colorScheme="pink"
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Criar Novo Layout</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack spacing={4} pb={4}>
                <FormControl isInvalid={!!errors.nome}>
                  <FormLabel>Nome</FormLabel>
                  <Input {...register('nome')} placeholder="Nome do layout" />
                  <FormErrorMessage>{errors.nome?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.descricao}>
                  <FormLabel>Descrição</FormLabel>
                  <Input {...register('descricao')} placeholder="Descrição do layout" />
                  <FormErrorMessage>{errors.descricao?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.largura}>
                  <FormLabel>Largura (px)</FormLabel>
                  <Input
                    type="number"
                    {...register('largura', { valueAsNumber: true })}
                    placeholder="Largura em pixels"
                  />
                  <FormErrorMessage>{errors.largura?.message}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.altura}>
                  <FormLabel>Altura (px)</FormLabel>
                  <Input
                    type="number"
                    {...register('altura', { valueAsNumber: true })}
                    placeholder="Altura em pixels"
                  />
                  <FormErrorMessage>{errors.altura?.message}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="pink"
                  w="100%"
                  isLoading={isSubmitting}
                >
                  Criar Layout
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LayoutForm; 