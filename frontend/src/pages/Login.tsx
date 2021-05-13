import { Button } from "@chakra-ui/button";
import { Box, Heading } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import React from "react";
import { RouteComponentProps } from "react-router";
import { setAccessToken } from "../accessToken";
import { InputField } from "../components/InputField";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";
import { toMapError } from "../utils/toMapError";

interface LoginProps extends RouteComponentProps<any> {}

const Login: React.FC<LoginProps> = ({ history }) => {
  const [login] = useLoginMutation();
  return (
    <>
      <Box ml="auto" maxW="30%" mr="auto" mt="40px">
        <Heading mb="20px">Login </Heading>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async ({ email, password }, { setErrors }) => {
            const response = await login({
              variables: { email, password },
              update: (store, { data }) => {
                if (!data) {
                  return null;
                }
                store.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data.login.user,
                  },
                });
              },
            });
            if (response.data?.login.errors) {
              setErrors(toMapError(response.data.login.errors));
            } else if (response.data?.login.user) {
              //work
              if (response && response.data.login.accessToken) {
                setAccessToken(response.data.login.accessToken);
              }
              history.push("/");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField name="email" placeholder="Email" label="Email" />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <Button
                type="submit"
                colorScheme="orange"
                mt="30px"
                isLoading={isSubmitting}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};
export default Login;
