import { gql, useQuery } from "@apollo/client";
import { Heading, Text } from "@chakra-ui/layout";
import React from "react";
import { useHelloQuery } from "./generated/graphql";

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const { loading, error, data } = useHelloQuery();
  return (
    <>
      {loading ? (
        <Text>Loading....</Text>
      ) : error ? (
        { error }
      ) : (
        <Heading>{JSON.stringify(data)}</Heading>
      )}
    </>
  );
};
export default App;
