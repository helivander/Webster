import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Badge,
  useDisclosure,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon, AddIcon } from '@chakra-ui/icons';
import { Produto } from '~/types/produto';
import { useDeleteProdutoMutation } from '~/store/api/produto-api-slice';
import ProdutoImageSelectModal from './ProdutoImageSelectModal';

interface ProdutoItemProps {
  produto: Produto;
  onEdit: (produto: Produto) => void;
  onAddToCanvas?: (produto: Produto, imageUrl: string) => void;
}

const ProdutoItem = ({ produto, onEdit, onAddToCanvas }: ProdutoItemProps) => {
  const [deleteProduto] = useDeleteProdutoMutation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

  const handleEdit = () => {
    onEdit(produto);
  };

  const handleAddToCanvas = (imageUrl: string) => {
    onAddToCanvas?.(produto, imageUrl);
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
    <>
      <Box
        role="group"
        position="relative"
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        overflow="hidden"
        bg={bgColor}
        _hover={{ bg: hoverBg }}
      >
        <Box position="relative" height="200px">
          <Image
            src={imageUrl || '/placeholder-produto.png'}
            alt={produto.nome}
            width="100%"
            height="100%"
            objectFit="cover"
          />
          {produto.marca?.logo && (
            <Box
              position="absolute"
              bottom="2"
              right="2"
              bg="white"
              borderRadius="md"
              p="1"
              maxW="80px"
              maxH="40px"
            >
              <Image
                src={`${import.meta.env.VITE_API_URL}${produto.marca.logo}`}
                alt={produto.marca.nome}
                maxH="30px"
                objectFit="contain"
              />
            </Box>
          )}
        </Box>

        <VStack align="stretch" p="4" spacing="2">
          <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
            {produto.nome}
          </Text>
          {produto.descricao && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {produto.descricao}
            </Text>
          )}
          {produto.categoria && (
            <Badge colorScheme="pink" alignSelf="flex-start">
              {produto.categoria}
            </Badge>
          )}
          {produto.preco && (
            <Text fontWeight="bold" fontSize="lg" color="pink.500">
              {formatPrice(produto.preco)}
            </Text>
          )}
        </VStack>

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
            onClick={onOpen}
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

      <ProdutoImageSelectModal
        isOpen={isOpen}
        onClose={onClose}
        produto={produto}
        onImageSelect={handleAddToCanvas}
      />
    </>
  );
};

export default ProdutoItem; 