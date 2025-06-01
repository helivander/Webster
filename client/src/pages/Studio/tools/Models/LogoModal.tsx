import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Box,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { StageObject, StageObjectType, StageObjectData } from '~/types/stage-object';
import useStageObject from '~/hooks/use-stage-object';
import { nanoid } from 'nanoid';

type LogoType = {
  id: string;
  name: string;
  width: number;
  height: number;
  ratio: string;
};

const logoTypes: LogoType[] = [
  {
    id: '1-1',
    name: 'Logo Quadrada',
    width: 300,
    height: 300,
    ratio: '1:1'
  },
  {
    id: '1-4',
    name: 'Logo Horizontal',
    width: 400,
    height: 100,
    ratio: '1:4'
  },
  {
    id: '4-3',
    name: 'Logo Vertical',
    width: 300,
    height: 400,
    ratio: '4:3'
  }
];

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const LogoModal = ({ isOpen, onClose }: Props) => {
  const { createOne } = useStageObject();
  const bgBox = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSelectLogo = (logo: LogoType) => {
    // Adiciona um novo objeto de logo ao stage
    const logoData: StageObjectData = {
      type: StageObjectType.SHAPE,
      shapeType: 'rect',
      x: 100,
      y: 100,
      width: logo.width,
      height: logo.height,
      offsetX: logo.width / 2, // Centraliza o ponto de origem
      offsetY: logo.height / 2, // Centraliza o ponto de origem
      scaleX: 1,
      scaleY: 1,
      rotation: 0,
      fill: '#D53F8C', // Rosa do Chakra UI
      stroke: '#97266D',
      strokeWidth: 2,
      draggable: true,
      name: `logo-${logo.ratio}`,
      z_index: 1,
      updatedAt: Date.now(),
      lockAspectRatio: true, // Bloqueia a proporção
    };

    createOne(logoData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Selecione o Tipo de Logo</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <SimpleGrid columns={3} spacing={4}>
            {logoTypes.map((logo) => (
              <Box
                key={logo.id}
                bg={bgBox}
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor={borderColor}
                cursor="pointer"
                onClick={() => handleSelectLogo(logo)}
                _hover={{
                  transform: 'scale(1.02)',
                  borderColor: 'pink.400',
                }}
                transition="all 0.2s"
              >
                <Box
                  bg="pink.500"
                  width={`${logo.width / 4}px`}
                  height={`${logo.height / 4}px`}
                  mx="auto"
                  mb={2}
                  borderRadius="sm"
                />
                <Text fontSize="sm" fontWeight="medium" textAlign="center">
                  {logo.name}
                </Text>
                <Text fontSize="xs" color="gray.500" textAlign="center">
                  {logo.ratio}
                </Text>
              </Box>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LogoModal; 