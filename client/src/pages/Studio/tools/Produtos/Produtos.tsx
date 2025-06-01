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
  useToast,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useGetProdutosQuery } from '~/store/api/produto-api-slice';
import { Produto } from '~/types/produto';
import ProdutoForm from './ProdutoForm';
import ProdutoItem from './ProdutoItem';
import useStageObject from '~/hooks/use-stage-object';
import { DEFAULT_IMAGE_OBJECT } from '~/consts/stage-object';

const Produtos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduto, setEditingProduto] = useState<Produto | undefined>();
  
  const { data: produtos, isLoading, error } = useGetProdutosQuery();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { createOne } = useStageObject();

  const handleCreateNew = () => {
    setEditingProduto(undefined);
    onOpen();
  };

  const handleEdit = (produto: Produto) => {
    setEditingProduto(produto);
    onOpen();
  };

  const handleAddToCanvas = (produto: Produto, imageUrl: string) => {
    if (!imageUrl) {
      toast({
        title: 'Erro',
        description: 'Imagem não encontrada.',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    // Adicionar a imagem do produto ao canvas
    createOne({
      src: imageUrl,
      ...DEFAULT_IMAGE_OBJECT,
    });
    
    toast({
      title: 'Produto adicionado',
      description: `${produto.nome} foi adicionado ao canvas!`,
      status: 'success',
      duration: 3000,
    });
  };

  const handleFormSuccess = () => {
    onClose();
    setEditingProduto(undefined);
  };

  const handleCancel = () => {
    onClose();
    setEditingProduto(undefined);
  };

  const filteredProdutos = produtos?.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.categoria?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <Text>Carregando produtos...</Text>;
  }

  if (error) {
    return <Text>Erro ao carregar produtos</Text>;
  }

  return (
    <VStack align="stretch" h="100%" spacing={4}>
      <Flex align="center" justify="flex-start" p={2}>
        <IconButton aria-label="Criar novo produto" icon={<AddIcon />} onClick={handleCreateNew} />
        <InputGroup ml={2} flex="1">
          <Input
            type="search"
            variant="filled"
            focusBorderColor="pink.500"
            placeholder="Buscar produto"
            width="100%"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>

      <Box flex="1" overflowY="auto" px={2} pb={2}>
        {!filteredProdutos.length ? (
          <Text>Nenhum produto encontrado</Text>
        ) : (
          <SimpleGrid columns={2} spacing={4}>
            {filteredProdutos.map((produto) => (
              <ProdutoItem
                key={produto.id}
                produto={produto}
                onEdit={handleEdit}
                onAddToCanvas={handleAddToCanvas}
              />
            ))}
          </SimpleGrid>
        )}
      </Box>

      <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        isCentered 
        scrollBehavior="inside"
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent maxW="800px" maxH="90vh">
          <ModalHeader fontSize="lg" fontWeight="bold">
            {editingProduto ? 'Editar Produto' : 'Novo Produto'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <ProdutoForm
              produto={editingProduto}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Produtos; 