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
} from '@chakra-ui/react';
import { useGetCanvasesQuery, useCreateCanvasMutation } from '~/store/api/canvas-slice';
import CanvasViewItem from '~/pages/Studio/canvas-actions/CanvasViewItem';
import { AddIcon } from '@chakra-ui/icons';
import CanvasCreateForm from '~/pages/Studio/canvas-actions/CanvasCreateForm';
import CanvasEdit from './CanvasEdit';
import { useAppSelector } from '~/hooks/use-app-selector';

type ViewMode = 'list' | 'edit';

const Models = () => {
  // estado para controlar o termo de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [, { isLoading: isCreating }] = useCreateCanvasMutation();
  const { data, isLoading } = useGetCanvasesQuery({
    skip: 0,
    take: 10,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { stage } = useAppSelector((state) => state.frame);

  if (isLoading) {
    return <Text>Carregando modelos...</Text>;
  }

  const handleEditClick = () => {
    setViewMode('edit');
  };

  const handleBackToList = () => {
    setViewMode('list');
  };

  if (viewMode === 'edit') {
    return <CanvasEdit onBack={handleBackToList} />;
  }

  // TODO: Implementar lógica de fechamento
  return (
    <VStack align="stretch">
      <Flex align="center" justify="flex-start" p={2}>
        <IconButton aria-label="Criar novo modelo" icon={<AddIcon />} onClick={onOpen} isLoading={isCreating} />
        <InputGroup ml={2} flex="1">
          <Input
            type="search"
            variant="filled"
            focusBorderColor="pink.500"
            placeholder="Buscar modelo"
            width="100%"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </Flex>
      {!data?.canvases?.length ? (
        <Text>Nenhum modelo encontrado</Text>
      ) : (
        <SimpleGrid columns={2} spacing={4}>
          {data.canvases
            .filter((canvas) => canvas.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((canvas) => (
              <CanvasViewItem
                key={canvas.id}
                {...canvas}
                onEdit={handleEditClick}
                onClose={() => {
                  // TODO: Implementar lógica de fechamento
                  console.log('Fechando canvas:', canvas.id);
                }}
              />
            ))}
        </SimpleGrid>
      )}

      <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent sx={{ p: 4 }}>
          <ModalHeader>Create a Canvas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <CanvasCreateForm />
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default Models;
