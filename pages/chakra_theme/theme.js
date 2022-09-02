import {
  ThemeProvider as NextThemeProvider,
  useTheme as useNextTheme,
} from "next-themes";

import {
  ColorModeProvider,
  CSSReset,
  GlobalStyle,
  PortalManager,
  theme,
  ThemeProvider as ChakraThemeProvider,
} from "@chakra-ui/react";

function CustomChakraProvider({ children }) {
  const { resolvedTheme } = useNextTheme();

  return (
    <ChakraThemeProvider theme={theme}>
      <ColorModeProvider
        options={{
          initialColorMode: "dark",
          colors: {
            accent: "#FEFE0E",
          },
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
