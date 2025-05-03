import React from 'react';
import { VStack, Text, SimpleGrid } from '@chakra-ui/react';
import { useGetCanvasesQuery } from '~/store/api/canvas-slice';
import CanvasViewItem from '~/pages/Studio/canvas-actions/CanvasViewItem';

const Models = () => {
  const { data, isLoading } = useGetCanvasesQuery({
    skip: 0,
    take: 10,
  });

  if (isLoading) {
    return <Text>Carregando modelos...</Text>;
  }

  if (!data?.canvases?.length) {
    return <Text>Nenhum modelo encontrado</Text>;
  }

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <SimpleGrid columns={2} spacing={4}>
        {data.canvases.map((canvas) => (
          <CanvasViewItem
            key={canvas.id}
            {...canvas}
            onClose={() => {}}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

export default Models; 