import Document, { Head, Html, Main, NextScript } from "next/document";
import React from "react";
import theme from "./chakra_theme/theme";
import { FlashlessScript } from "chakra-ui-flashless";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <body>
          <FlashlessScript theme={theme} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
