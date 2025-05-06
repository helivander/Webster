import { Box, Flex, Heading, HStack, IconButton, useColorMode } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LOGO_FONT } from '~/consts/components';
import { useAppSelector } from '~/hooks/use-app-selector';
import { setStage } from '~/store/slices/frame-slice';
import { useEffect } from 'react';
import { useLazyGetCanvasQuery } from '~/store/api/canvas-slice';
import ProfileMenu from '~/components/ProfileMenu';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const dispatch = useDispatch();
  const { stage } = useAppSelector((state) => state.frame);
  const [getCanvas] = useLazyGetCanvasQuery();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (stage.id) {
      getCanvas(stage.id)
        .unwrap()
        .then((data) => {
          dispatch(setStage({ ...data }));
        })
        .catch((err) => console.error(err));
    }
  }, [dispatch, getCanvas, stage.id]);

  return (
    <Box>
      <Flex bgGradient="linear(to-r, pink.500, purple.500)" py="2" align="center">
        <Link to="/">
          <Heading
            fontSize="28px"
            fontWeight="400"
            userSelect="none"
            color="white"
            ml="20px"
            mb="0"
            fontFamily={LOGO_FONT}
          >
            Encartei
          </Heading>
        </Link>
        <HStack spacing={4} ml="auto" pr={4}>
          <IconButton
            aria-label="Alternar modo escuro"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="white"
            _hover={{ bg: 'gray.700' }}
          />
          <ProfileMenu />
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
