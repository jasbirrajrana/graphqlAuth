import { Heading } from "@chakra-ui/layout";
import * as React from "react";
import { setAccessToken } from "./accessToken";
import Routes from "./Routes";
interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    fetch("http://localhost:5000/refresh_token", {
      method: "POST",
      credentials: "include",
    }).then(async (x) => {
      const { accessToken } = await x.json();
      setAccessToken(accessToken);
      setLoading(false);
    });
  }, []);
  if (loading) {
    return (
      <>
        <Heading>Loading....</Heading>
      </>
    );
  }
  return (
    <>
      <Routes />
    </>
  );
};
export default App;
