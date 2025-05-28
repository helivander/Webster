import { useState } from 'react';
import {
  VStack,
  Text,
  SimpleGrid,
  IconButton,
  Flex,
  Input,
  InputGroup,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  useDisclosure,
  Box,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useGetMarcasQuery } from '~/store/api/marca-api-slice';
import { Marca } from '~/types/marca';
import MarcaForm from './MarcaForm';
import MarcaItem from './MarcaItem';

const Marcas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingMarca, setEditingMarca] = useState<Marca | undefined>();
  
  const { data: marcas, isLoading, error } = useGetMarcasQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCreateNew = () => {
    setEditingMarca(undefined);
    onOpen();
  };

  const handleEdit = (marca: Marca) => {
    setEditingMarca(marca);
    onOpen();
  };

  const handleFormSuccess = () => {
    onClose();
    setEditingMarca(undefined);
  };

  const handleCancel = () => {
    onClose();
    setEditingMarca(undefined);
  };

  const filteredMarcas = marcas?.filter((marca) =>
    marca.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    marca.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <Text>Carregando marcas...</Text>;
  }

  if (error) {
    return <Text>Erro ao carregar marcas</Text>;
  }

  return (
    <VStack align="stretch" h="100%" spacing={4}>
      <Flex align="center" justify="flex-start" p={2}>
        <IconButton aria-label="Criar nova marca" icon={<AddIcon />} onClick={handleCreateNew} />
        <InputGroup ml={2} flex="1">
          <Input
            type="search"
            variant="filled"
            focusBorderColor="pink.500"
            placeholder="Buscar marca"
            width="100%"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Box flex="1" overflowY="auto" px={2} pb={2}>
        {!filteredMarcas.length ? (
          <Text>Nenhuma marca encontrada</Text>
        ) : (
          <SimpleGrid columns={2} spacing={4}>
            {filteredMarcas.map((marca) => (
              <MarcaItem
                key={marca.id}
                marca={marca}
                onEdit={handleEdit}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent sx={{ p: 4 }}>
          <ModalHeader>
            {editingMarca ? 'Editar Marca' : 'Nova Marca'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MarcaForm
              marca={editingMarca}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Marcas; 