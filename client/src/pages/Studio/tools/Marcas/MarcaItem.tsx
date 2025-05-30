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
    return `${import.meta.env.VITE_API_URL}${path}`;
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

          {/* Ações */}
          <HStack justify="center" spacing={1}>
            <Tooltip label="Editar marca">
              <IconButton
                aria-label="Editar marca"
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                colorScheme="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(marca);
                }}
              />
            </Tooltip>
            
            <Tooltip label="Excluir marca">
              <IconButton
                aria-label="Excluir marca"
                icon={<DeleteIcon />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpen();
                }}
              />
            </Tooltip>
          </HStack>
        </VStack>
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