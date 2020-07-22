import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import Dashboard from "../routes/Dashboard";
import Login from "../routes/Login";
import Register from "../routes/Register";
import ForgotPassword from "../routes/ForgotPassword";
import Handler from "../routes/Handler";
import ExclusiveRoute from "../components/ExclusiveRoute";

const App: React.FC = function App() {
  return (
    <Router>
      <Switch>
        <ExclusiveRoute type="public" path="/login">
          <Login />
        </ExclusiveRoute>
        <Route path="/register">
          <Register />
        </Route>
        <ExclusiveRoute type="public" path="/forgot">
          <ForgotPassword />
        </ExclusiveRoute>
        <ExclusiveRoute type="private" path="/main">
          <Dashboard />
        </ExclusiveRoute>
        <Route path="/handler">
          <Handler />
        </Route>
        <Redirect to="/main" />
      </Switch>
    </Router>
  );
};

export default App;
