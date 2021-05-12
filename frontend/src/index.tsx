import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
import { ChakraProvider, ColorModeProvider, theme } from "@chakra-ui/react";
const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache: new InMemoryCache(),
});
ReactDOM.render(
  <ChakraProvider resetCSS theme={theme}>
    <ColorModeProvider
      options={{ useSystemColorMode: false }}
    ></ColorModeProvider>
    <React.StrictMode>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
