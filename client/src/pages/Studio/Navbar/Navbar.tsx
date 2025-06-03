import { Box, Flex, Heading, HStack, IconButton, useColorMode } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LOGO_FONT } from '~/consts/components';
import { useAppSelector } from '~/hooks/use-app-selector';
import { setStage, setSize } from '~/store/slices/frame-slice';
import { useEffect, useRef } from 'react';
import { useLazyGetCanvasQuery } from '~/store/api/canvas-slice';
import ProfileMenu from '~/components/ProfileMenu';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const dispatch = useDispatch();
  const { stage } = useAppSelector((state) => state.frame);
  const [getCanvas] = useLazyGetCanvasQuery();
  const { colorMode, toggleColorMode } = useColorMode();
  const lastLoadedId = useRef<string | null>(null);

  useEffect(() => {
    // Só carrega se houver um ID e se não for o mesmo que acabamos de carregar
    if (stage.id && stage.id !== lastLoadedId.current) {
      lastLoadedId.current = stage.id;
      getCanvas(stage.id)
        .unwrap()
        .then((data) => {
          dispatch(setStage({ ...data }));
          // Atualiza as dimensões do canvas
          dispatch(setSize({
            width: data.width || 1080,
            height: data.height || 1080
          }));
        })
        .catch((err) => {
          console.error(err);
          lastLoadedId.current = null; // Reseta em caso de erro
        });
    }
  }, [dispatch, getCanvas, stage.id]);

  return (
    <Box
      as="nav"
      id="navbar"
      position="sticky"
      top={0}
      borderBottom="0px"
      bgGradient="linear(to-r, pink.500, purple.500)"
      zIndex={1000}
    >
      {/* TODO: Adicionar o logo do encartei */}
      <Flex px={4} h={14} alignItems="center" justifyContent="space-between">
        <Link to="/">
          <Heading
            as="h1"
            fontSize="xl"
            fontFamily={LOGO_FONT}
            bgGradient="linear(to-r, pink.100, pink.100)"
            bgClip="text"
          >
            Encartei
          </Heading>
        </Link>

        <HStack spacing={4}>
          <IconButton
            aria-label="Alternar tema"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
          />
          <ProfileMenu />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
