import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Dashboard from "../routes/Dashboard";
import Login from "../routes/Login";
import Register from "../routes/Register";
import PrivateRoute from "../components/PrivateRoute";

const App: React.FC = function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <PrivateRoute path="/dashboard">
          <Dashboard />
        </PrivateRoute>
        <Redirect to="/dashboard" />
      </Switch>
    </Router>
  );
};

export default App;
