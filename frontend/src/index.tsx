import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider, ColorModeProvider, theme } from "@chakra-ui/react";

ReactDOM.render(
  <ChakraProvider resetCSS theme={theme}>
    <ColorModeProvider
      options={{ useSystemColorMode: false }}
    ></ColorModeProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
