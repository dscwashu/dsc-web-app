import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from "react-router-dom";
import Main from "../routes/Main";
import Login from "../routes/Login";
import Register from "../routes/Register";
import ForgotPassword from "../routes/ForgotPassword";
import Handler from "../routes/Handler";
import AuthRoute from "../components/auth/AuthRoute";

const App: React.FC = function App() {
  return (
    <Router>
      <Switch>
        <AuthRoute type="public" path="/login" exact>
          <Login />
        </AuthRoute>
        <Route path="/register" exact>
          <Register />
        </Route>
        <AuthRoute type="public" path="/forgot" exact>
          <ForgotPassword />
        </AuthRoute>
        <AuthRoute type="private" path="/main/:section">
          <Main />
        </AuthRoute>
        <Route path="/handler">
          <Handler />
        </Route>
        <Redirect to="/main/dashboard" />
      </Switch>
    </Router>
  );
};

export default App;
