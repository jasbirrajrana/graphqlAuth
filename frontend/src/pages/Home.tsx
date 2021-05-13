import { Heading, Text } from "@chakra-ui/layout";
import React from "react";
import { useByeQuery } from "../generated/graphql";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { data, error, loading } = useByeQuery({ fetchPolicy: "network-only" });
  if (loading) {
    return <Text>loading...</Text>;
  }

  if (error) {
    console.log(error);
    return <Text color="red">err</Text>;
  }

  if (!data) {
    return <Text>no data</Text>;
  }

  return (
    <Heading fontSize="8xl" color="orange">
      {data.bye}
    </Heading>
  );
};
export default Home;
