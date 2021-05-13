import { Button } from "@chakra-ui/button";
import { Badge, Box, Flex } from "@chakra-ui/layout";
import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = (
      <Flex>
        <Box p="10px" m="10px" ml="20px">
          <Link to="/">Home</Link>
        </Box>
        <Box p="10px" m="10px" ml="20px">
          <Badge colorScheme="blue"> Hi, {data.me.email}</Badge>
        </Box>

        <Box p="10px" m="10px" ml="20px">
          <Button
            onClick={async () => {
              await logout();
              setAccessToken("");
              client.cache.reset();
            }}
          >
            Logout
          </Button>
        </Box>
      </Flex>
    );
  } else {
    body = (
      <Flex>
        <Box p="10px" m="10px" ml="20px">
          <Link to="/">Home</Link>
        </Box>
        <Box p="10px" m="10px" ml="20px">
          <Link to="/register">Register</Link>
        </Box>
        <Box p="10px" m="10px" ml="20px">
          <Link to="/login">Login</Link>
        </Box>
      </Flex>
    );
  }
  return <>{body}</>;
};
export default Header;
