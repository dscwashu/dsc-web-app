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
        <ExclusiveRoute type="public" path="/register">
          <Register />
        </ExclusiveRoute>
        <ExclusiveRoute type="public" path="/forgot">
          <ForgotPassword />
        </ExclusiveRoute>
        <ExclusiveRoute type="private" path="/dashboard">
          <Dashboard />
        </ExclusiveRoute>
        <Route path="/handler">
          <Handler />
        </Route>
        <Redirect to="/dashboard" />
      </Switch>
    </Router>
  );
};

export default App;
