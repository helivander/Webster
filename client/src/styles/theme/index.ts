import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `"Inter", sans-serif`,
    body: `"Inter", sans-serif`,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'white',
        color: props.colorMode === 'dark' ? 'gray.100' : 'gray.900',
      },
    }),
  },
  semanticTokens: {
    colors: {
      primary: {
        default: 'pink.500',
        _dark: 'pink.300',
      },
      bg: {
        default: 'white',
        _dark: 'gray.900',
      },
      text: {
        default: 'gray.900',
        _dark: 'gray.100',
      },
      card: {
        default: 'white',
        _dark: 'gray.800',
      },
      border: {
        default: 'gray.200',
        _dark: 'gray.700',
      },
    },
  },
});

export default theme;
