import { extendTheme } from "@chakra-ui/react";
import { flashless } from "chakra-ui-flashless";

const theme = extendTheme(
  flashless({
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
  })
);

export default theme;
