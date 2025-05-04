import { VStack, FormControl, FormLabel, Input, FormErrorMessage, Button, useToast } from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '~/hooks/use-app-selector';
import useRequestHandler from '~/hooks/use-request-handler';
import { useUpdateCanvasMutation } from '~/store/api/canvas-slice';
import { ICanvasPayload } from '~/types/canvas';
import { ICreate, createSchema } from '~/validation/canvas';

type Props = {
  onClose: () => void;
};

const CanvasUpdateForm = ({ onClose }: Props) => {
  const { stage } = useAppSelector((state) => state.frame);
  const [update, { isLoading }] = useUpdateCanvasMutation();
  const toast = useToast();

  const stageValues = {
    id: stage.id as string,
    name: stage.name as string,
    content: JSON.stringify(stage.content),
    description: stage.description as string,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ICreate>({
    defaultValues: { ...stageValues },
    resolver: zodResolver(createSchema),
  });

  const { handler: updateHandler } = useRequestHandler<ICanvasPayload & { id: string }>({
    f: update,
  });

  const onSubmit = async (data: ICreate) => {
    await updateHandler({
      ...stageValues,
      ...data,
    });

    toast({
      title: 'Seu canvas foi atualizado com sucesso.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing="4">
        <FormControl isInvalid={!!errors.name} isRequired>
          <FormLabel htmlFor="name">Nome</FormLabel>
          <Input id="name" placeholder="nome" {...register('name')} />
          <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.description} isRequired>
          <FormLabel htmlFor="description">Descrição</FormLabel>
          <Input id="description" placeholder="descrição" {...register('description')} />
          <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
        </FormControl>
        <Button type="submit" w="200px" colorScheme="pink" isLoading={isLoading}>
          Salvar
        </Button>
      </VStack>
    </form>
  );
};

export default CanvasUpdateForm;
