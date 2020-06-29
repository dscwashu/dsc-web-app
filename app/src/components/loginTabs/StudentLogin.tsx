import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MaterialLink from "@material-ui/core/Link";

import { validateEmailDomain } from "../../utils/stringUtils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      alignSelf: "center",
      marginBottom: theme.spacing(3),
    },
    email: {
      marginBottom: theme.spacing(2),
    },
    password: {
      marginBottom: theme.spacing(1),
    },
    forgot: {
      marginBottom: theme.spacing(2),
    },
    buttonWrapper: {
      marginTop: theme.spacing(3),
      display: "flex",
      justifyContent: "space-between",
    },
    registerButton: {
      alignSelf: "flex-start",
    },
    loginButton: {
      alignSelf: "flex-end",
    },
  })
);

const StudentLogin: React.FC = () => {
  const classes = useStyles();

  const firebase = useFirebase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const authenticate = (): void => {
    if (!email || !password) {
      if (!email) {
        setEmailError("Please enter an email");
      }
      if (!email) {
        setPasswordError("Please enter a password");
      }
      return;
    }
    if (!validateEmailDomain(email, "wustl.edu")) {
      setEmailError("Invalid @wustl.edu email");
      return;
    }
    const credentials = {
      email: email,
      password: password,
    };
    firebase.login(credentials).catch(() => {
      setError("Invalid username or password");
    });
  };

  return (
    <form className={classes.root} noValidate>
      <Typography variant="h5" className={classes.title} align="center">
        Sign in as Student
      </Typography>
      <TextField
        id="email"
        autoComplete="email"
        label="Email"
        type="email"
        variant="outlined"
        // TODO: Causes error if set to true. Need to look into this. Seems like a bug with Material-UI.
        autoFocus={false}
        className={classes.email}
        value={email}
        error={!!emailError}
        helperText={emailError}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
          setEmailError("");
          setError("");
          if (e.keyCode === 13) {
            e.preventDefault();
            authenticate();
          }
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setEmail(e.target.value);
        }}
        onBlur={(): void => {
          if (!validateEmailDomain(email, "wustl.edu") && email)
            setEmailError("Invalid @wustl.edu email");
        }}
      />
      <TextField
        id="password"
        autoComplete="current-password"
        label="Password"
        type="password"
        variant="outlined"
        className={classes.password}
        value={password}
        error={!!passwordError}
        helperText={passwordError}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          setPassword(e.target.value)
        }
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
          setPasswordError("");
          setError("");
          if (e.keyCode === 13) {
            e.preventDefault();
            authenticate();
          }
        }}
      />
      <MaterialLink component={Link} to="/forgot" className={classes.forgot}>
        Forgot your password?
      </MaterialLink>
      <Typography variant="body1" color="error" align="center">
        {error}
      </Typography>
      <div className={classes.buttonWrapper}>
        <Button
          component={Link}
          to="/register"
          className={classes.registerButton}
          variant="text"
          color="primary"
          size="large"
        >
          Create Account
        </Button>
        <Button
          className={classes.loginButton}
          variant="contained"
          color="primary"
          size="large"
          onClick={(e: React.MouseEvent<HTMLElement>): void => {
            e.preventDefault();
            authenticate();
          }}
        >
          Next
        </Button>
      </div>
    </form>
  );
};

export default StudentLogin;
