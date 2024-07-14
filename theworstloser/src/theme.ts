import { extendTheme } from "@chakra-ui/react";
import "@fontsource/walter-turncoat";

const theme = extendTheme({
  fonts: {
    heading: `'Walter Turncoat', sans-serif`,
    body: `'Walter Turncoat', sans-serif`,
  },
});

export default theme;
