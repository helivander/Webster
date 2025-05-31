import { useState, useRef, useEffect } from 'react';
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
} from '@chakra-ui/react';
import { AttachmentIcon, DeleteIcon } from '@chakra-ui/icons';
import { useCreateProdutoMutation, useUpdateProdutoMutation } from '~/store/api/produto-api-slice';
import { useGetMarcasQuery } from '~/store/api/marca-api-slice';
import { useUpload } from '~/hooks/useUpload';
import { Produto } from '~/types/produto';

interface ProdutoFormProps {
  produto?: Produto;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// Funções para formatação de preço brasileiro
const formatPreco = (value: string | number) => {
  if (typeof value === 'string') {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return '';
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (isNaN(value)) return '';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const parsePreco = (value: string) => {
  // Remove tudo exceto números e vírgula
  const cleanValue = value.replace(/[^\d,]/g, '');
  // Substitui vírgula por ponto para parseFloat
  const numericValue = cleanValue.replace(',', '.');
  return numericValue;
};

const ProdutoForm = ({ produto, onSuccess, onCancel }: ProdutoFormProps) => {
  const [nome, setNome] = useState(produto?.nome || '');
  const [imagem, setImagem] = useState(produto?.imagem || '');
  const [foto2, setFoto2] = useState(produto?.foto2 || '');
  const [foto3, setFoto3] = useState(produto?.foto3 || '');
  const [descricao, setDescricao] = useState(produto?.descricao || '');
  const [preco, setPreco] = useState<number | undefined>(produto?.preco || undefined);
  const [categoria, setCategoria] = useState(produto?.categoria || '');
  const [marcaId, setMarcaId] = useState(produto?.marcaId || '');
  const [barcode, setBarcode] = useState(produto?.barcode || '');
  const [codsys, setCodsys] = useState(produto?.codsys || '');
  const [marcaSearchTerm, setMarcaSearchTerm] = useState('');
  const [showMarcaDropdown, setShowMarcaDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);
  const marcaInputRef = useRef<HTMLInputElement>(null);
  const marcaDropdownRef = useRef<HTMLDivElement>(null);

  const [createProduto, { isLoading: isCreating }] = useCreateProdutoMutation();
  const [updateProduto, { isLoading: isUpdating }] = useUpdateProdutoMutation();
  const { data: marcas = [], isLoading: isLoadingMarcas } = useGetMarcasQuery();
  const { uploadProdutoImagem, isLoading: isUploadingImagem } = useUpload();
  
  const toast = useToast();
  const isEditing = !!produto;
  const isLoading = isCreating || isUpdating || isUploadingImagem || isLoadingMarcas;

  // Cores para tema claro/escuro
  const dropdownBg = useColorModeValue('white', 'gray.800');
  const dropdownBorder = useColorModeValue('gray.200', 'gray.600');
  const itemHoverBg = useColorModeValue('gray.50', 'gray.700');
  const selectedBg = useColorModeValue('pink.50', 'pink.900');
  const textColor = useColorModeValue('gray.900', 'white');
  const descriptionColor = useColorModeValue('gray.600', 'gray.400');
  const noResultsColor = useColorModeValue('gray.500', 'gray.400');

  // Estado para o valor formatado do preço  
  const [precoFormatado, setPrecoFormatado] = useState(produto?.preco ? formatPreco(produto.preco) : '');

  // Filtrar marcas baseado no termo de busca
  const filteredMarcas = marcas.filter(marca =>
    marca.nome.toLowerCase().includes(marcaSearchTerm.toLowerCase()) ||
    (marca.descricao && marca.descricao.toLowerCase().includes(marcaSearchTerm.toLowerCase()))
  );

  // Efeito para resetar o índice selecionado quando o filtro muda
  useEffect(() => {
    setSelectedIndex(-1);
  }, [marcaSearchTerm]);

  // Efeito para fazer scroll automático do item selecionado
  useEffect(() => {
    if (selectedIndex >= 0 && marcaDropdownRef.current) {
      const selectedElement = marcaDropdownRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  // Efeito para inicializar o campo de busca quando editando um produto
  useEffect(() => {
    if (produto?.marcaId && marcas.length > 0) {
      const marcaSelecionada = marcas.find(m => m.id === produto.marcaId);
      if (marcaSelecionada && !marcaSearchTerm) {
        setMarcaSearchTerm(marcaSelecionada.nome);
      }
    }
  }, [produto, marcas, marcaSearchTerm]);

  // Efeito para fechar dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (marcaDropdownRef.current && !marcaDropdownRef.current.contains(event.target as Node) &&
          marcaInputRef.current && !marcaInputRef.current.contains(event.target as Node)) {
        setShowMarcaDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Função para selecionar uma marca
  const handleSelectMarca = (marca: any) => {
    setMarcaId(marca.id);
    setMarcaSearchTerm(marca.nome);
    setShowMarcaDropdown(false);
    setSelectedIndex(-1);
  };

  // Função para lidar com teclas pressionadas
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showMarcaDropdown || filteredMarcas.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredMarcas.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredMarcas.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredMarcas.length) {
          handleSelectMarca(filteredMarcas[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowMarcaDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Função para formatar a URL da imagem
  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // Se o path já for o caminho completo (e.g. /public/uploads/produtos/...), usa-o
    if (path.startsWith('/public/uploads/produtos/')) {
      return `${import.meta.env.VITE_API_URL}${path}`;
    }
    // Fallback para caminhos mais antigos ou apenas nome do arquivo
    return `${import.meta.env.VITE_API_URL}/public/uploads/produtos/${path.split('/').pop()}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (nome.length > 100) {
      newErrors.nome = 'Nome deve ter no máximo 100 caracteres';
    }

    if (descricao && descricao.length > 500) {
      newErrors.descricao = 'Descrição deve ter no máximo 500 caracteres';
    }

    if (categoria && categoria.length > 50) {
      newErrors.categoria = 'Categoria deve ter no máximo 50 caracteres';
    }

    if (preco !== undefined && preco < 0) {
      newErrors.preco = 'Preço deve ser um valor positivo';
    }

    if (barcode && barcode.length > 50) {
      newErrors.barcode = 'Código de barras deve ter no máximo 50 caracteres';
    }

    if (codsys && codsys.length > 50) {
      newErrors.codsys = 'Código deve ter no máximo 50 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect2 = () => {
    fileInputRef2.current?.click();
  };

  const handleFileSelect3 = () => {
    fileInputRef3.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 Arquivo selecionado:', file.name, file.type, file.size);

    // Validar tipo de arquivo
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      console.error('❌ Tipo de arquivo inválido:', file.type);
      toast({
        title: 'Erro',
        description: 'Apenas arquivos de imagem (JPEG, PNG, GIF) são permitidos',
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

      const response = await uploadProdutoImagem(file);
      
      console.log('✅ Upload bem-sucedido:', response);
      
      if (!response.url) {
        throw new Error('URL da imagem não retornada pelo servidor');
      }
      
      setImagem(response.url);
      
      toast({
        title: 'Sucesso',
        description: 'Imagem enviada com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      console.error('📄 Detalhes do erro:', JSON.stringify(error, null, 2));
      
      let errorMessage = 'Erro ao enviar imagem';
      
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

  const handleFileChange2 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadProdutoImagem(file);
      if (!response.url) {
        throw new Error('URL da imagem não retornada pelo servidor');
      }
      setFoto2(response.url);
      toast({
        title: 'Sucesso',
        description: 'Imagem 2 enviada com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao enviar imagem 2',
        status: 'error',
        duration: 5000,
      });
    } finally {
      if (fileInputRef2.current) {
        fileInputRef2.current.value = '';
      }
    }
  };

  const handleFileChange3 = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await uploadProdutoImagem(file);
      if (!response.url) {
        throw new Error('URL da imagem não retornada pelo servidor');
      }
      setFoto3(response.url);
      toast({
        title: 'Sucesso',
        description: 'Imagem 3 enviada com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: 'Erro ao enviar imagem 3',
        status: 'error',
        duration: 5000,
      });
    } finally {
      if (fileInputRef3.current) {
        fileInputRef3.current.value = '';
      }
    }
  };

  const handleRemoveImagem = () => {
    setImagem('');
  };

  const handleRemoveFoto2 = () => {
    setFoto2('');
  };

  const handleRemoveFoto3 = () => {
    setFoto3('');
  };

  // Função para lidar com mudanças no campo de preço
  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Se está vazio, limpar tudo
    if (!inputValue) {
      setPreco(undefined);
      setPrecoFormatado('');
      return;
    }

    // Extrair apenas números da string
    const numbersOnly = inputValue.replace(/\D/g, '');
    
    // Se não há números, não fazer nada
    if (!numbersOnly) return;
    
    // Converter para número com centavos
    const numericValue = parseFloat(numbersOnly) / 100;
    
    // Atualizar estados
    setPreco(numericValue);
    setPrecoFormatado(formatPreco(numericValue));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const produtoData = {
        nome: nome.trim(),
        imagem: imagem.trim() || undefined,
        foto2: foto2.trim() || undefined,
        foto3: foto3.trim() || undefined,
        descricao: descricao.trim() || undefined,
        preco: preco,
        categoria: categoria.trim() || undefined,
        marcaId: marcaId.trim() || undefined,
        barcode: barcode.trim() || undefined,
        codsys: codsys.trim() || undefined,
      };

      if (isEditing) {
        await updateProduto({ id: produto.id, ...produtoData }).unwrap();
        toast({
          title: 'Produto atualizado',
          description: 'Produto atualizado com sucesso!',
          status: 'success',
          duration: 3000,
        });
      } else {
        await createProduto(produtoData).unwrap();
        toast({
          title: 'Produto criado',
          description: 'Produto criado com sucesso!',
          status: 'success',
          duration: 3000,
        });
      }

      onSuccess?.();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error?.data?.message || 'Erro ao salvar produto',
        status: 'error',
        duration: 5000,
      });
    }
  };

  // Função helper para renderizar cada campo de imagem
  const renderImageField = (
    value: string,
    onSelect: () => void,
    onRemove: () => void,
    label: string,
    inputRef: React.RefObject<HTMLInputElement>,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  ) => {
    return (
      <VStack spacing={2} align="center">
        <Text fontSize="sm" fontWeight="semibold" color="gray.600">
          {label}
        </Text>
        {value ? (
          <Box position="relative" display="inline-block" role="group">
            <Image
              src={getImageUrl(value)}
              alt={label}
              boxSize="100px"
              objectFit="cover"
              borderRadius="lg"
              border="2px solid"
              borderColor="gray.200"
              shadow="sm"
            />
            {/* Ícones que aparecem só no hover */}
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
                aria-label={`Alterar ${label.toLowerCase()}`}
                icon={<AttachmentIcon />}
                size="xs"
                variant="ghost"
                colorScheme="blue"
                bg="white"
                _hover={{ bg: "blue.100" }}
                onClick={onSelect}
                isDisabled={isLoading}
                borderRadius="full"
                shadow="md"
              />
              <IconButton
                aria-label={`Remover ${label.toLowerCase()}`}
                icon={<DeleteIcon />}
                size="xs"
                variant="ghost"
                colorScheme="red"
                bg="white"
                _hover={{ bg: "red.100" }}
                onClick={onRemove}
                isDisabled={isLoading}
                borderRadius="full"
                shadow="md"
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
            onClick={onSelect}
            bg={isLoading ? "gray.100" : "white"}
            width="100px"
            height="100px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            transition="all 0.2s"
            shadow="sm"
          >
            <VStack spacing={1}>
              <AttachmentIcon boxSize={5} color="gray.400" />
              <Text color="gray.500" fontSize="xs" fontWeight="medium">
                Adicionar
              </Text>
            </VStack>
          </Box>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={onChange}
          disabled={isLoading}
        />
      </VStack>
    );
  };

  return (
    <VStack as="form" spacing={6} onSubmit={handleSubmit}>
      {/* Linha 1: Nome e Categoria */}
      <HStack spacing={4} width="100%" align="start">
        <FormControl isInvalid={!!errors.nome} flex={2}>
          <FormLabel>Nome *</FormLabel>
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome do produto"
            isDisabled={isLoading}
          />
          <FormErrorMessage>{errors.nome}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.categoria} flex={1}>
          <FormLabel>Categoria</FormLabel>
          <Input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            placeholder="Categoria do produto"
            isDisabled={isLoading}
          />
          <FormErrorMessage>{errors.categoria}</FormErrorMessage>
        </FormControl>
      </HStack>

      {/* Linha 2: Marca e Preço */}
      <HStack spacing={4} width="100%" align="start">
        <FormControl isInvalid={!!errors.marcaId} flex={2}>
          <FormLabel>Marca</FormLabel>
          <Box position="relative">
            <Input
              ref={marcaInputRef}
              placeholder="Digite para buscar uma marca..."
              value={marcaSearchTerm}
              onChange={(e) => {
                setMarcaSearchTerm(e.target.value);
                setShowMarcaDropdown(true);
                setSelectedIndex(-1);
                // Se não há texto de busca e há uma marca selecionada, limpar a seleção
                if (!e.target.value && marcaId) {
                  setMarcaId('');
                }
              }}
              onFocus={() => {
                // Se há uma marca selecionada, mostrar seu nome no campo de busca
                if (marcaId && !marcaSearchTerm) {
                  const marcaSelecionada = marcas.find(m => m.id === marcaId);
                  if (marcaSelecionada) {
                    setMarcaSearchTerm(marcaSelecionada.nome);
                  }
                }
                setShowMarcaDropdown(true);
                setSelectedIndex(-1);
              }}
              isDisabled={isLoading}
              onKeyDown={handleKeyDown}
            />
            
            {/* Dropdown com opções filtradas */}
            {showMarcaDropdown && (
              <Box
                ref={marcaDropdownRef}
                position="absolute"
                top="100%"
                left={0}
                right={0}
                zIndex={10}
                bg={dropdownBg}
                border="1px solid"
                borderColor={dropdownBorder}
                borderRadius="md"
                maxH="200px"
                overflowY="auto"
                shadow="lg"
                mt={1}
              >
                {filteredMarcas.length > 0 ? (
                  filteredMarcas.map((marca, index) => {
                    const isSelected = marcaId === marca.id;
                    const isHighlighted = selectedIndex === index;
                    const shouldHighlight = isHighlighted || (isSelected && selectedIndex === -1);
                    
                    return (
                      <Box
                        key={marca.id}
                        p={3}
                        cursor="pointer"
                        _hover={{ bg: itemHoverBg }}
                        bg={shouldHighlight ? selectedBg : undefined}
                        borderBottom="1px solid"
                        borderColor={dropdownBorder}
                        onClick={() => {
                          handleSelectMarca(marca);
                        }}
                      >
                        <VStack align="start" spacing={1}>
                          <Text 
                            fontWeight={shouldHighlight ? 'bold' : 'normal'}
                            color={textColor}
                          >
                            {marca.nome}
                          </Text>
                          {marca.descricao && (
                            <Text fontSize="xs" color={descriptionColor} noOfLines={1}>
                              {marca.descricao}
                            </Text>
                          )}
                        </VStack>
                      </Box>
                    );
                  })
                ) : (
                  <Box p={3}>
                    <Text color={noResultsColor} fontSize="sm">Nenhuma marca encontrada</Text>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <FormErrorMessage>{errors.marcaId}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.preco} flex={1}>
          <FormLabel>Preço</FormLabel>
          <Input
            type="text"
            value={precoFormatado}
            onChange={handlePrecoChange}
            placeholder="R$ 0,00"
            isDisabled={isLoading}
          />
          <FormErrorMessage>{errors.preco}</FormErrorMessage>
        </FormControl>
      </HStack>

      {/* Linha 3: Código e Código de Barras */}
      <HStack spacing={4} width="100%" align="start">
        <FormControl isInvalid={!!errors.codsys} flex={1}>
          <FormLabel>Código</FormLabel>
          <Input
            type="text"
            value={codsys}
            onChange={(e) => setCodsys(e.target.value)}
            placeholder="Código do produto"
            isDisabled={isLoading}
          />
          <FormErrorMessage>{errors.codsys}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.barcode} flex={1}>
          <FormLabel>Código de Barras</FormLabel>
          <Input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Código de barras"
            isDisabled={isLoading}
          />
          <FormErrorMessage>{errors.barcode}</FormErrorMessage>
        </FormControl>
      </HStack>

      {/* Linha 4: Descrição */}
      <FormControl isInvalid={!!errors.descricao} width="100%">
        <FormLabel>Descrição</FormLabel>
        <Textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descrição do produto"
          resize="vertical"
          rows={3}
          isDisabled={isLoading}
        />
        <FormErrorMessage>{errors.descricao}</FormErrorMessage>
      </FormControl>

      {/* Linha 5: Upload de Imagens */}
      <FormControl width="100%">
        <FormLabel mb={4}>Imagens do Produto</FormLabel>
        <HStack spacing={6} align="start" justify="center">
          {renderImageField(
            imagem,
            handleFileSelect,
            handleRemoveImagem,
            "IMG 1",
            fileInputRef,
            handleFileChange
          )}
          {renderImageField(
            foto2,
            handleFileSelect2,
            handleRemoveFoto2,
            "IMG 2",
            fileInputRef2,
            handleFileChange2
          )}
          {renderImageField(
            foto3,
            handleFileSelect3,
            handleRemoveFoto3,
            "IMG 3",
            fileInputRef3,
            handleFileChange3
          )}
        </HStack>
        
        {isUploadingImagem && (
          <Text fontSize="xs" color="blue.500" mt={3} textAlign="center">
            Enviando imagem...
          </Text>
        )}
        
        <Text fontSize="xs" color="gray.500" mt={3} textAlign="center">
          Formatos aceitos: JPEG, PNG, GIF (máx. 5MB cada)
        </Text>
      </FormControl>

      {/* Botões de ação */}
      <Flex gap={3} width="100%" justify="flex-end" pt={2}>
        <Button 
          variant="outline" 
          onClick={onCancel}
          isDisabled={isLoading}
          minW="100px"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          colorScheme="pink"
          isLoading={isLoading}
          loadingText={isEditing ? 'Atualizando...' : 'Criando...'}
          minW="120px"
        >
          {isEditing ? 'Atualizar' : 'Criar'} Produto
        </Button>
      </Flex>
    </VStack>
  );
};

export default ProdutoForm;