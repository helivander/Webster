import {
  Box,
  Text,
  Image,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Tooltip,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  useColorMode,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { useRef } from 'react';
import { Marca } from '~/types/marca';
import { useDeleteMarcaMutation } from '~/store/api/marca-api-slice';

interface MarcaItemProps {
  marca: Marca;
  onEdit: (marca: Marca) => void;
}

const MarcaItem = ({ marca, onEdit }: MarcaItemProps) => {
  const { colorMode } = useColorMode();
  const bg = useColorModeValue('white', 'gray.800');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [deleteMarca, { isLoading: isDeleting }] = useDeleteMarcaMutation();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await deleteMarca(marca.id).unwrap();
      toast({
        title: 'Marca excluída',
        description: 'Marca excluída com sucesso!',
        status: 'success',
        duration: 3000,
      });
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error?.data?.message || 'Erro ao excluir marca',
        status: 'error',
        duration: 5000,
      });
    }
  };

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

  return (
    <>
      <Box
        p={3}
        bg={bg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        _hover={{ bg: hoverBg }}
        transition="background-color 0.2s"
        cursor="pointer"
        onClick={() => onEdit(marca)}
        position="relative"
        role="group"
      >
        <VStack spacing={2} align="stretch">
          {/* Logo da marca */}
          {marca.logo ? (
            <Image
              src={getImageUrl(marca.logo)}
              alt={marca.nome}
              maxH="60px"
              objectFit="contain"
              fallback={
                <Box
                  h="60px"
                  bg="gray.100"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  borderRadius="md"
                >
                  <Text fontSize="sm" color="gray.500">
                    Sem logo
                  </Text>
                </Box>
              }
            />
          ) : (
            <Box
              h="60px"
              bg="gray.100"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
            >
              <Text fontSize="sm" color="gray.500">
                Sem logo
              </Text>
            </Box>
          )}

          {/* Nome da marca */}
          <Text
            fontWeight="semibold"
            fontSize="sm"
            textAlign="center"
            isTruncated
            title={marca.nome}
          >
            {marca.nome}
          </Text>

          {/* Descrição (se houver) */}
          {marca.descricao && (
            <Text
              fontSize="xs"
              color="gray.600"
              textAlign="center"
              noOfLines={2}
              title={marca.descricao}
            >
              {marca.descricao}
            </Text>
          )}
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
          <Tooltip label="Editar marca">
            <IconButton
              aria-label="Editar marca"
              icon={<EditIcon />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              bg="white"
              _hover={{ bg: "blue.100" }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(marca);
              }}
              shadow="md"
            />
          </Tooltip>
          
          <Tooltip label="Excluir marca">
            <IconButton
              aria-label="Excluir marca"
              icon={<DeleteIcon />}
              size="sm"
              variant="ghost"
              colorScheme="red"
              bg="white"
              _hover={{ bg: "red.100" }}
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              shadow="md"
            />
          </Tooltip>
        </HStack>
      </Box>

      {/* Dialog de confirmação para exclusão */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Marca
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir a marca &quot;{marca.nome}&quot;? 
              Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancelar
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete}
                ml={3}
                isLoading={isDeleting}
                loadingText="Excluindo..."
              >
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default MarcaItem; 