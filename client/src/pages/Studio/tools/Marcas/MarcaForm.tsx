import { useState, useRef } from 'react';
import {
  VStack,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Box,
  Image,
  IconButton,
  Text,
  HStack,
  Flex,
} from '@chakra-ui/react';
import { AttachmentIcon, DeleteIcon } from '@chakra-ui/icons';
import { useCreateMarcaMutation, useUpdateMarcaMutation } from '~/store/api/marca-api-slice';
import { useUpload } from '~/hooks/useUpload';
import { Marca } from '~/types/marca';

interface MarcaFormProps {
  marca?: Marca;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const MarcaForm = ({ marca, onSuccess, onCancel }: MarcaFormProps) => {
  const [nome, setNome] = useState(marca?.nome || '');
  const [logo, setLogo] = useState(marca?.logo || '');
  const [descricao, setDescricao] = useState(marca?.descricao || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createMarca, { isLoading: isCreating }] = useCreateMarcaMutation();
  const [updateMarca, { isLoading: isUpdating }] = useUpdateMarcaMutation();
  const { uploadMarcaLogo, isLoading: isUploadingLogo } = useUpload();
  
  const toast = useToast();
  const isEditing = !!marca;
  const isLoading = isCreating || isUpdating || isUploadingLogo;

  // Função para formatar a URL da imagem
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Se o path já for o caminho completo (e.g. /public/uploads/logos/marcas/...), usa-o
    if (path.startsWith('/public/uploads/logos/marcas/')) {
      return `${import.meta.env.VITE_API_URL}${path}`;
    }
    // Fallback para caminhos mais antigos ou apenas nome do arquivo
    return `${import.meta.env.VITE_API_URL}/public/uploads/logos/marcas/${path.split('/').pop()}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (nome.length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    if (descricao && descricao.length > 255) {
      newErrors.descricao = 'Descrição deve ter no máximo 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 Arquivo selecionado:', file.name, file.type, file.size);

    // Validar tipo de arquivo
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
      console.error('❌ Tipo de arquivo inválido:', file.type);
      toast({
        title: 'Erro',
        description: 'Apenas arquivos de imagem (JPEG, PNG, GIF, WEBP) são permitidos',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    // Validar tamanho do arquivo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.error('❌ Arquivo muito grande:', file.size);
      toast({
        title: 'Erro',
        description: 'O arquivo deve ter no máximo 5MB',
        status: 'error',
        duration: 5000,
      });
      return;
    }

    try {
      console.log('🚀 Iniciando upload...');

      const response = await uploadMarcaLogo(file);
      
      console.log('✅ Upload bem-sucedido:', response);
      
      if (!response.url) {
        throw new Error('URL da logo não retornada pelo servidor');
      }
      
      setLogo(response.url);
      
      toast({
        title: 'Sucesso',
        description: 'Logo enviada com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      console.error('📄 Detalhes do erro:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Erro ao enviar logo';
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      toast({
        title: 'Erro',
        description: errorMessage,
        status: 'error',
        duration: 5000,
      });
    } finally {
      // Limpar o input para permitir selecionar o mesmo arquivo novamente
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveLogo = () => {
    setLogo('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const marcaData = {
        nome: nome.trim(),
        logo: logo.trim() || undefined,
        descricao: descricao.trim() || undefined,
      };

      if (isEditing) {
        await updateMarca({ id: marca.id, ...marcaData }).unwrap();
        toast({
          title: 'Marca atualizada',
          description: 'Marca atualizada com sucesso!',
          status: 'success',
          duration: 3000,
        });
      } else {
        await createMarca(marcaData).unwrap();
        toast({
          title: 'Marca criada',
          description: 'Marca criada com sucesso!',
          status: 'success',
          duration: 3000,
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error?.data?.message || 'Erro ao salvar marca',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <VStack as="form" spacing={4} onSubmit={handleSubmit}>
      <FormControl isInvalid={!!errors.nome}>
        <FormLabel>Nome *</FormLabel>
        <Input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome da marca"
          focusBorderColor="pink.500"
        />
        <FormErrorMessage>{errors.nome}</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel>Logo</FormLabel>
        <VStack spacing={3} align="stretch">
          {logo ? (
            <Box 
              position="relative" 
              borderRadius="md" 
              overflow="hidden" 
              border="1px solid" 
              borderColor="gray.200"
              role="group"
            >
              <Image
                src={getImageUrl(logo)}
                alt="Logo da marca"
                maxH="120px"
                w="100%"
                objectFit="contain"
                bg="gray.50"
              />
              {/* Ícones que aparecem só no hover */}
              <HStack
                position="absolute"
                top="2"
                right="2"
                spacing={1}
                opacity={0}
                _groupHover={{ opacity: 1 }}
                transition="opacity 0.2s"
              >
                <IconButton
                  aria-label="Alterar logo"
                  icon={<AttachmentIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  bg="white"
                  _hover={{ bg: "blue.100" }}
                  onClick={handleFileSelect}
                  isDisabled={isLoading}
                  shadow="md"
                />
                <IconButton
                  aria-label="Remover logo"
                  icon={<DeleteIcon />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  bg="white"
                  _hover={{ bg: "red.100" }}
                  onClick={handleRemoveLogo}
                  isDisabled={isLoading}
                  shadow="md"
                />
              </HStack>
            </Box>
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="120px"
              border="2px dashed"
              borderColor="gray.300"
              borderRadius="md"
              bg="gray.50"
              cursor="pointer"
              _hover={{ borderColor: "pink.500", bg: "pink.50" }}
              onClick={handleFileSelect}
            >
              <AttachmentIcon boxSize={8} color="gray.400" mb={2} />
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Clique para selecionar uma logo
              </Text>
              <Text fontSize="xs" color="gray.500" textAlign="center">
                JPEG, PNG ou GIF (máx. 5MB)
              </Text>
            </Flex>
          )}
        </VStack>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </FormControl>

      <FormControl isInvalid={!!errors.descricao}>
        <FormLabel>Descrição</FormLabel>
        <Textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição da marca"
          focusBorderColor="pink.500"
          resize="vertical"
        />
        <FormErrorMessage>{errors.descricao}</FormErrorMessage>
      </FormControl>

      <VStack spacing={2} w="100%">
        <Button
          type="submit"
          colorScheme="pink"
          isLoading={isLoading}
          loadingText={isEditing ? 'Atualizando...' : 'Criando...'}
          w="100%"
        >
          {isEditing ? 'Atualizar Marca' : 'Criar Marca'}
        </Button>
        
        {onCancel && (
          <Button variant="ghost" onClick={onCancel} w="100%">
            Cancelar
          </Button>
        )}
      </VStack>
    </VStack>
  );
};

export default MarcaForm; 