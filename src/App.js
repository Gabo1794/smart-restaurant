import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login/Index";
import Menu from "./components/Menu/Index";
import Admin from "./components/Admin/Index";
import "./App.less";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login}></Route>
        <Route path="/menu/:rid" component={Menu}></Route>
        <Route path="/admin" component={Admin}></Route>
      </Switch>
    </Router>
  );
};

export default App;
