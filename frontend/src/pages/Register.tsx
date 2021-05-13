import { Button } from "@chakra-ui/button";
import { Box, Heading } from "@chakra-ui/layout";
import { Form, Formik } from "formik";
import React from "react";
import { RouteComponentProps } from "react-router";
import { InputField } from "../components/InputField";
import { useRegisterMutation } from "../generated/graphql";
import { toMapError } from "../utils/toMapError";

interface RegisterProps extends RouteComponentProps<any> {}

const Register: React.FC<RegisterProps> = ({ history }) => {
  const [register] = useRegisterMutation();
  return (
    <>
      <Box ml="auto" maxW="30%" mr="auto" mt="40px">
        <Heading mb="20px">Register </Heading>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={async ({ email, password }, { setErrors }) => {
            const response = await register({ variables: { email, password } });
            if (response.data?.register.errors) {
              setErrors(toMapError(response.data.register.errors));
            } else if (response.data?.register.user) {
              //work
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
                colorScheme="twitter"
                mt="30px"
                isLoading={isSubmitting}
              >
                Register
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </>
  );
};
export default Register;
