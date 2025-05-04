import { useState } from 'react';
import { VStack, Text, SimpleGrid, IconButton, Flex, Input, InputGroup } from '@chakra-ui/react';
import { useGetCanvasesQuery, useCreateCanvasMutation } from '~/store/api/canvas-slice';
import CanvasViewItem from '~/pages/Studio/canvas-actions/CanvasViewItem';
import { AddIcon } from '@chakra-ui/icons';

const Models = () => {
  // estado para controlar o termo de busca
  const [searchTerm, setSearchTerm] = useState('');
  const [createCanvas, { isLoading: isCreating }] = useCreateCanvasMutation();
  const { data, isLoading } = useGetCanvasesQuery({
    skip: 0,
    take: 10,
  });

  if (isLoading) {
    return <Text>Carregando modelos...</Text>;
  }

  return (
    <VStack align="stretch">
      <Flex align="center" justify="flex-start" p={2}>
        <IconButton
          aria-label="Criar novo modelo"
          icon={<AddIcon />}
          onClick={() =>
            createCanvas({
              name: 'Novo modelo',
              description: '',
              content: '',
            })
          }
          isLoading={isCreating}
        />
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
                onClose={() => {
                  // TODO: Implementar lógica de fechamento
                  console.log('Fechando canvas:', canvas.id);
                }}
              />
            ))}
        </SimpleGrid>
      )}
    </VStack>
  );
};

export default Models;
