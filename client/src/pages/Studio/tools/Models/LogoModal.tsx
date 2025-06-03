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
  Image,
  useToast,
} from '@chakra-ui/react';
import useStageObject from '~/hooks/use-stage-object';
import { DEFAULT_IMAGE_OBJECT } from '~/consts/stage-object';
import useLogo from '~/hooks/use-logo';

interface LogoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const logoOptions = [
  {
    id: '1-1',
    label: 'Quadrada (1:1)',
    src: '/public/logo1-1.webp',
    syssize: '1:1',
  },
  {
    id: '1-3',
    label: 'Retangular Horizontal (1:3)',
    src: '/public/logo1-3.webp',
    syssize: '1:3',
  },
  {
    id: '4-3',
    label: 'Retangular Vertical (4:3)',
    src: '/public/logo4-3.webp',
    syssize: '4:3',
  },
];

const LogoModal = ({ isOpen, onClose }: LogoModalProps) => {
  const { createOne } = useStageObject();
  const { getNextLogoNumber } = useLogo();
  const toast = useToast();

  const handleLogoSelect = (logo: typeof logoOptions[0]) => {
    const nextLogoNumber = getNextLogoNumber();
    const systype = `logo${nextLogoNumber}`;

    // Adicionar a logo ao canvas
    createOne({
      ...DEFAULT_IMAGE_OBJECT,
      src: `${import.meta.env.VITE_API_URL}${logo.src}`,
      systype,
      syssize: logo.syssize,
      draggable: true,
    });

    toast({
      title: 'Logo adicionada',
      description: `Logo ${logo.label} foi adicionada ao canvas!`,
      status: 'success',
      duration: 3000,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Selecione o Tipo de Logo</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <SimpleGrid columns={3} spacing={4}>
            {logoOptions.map((logo) => (
              <Box
                key={logo.id}
                cursor="pointer"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                onClick={() => handleLogoSelect(logo)}
                _hover={{ borderColor: 'pink.500', transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                <Image
                  src={`${import.meta.env.VITE_API_URL}${logo.src}`}
                  alt={logo.label}
                  width="100%"
                  height="auto"
                  objectFit="cover"
                />
                <Box p={2}>
                  <Text fontSize="sm" fontWeight="medium" textAlign="center">
                    {logo.label}
                  </Text>
                </Box>
              </Box>
            ))}
          </SimpleGrid>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LogoModal; 