import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

interface RoutesProps {}

const Routes: React.FC<RoutesProps> = () => {
  return (
    <>
      <BrowserRouter>
        <>
          <Header />
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/register" component={Register} />
            <Route path="/login" component={Login} />
          </Switch>
        </>
      </BrowserRouter>
    </>
  );
};
export default Routes;
