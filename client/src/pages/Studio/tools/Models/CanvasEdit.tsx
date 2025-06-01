import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  useToast,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useUpdateCanvasMutation } from '~/store/api/canvas-slice';
import { ICreate, createSchema } from '~/validation/canvas';
import { ArrowBackIcon } from '@chakra-ui/icons';

type Props = {
  onBack: () => void;
};

const CanvasEdit = ({ onBack }: Props) => {
  const { stage } = useAppSelector((state) => state.frame);
  const [update, { isLoading }] = useUpdateCanvasMutation();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreate>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: stage.name || '',
      description: stage.description || '',
    },
  });

  const onSubmit = async (data: ICreate) => {
    if (!stage.id) {
      toast({
        title: 'Erro',
        description: 'Canvas não encontrado.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await update({
        id: stage.id,
        name: data.name,
        description: data.description,
        content: typeof stage.content === 'string' ? stage.content : JSON.stringify(stage.content || []),
      }).unwrap();

      toast({
        title: 'Sucesso',
        description: 'Canvas atualizado com sucesso!',
        status: 'success',
        duration: 3000,
      });

      onBack();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar o canvas.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <VStack align="stretch" spacing={4}>
      <HStack>
        <IconButton
          aria-label="Voltar"
          icon={<ArrowBackIcon />}
          onClick={onBack}
          variant="ghost"
        />
      </HStack>

      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <VStack spacing={4} align="stretch">
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Nome</FormLabel>
            <Input
              {...register('name')}
              placeholder="Nome do canvas"
            />
            <FormErrorMessage>
              {errors.name?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.description}>
            <FormLabel>Descrição</FormLabel>
            <Input
              {...register('description')}
              placeholder="Descrição do canvas"
            />
            <FormErrorMessage>
              {errors.description?.message}
            </FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            colorScheme="pink"
            isLoading={isLoading}
            width="100%"
          >
            Salvar Alterações
          </Button>
        </VStack>
      </form>
    </VStack>
  );
};

export default CanvasEdit; 