import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { Produto } from '~/types/produto';
import { useDeleteProdutoMutation } from '~/store/api/produto-api-slice';

interface ProdutoItemProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onAddToCanvas?: (produto: Produto) => void;
}

const ProdutoItem = ({ produto, onEdit, onAddToCanvas }: ProdutoItemProps) => {
  const [deleteProduto] = useDeleteProdutoMutation();
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  const handleEdit = () => {
    onEdit(produto);
  };

  const handleAddToCanvas = () => {
    onAddToCanvas?.(produto);
  };

  const handleDelete = async () => {
    if (window.confirm(`Tem certeza que deseja excluir o produto "${produto.nome}"?`)) {
      try {
        await deleteProduto(produto.id).unwrap();
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
      }
    }
  };

  // Função para construir URL da imagem
  const buildImageUrl = (path?: string | null): string => {
    if (!path) return '';
    
    // Se o path já for o caminho completo (e.g. /public/uploads/produtos/...), usa-o
    if (path.startsWith('/public/uploads/produtos/')) {
      return `${import.meta.env.VITE_API_URL}${path}`;
    }
    // Caso contrário, assume que é apenas o nome do arquivo
    return `${import.meta.env.VITE_API_URL}/public/uploads/produtos/${path.split('/').pop()}`;
  };

  const imageUrl = buildImageUrl(produto.imagem);

  const formatPrice = (price?: number | null) => {
    if (!price) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Box
      p={4}
      border="1px"
      borderColor={borderColor}
      borderRadius="md"
      bg={bgColor}
      _hover={{ bg: hoverBg }}
      position="relative"
      cursor="pointer"
      onClick={handleEdit}
      role="group"
    >
      <VStack align="stretch" spacing={3}>
        {imageUrl && (
          <Box
            position="relative"
            width="100%"
            height="120px"
            overflow="hidden"
            borderRadius="md"
            bg="gray.100"
          >
            <Image
              src={imageUrl}
              alt={produto.nome}
              objectFit="cover"
              width="100%"
              height="100%"
              fallback={
                <Box
                  width="100%"
                  height="100%"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="sm" color="gray.500">
                    Sem imagem
                  </Text>
                </Box>
              }
            />
          </Box>
        )}
        
        <VStack align="stretch" spacing={2}>
          <Text fontWeight="bold" fontSize="md" noOfLines={2}>
            {produto.nome}
          </Text>
          
          {produto.preco && (
            <Text fontSize="lg" fontWeight="bold" color="green.500">
              {formatPrice(produto.preco)}
            </Text>
          )}
          
          {produto.categoria && (
            <Badge colorScheme="blue" size="sm" alignSelf="flex-start">
              {produto.categoria}
            </Badge>
          )}
          
          {produto.descricao && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {produto.descricao}
            </Text>
          )}
        </VStack>
      </VStack>

      {/* Ícones que aparecem só no hover */}
      <HStack
        position="absolute"
        top="2"
        right="2"
        spacing={1}
        opacity={0}
        _groupHover={{ opacity: 1 }}
        transition="opacity 0.2s"
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          aria-label="Editar produto"
          icon={<EditIcon />}
          size="sm"
          variant="ghost"
          colorScheme="blue"
          bg="white"
          _hover={{ bg: "blue.100" }}
          onClick={handleEdit}
          shadow="md"
        />
        <IconButton
          aria-label="Adicionar ao canvas"
          icon={<AddIcon />}
          size="sm"
          variant="ghost"
          colorScheme="green"
          bg="white"
          _hover={{ bg: "green.100" }}
          onClick={handleAddToCanvas}
          shadow="md"
        />
        <IconButton
          aria-label="Excluir produto"
          icon={<DeleteIcon />}
          size="sm"
          variant="ghost"
          colorScheme="red"
          bg="white"
          _hover={{ bg: "red.100" }}
          onClick={handleDelete}
          shadow="md"
        />
      </HStack>
    </Box>
  );
};

export default ProdutoItem; 