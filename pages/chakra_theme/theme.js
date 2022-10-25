import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";

import {
  ColorModeProvider,
  CSSReset,
  GlobalStyle,
  PortalManager,
  extendTheme,
  ThemeProvider as ChakraThemeProvider,
} from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: `'Montserrat', sans-serif`,
  },
});

function CustomChakraProvider({ children }) {
  const { resolvedTheme } = useNextTheme();

  return (
    <ChakraThemeProvider theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: "dark",
        }}
        value={resolvedTheme}
      >
        <GlobalStyle />
        <CSSReset />
        <PortalManager>{children}</PortalManager>
      </ColorModeProvider>
    </ChakraThemeProvider>
  );
}

export function ThemeProvider({ children }) {
  return (
    <NextThemeProvider>
      <CustomChakraProvider>{children}</CustomChakraProvider>
    </NextThemeProvider>
  );
}

export default ThemeProvider;
