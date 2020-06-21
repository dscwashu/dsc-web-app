import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Dashboard from "../components/Dashboard";

const App: React.FC = function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">Login</Route>
        <Route path="/register">Register</Route>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
