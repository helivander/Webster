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
  Box,
  Text,
  Image,
  useDisclosure,
} from '@chakra-ui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useUpdateCanvasMutation } from '~/store/api/canvas-slice';
import { ICreate, createSchema } from '~/validation/canvas';
import { ArrowBackIcon, AttachmentIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { useRef, useEffect } from 'react';
import { useUpload } from '~/hooks/useUpload';
import { useDispatch } from 'react-redux';
import { setStage } from '~/store/slices/frame-slice';
import LogoModal from './LogoModal';

type Props = {
  onBack: () => void;
};

const CanvasEdit = ({ onBack }: Props) => {
  const { stage } = useAppSelector((state) => state.frame);
  const frameState = useAppSelector((state) => ({ width: state.frame.width, height: state.frame.height }));
  const [update, { isLoading }] = useUpdateCanvasMutation();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadBackground, deleteBackground, isLoading: isUploadingImagem } = useUpload();
  const initialMount = useRef(true);
  const dispatch = useDispatch();
  const { isOpen: isLogoModalOpen, onOpen: onLogoModalOpen, onClose: onLogoModalClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICreate>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: stage.name || '',
      description: stage.description || '',
      background: stage.background || '',
    },
  });

  // Atualiza o formulário apenas na montagem inicial
  useEffect(() => {
    if (initialMount.current) {
      setValue('name', stage.name || '');
      setValue('description', stage.description || '');
      setValue('background', stage.background || '');
      initialMount.current = false;
    }
  }, [stage, setValue]);

  const background = watch('background');

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveBackground = async () => {
    if (background) {
      try {
        // Extrai o nome do arquivo da URL
        const filename = background.split('/').pop();
        if (filename) {
          await deleteBackground(filename);
          setValue('background', '');
          // Atualiza o stage removendo o background
          dispatch(setStage({ ...stage, background: '' }));
          toast({
            title: 'Sucesso',
            description: 'Plano de fundo removido com sucesso!',
            status: 'success',
            duration: 3000,
          });
        }
      } catch (error) {
        console.error('Erro ao remover plano de fundo:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao remover plano de fundo',
          status: 'error',
          duration: 5000,
        });
      }
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      toast({
        title: 'Erro',
        description: 'Apenas arquivos de imagem (JPEG, PNG, GIF) são permitidos',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Erro',
        description: 'O arquivo deve ter no máximo 5MB',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      // Se já existe um background, remove ele primeiro
      if (background) {
        const oldFilename = background.split('/').pop();
        if (oldFilename) {
          await deleteBackground(oldFilename);
        }
      }

      const response = await uploadBackground(file);
      if (!response.url) {
        throw new Error('URL da imagem não retornada pelo servidor');
      }
      setValue('background', response.url);
      
      // Atualiza o stage com o novo background
      dispatch(setStage({ ...stage, background: response.url }));
      
      toast({
        title: 'Sucesso',
        description: 'Imagem de fundo enviada com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao enviar imagem de fundo',
        status: 'error',
        duration: 5000,
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
        background: data.background,
        width: frameState.width,
        height: frameState.height,
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

  // Função para formatar a URL da imagem
  const getImageUrl = (path: string) => {
    if (!path) return '';
    
    // Se já for uma URL completa
    if (path.startsWith('http')) return path;
    
    // Se começar com /public, adiciona apenas a base URL
    if (path.startsWith('/public/')) {
      return `${import.meta.env.VITE_API_URL}${path}`;
    }
    
    // Se começar com /uploads, adiciona /public antes
    if (path.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_API_URL}/public${path}`;
    }
    
    // Se for apenas o nome do arquivo, constrói o caminho completo
    return `${import.meta.env.VITE_API_URL}/public/uploads/backgrounds/${path}`;
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

          <FormControl isInvalid={!!errors.background}>
            <FormLabel>Plano de Fundo</FormLabel>
            <VStack spacing={2} align="center">
              {background ? (
                <Box position="relative" display="inline-block" role="group">
                  <Image
                    src={getImageUrl(background)}
                    alt="Plano de fundo"
                    boxSize="200px"
                    objectFit="cover"
                    borderRadius="lg"
                    border="2px solid"
                    borderColor="gray.200"
                    shadow="sm"
                  />
                  <HStack
                    position="absolute"
                    top="1"
                    right="1"
                    spacing={1}
                    opacity={0}
                    _groupHover={{ opacity: 1 }}
                    transition="opacity 0.2s"
                  >
                    <IconButton
                      aria-label="Alterar plano de fundo"
                      icon={<AttachmentIcon />}
                      size="xs"
                      variant="solid"
                      colorScheme="blue"
                      onClick={handleFileSelect}
                      isDisabled={isLoading || isUploadingImagem}
                    />
                    <IconButton
                      aria-label="Remover plano de fundo"
                      icon={<DeleteIcon />}
                      size="xs"
                      variant="solid"
                      colorScheme="red"
                      onClick={handleRemoveBackground}
                      isDisabled={isLoading}
                    />
                  </HStack>
                </Box>
              ) : (
                <Box
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="lg"
                  p={4}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ borderColor: "pink.400", bg: "pink.50", transform: "scale(1.02)" }}
                  onClick={handleFileSelect}
                  bg={isLoading || isUploadingImagem ? "gray.100" : "white"}
                  width="200px"
                  height="200px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.2s"
                  shadow="sm"
                >
                  <VStack spacing={1}>
                    <AttachmentIcon boxSize={5} color="gray.400" />
                    <Text color="gray.500" fontSize="xs" fontWeight="medium">
                      Adicionar plano de fundo
                    </Text>
                  </VStack>
                </Box>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={isLoading || isUploadingImagem}
              />
              {isUploadingImagem && (
                <Text fontSize="xs" color="blue.500" mt={3} textAlign="center">
                  Enviando imagem...
                </Text>
              )}
              <Text fontSize="xs" color="gray.500" mt={3} textAlign="center">
                Formatos aceitos: JPEG, PNG, GIF (máx. 5MB)
              </Text>
            </VStack>
            <FormErrorMessage>
              {errors.background?.message}
            </FormErrorMessage>
          </FormControl>

          {/* Botão de Adicionar Logo */}
          <Button
            leftIcon={<AddIcon />}
            colorScheme="pink"
            variant="outline"
            onClick={onLogoModalOpen}
            isDisabled={isLoading}
          >
            Adicionar Logo
          </Button>

          <Button
            type="submit"
            colorScheme="pink"
            isLoading={isLoading || isUploadingImagem}
            width="100%"
          >
            Salvar Alterações
          </Button>
        </VStack>
      </form>

      {/* Modal de Seleção de Logo */}
      <LogoModal isOpen={isLogoModalOpen} onClose={onLogoModalClose} />
    </VStack>
  );
};

export default CanvasEdit; 