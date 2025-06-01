import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  SimpleGrid,
  Image,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { Produto } from '~/types/produto';

interface ProdutoImageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto;
  onImageSelect: (imageUrl: string) => void;
}

const ProdutoImageSelectModal = ({ isOpen, onClose, produto, onImageSelect }: ProdutoImageSelectModalProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.600');

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

  const images = [
    { url: buildImageUrl(produto.imagem), label: 'Principal' },
    { url: buildImageUrl(produto.foto2), label: 'Foto 2' },
    { url: buildImageUrl(produto.foto3), label: 'Foto 3' },
  ].filter(img => img.url); // Filtra apenas imagens que têm URL

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Selecionar Imagem do Produto</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <SimpleGrid columns={3} spacing={4}>
            {images.map((image, index) => (
              <Box
                key={index}
                cursor="pointer"
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
                overflow="hidden"
                transition="all 0.2s"
                _hover={{
                  transform: 'scale(1.02)',
                  shadow: 'md',
                  bg: hoverBg,
                }}
                onClick={() => {
                  onImageSelect(image.url);
                  onClose();
                }}
              >
                <Image
                  src={image.url}
                  alt={`${produto.nome} - ${image.label}`}
                  width="100%"
                  height="120px"
                  objectFit="cover"
                />
                <Text
                  fontSize="sm"
                  p={2}
                  textAlign="center"
                  fontWeight="medium"
                >
                  {image.label}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProdutoImageSelectModal; 