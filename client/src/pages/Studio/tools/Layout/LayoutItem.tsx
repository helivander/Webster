import {
  Box,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
  IconButton,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

interface LayoutItemProps {
  id: string;
  nome: string;
  descricao: string;
  largura: number;
  altura: number;
  onEdit: () => void;
  onDelete: () => void;
}

const LayoutItem = ({
  id,
  nome,
  descricao,
  largura,
  altura,
  onEdit,
  onDelete,
}: LayoutItemProps) => {
  const toast = useToast();

  const handleDelete = async () => {
    try {
      // TODO: Implementar a deleção do layout
      onDelete();
      toast({
        title: 'Layout excluído com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Erro ao excluir layout',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Card>
      <CardBody>
        <Stack spacing="3">
          <Box>
            <HStack justify="space-between" align="center">
              <Heading size="sm">{nome}</Heading>
              <HStack>
                <IconButton
                  aria-label="Editar layout"
                  icon={<HiOutlinePencil />}
                  size="sm"
                  variant="ghost"
                  onClick={onEdit}
                />
                <IconButton
                  aria-label="Excluir layout"
                  icon={<HiOutlineTrash />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={handleDelete}
                />
              </HStack>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {descricao}
            </Text>
          </Box>
          <Text fontSize="sm">
            Dimensões: {largura}px x {altura}px
          </Text>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default LayoutItem; 