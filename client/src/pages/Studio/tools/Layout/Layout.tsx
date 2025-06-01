import { Box, HStack, Input, InputGroup, InputLeftElement, IconButton, VStack } from '@chakra-ui/react';
import { HiOutlinePlus, HiOutlineSearch } from 'react-icons/hi';
import LayoutForm from './LayoutForm';
import { useState } from 'react';

const Layout = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <VStack h="100%" spacing="4" p="4">
      <HStack w="100%" spacing="2">
        <LayoutForm />
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <HiOutlineSearch />
          </InputLeftElement>
          <Input
            placeholder="Buscar layouts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
      </HStack>
      <Box flex="1" w="100%" overflowY="auto">
        {/* Lista de layouts será adicionada aqui */}
      </Box>
    </VStack>
  );
};

export default Layout; 