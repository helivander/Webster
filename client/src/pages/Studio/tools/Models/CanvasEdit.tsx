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
  Select,
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
import { selectFrameDimensions, selectStage, setSize } from '~/store/slices/frame-slice';
import LogoModal from './LogoModal';
import useStageObject from '~/hooks/use-stage-object';
import { DEFAULT_IMAGE_OBJECT } from '~/consts/stage-object';
import { standardDimensions } from '~/consts/dimensions';

type Props = {
  onBack: () => void;
};

const CanvasEdit = ({ onBack }: Props) => {
  const stage = useAppSelector(selectStage);
  const frameState = useAppSelector(selectFrameDimensions);
  const [update, { isLoading }] = useUpdateCanvasMutation();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadBackground, deleteBackground, isLoading: isUploadingImagem } = useUpload();
  const initialMount = useRef(true);
  const isEditing = useRef(true); // Flag para indicar que estamos no modo de edição
  const dispatch = useDispatch();
  const { isOpen: isLogoModalOpen, onOpen: onLogoModalOpen, onClose: onLogoModalClose } = useDisclosure();
  const { stageObjects, createOne, removeOne } = useStageObject();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ICreate>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: stage.name || '',
      description: stage.description || '',
    },
  });

  // Atualiza o formulário apenas na montagem inicial
  useEffect(() => {
    if (initialMount.current) {
      setValue('name', stage.name || '');
      setValue('description', stage.description || '');
      initialMount.current = false;
    }
  }, [stage, setValue]);

  // Encontra o objeto de plano de fundo atual
  const backgroundObject = stageObjects.find(obj => obj.data.systype === 'background');

  // Salva automaticamente quando os objetos do stage mudam
  useEffect(() => {
    // Evita salvar quando não há mudanças significativas ou quando está no modo de edição
    if (!stage.id || isEditing.current) {
      return;
    }

    const saveCanvas = async () => {
      try {
        await update({
          id: stage.id as string,
          name: stage.name || '',
          description: stage.description || '',
          width: frameState.width,
          height: frameState.height,
          content: JSON.stringify(stageObjects),
        }).unwrap();
      } catch (error) {
        console.error('Erro ao salvar canvas:', error);
      }
    };

    // Pequeno delay para garantir que todas as atualizações do estado foram processadas
    const timeoutId = setTimeout(() => {
      saveCanvas();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [stage.id, stage.name, stage.description, frameState.width, frameState.height, stageObjects, update]);

  // Função para selecionar o arquivo de fundo
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Função para alterar o arquivo de fundo
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      toast({
        title: 'Erro',
        description: 'Apenas arquivos de imagem (JPEG, PNG, GIF, WEBP) são permitidos',
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
      if (backgroundObject) {
        const oldFilename = backgroundObject.data.src.split('/').pop();
        if (oldFilename) {
          await deleteBackground(oldFilename);
          // Remove o objeto antigo do stage
          removeOne(backgroundObject.id);
        }
      }

      const response = await uploadBackground(file);
      if (!response.url) {
        throw new Error('URL da imagem não retornada pelo servidor');
      }

      // Cria o objeto de imagem com systype: 'background'
      createOne({
        ...DEFAULT_IMAGE_OBJECT,
        src: response.url,
        x: 0,
        y: 0,
        width: frameState.width,
        height: frameState.height,
        draggable: true,
        systype: 'background',
        z_index: -1 // Garante que o background fique sempre atrás dos outros elementos
      });

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

  const handleRemoveBackground = async () => {
    try {
      // Remove o objeto de imagem com systype: 'background'
      if (backgroundObject) {
        const filename = backgroundObject.data.src.split('/').pop();
        if (filename) {
          await deleteBackground(filename);
          // Remove o objeto do stage
          removeOne(backgroundObject.id);
        }
      }
      
      toast({
        title: 'Sucesso',
        description: 'Plano de fundo removido com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro ao remover plano de fundo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover plano de fundo',
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Função para salvar as alterações do canvas
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
      // Prepara o conteúdo atual do canvas
      const content = JSON.stringify(stageObjects);

      await update({
        id: stage.id,
        name: data.name,
        description: data.description,
        width: frameState.width,
        height: frameState.height,
        content: content,
      }).unwrap();

      toast({
        title: 'Sucesso',
        description: 'Canvas atualizado com sucesso!',
        status: 'success',
        duration: 3000,
      });

      isEditing.current = false; // Desativa o modo de edição após salvar
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

  // Função para lidar com a mudança de dimensão
  const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDimension = standardDimensions.find(
      (dim) => `${dim.width}x${dim.height}` === e.target.value
    );

    if (selectedDimension) {
      dispatch(setSize({
        width: selectedDimension.width,
        height: selectedDimension.height
      }));
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

          {/* Select de Dimensões Padrão */}
          <FormControl>
            <FormLabel>Dimensões Padrão</FormLabel>
            <Select
              placeholder="Selecione um tamanho padrão"
              onChange={handleDimensionChange}
              value={`${frameState.width}x${frameState.height}`}
            >
              {standardDimensions.map((dim) => (
                <option key={`${dim.width}x${dim.height}`} value={`${dim.width}x${dim.height}`}>
                  {dim.label} ({dim.width}x{dim.height})
                </option>
              ))}
            </Select>
            <Text fontSize="xs" color="gray.500" mt={1}>
              Dimensões atuais: {frameState.width}x{frameState.height}
            </Text>
          </FormControl>

          {/* Upload de Plano de Fundo */}
          <VStack spacing={2} align="center">
            {backgroundObject ? (
              <Box position="relative" display="inline-block" role="group">
                <Image
                  src={getImageUrl(backgroundObject.data.src)}
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
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
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
              Formatos aceitos: JPEG, PNG, GIF, WEBP (máx. 5MB)
            </Text>
          </VStack>

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