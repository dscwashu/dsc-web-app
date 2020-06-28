import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase, Credentials } from "react-redux-firebase";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import MaterialLink from "@material-ui/core/Link";
import GitHubIcon from "@material-ui/icons/GitHub";

import AuthLayout from "../components/AuthLayout";
import GoogleIcon from "../components/GoogleIcon";
import { validateEmail } from "../utils/stringUtils";

enum AuthMethod {
  Email = "EMAIL",
  Google = "GOOGLE",
  Github = "GITHUB",
}

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
    googleOAuth: {
      marginBottom: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
      color: theme.palette.getContrastText(theme.palette.common.white),
      "&:hover": {
        backgroundColor: theme.palette.grey[200],
      },
    },
    githubOAuth: {
      marginBottom: theme.spacing(2),
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.getContrastText(theme.palette.grey[900]),
      "&:hover": {
        backgroundColor: theme.palette.grey[700],
      },
    },
    dividerWrapper: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(2),
    },
    divider: {
      flexGrow: 1,
    },
    dividerText: {
      margin: theme.spacing(0, 1),
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

const Login: React.FC = () => {
  const classes = useStyles();

  const firebase = useFirebase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const authenticate = (method: AuthMethod): void => {
    let login = true;
    if (!email) {
      setEmailError("Please enter an email");
      login = false;
    }
    if (!password) {
      setPasswordError("Please enter a password");
      login = false;
    }
    if (!validateEmail(email) && email) {
      setEmailError("Invalid email");
      login = false;
    }
    if (login) {
      let credentials: Credentials;
      switch (method) {
        case AuthMethod.Email:
          credentials = {
            email: email,
            password: password,
          };
          break;
        case AuthMethod.Google:
          credentials = {
            provider: "google",
            type: "popup",
          };
          break;
        case AuthMethod.Github:
          credentials = {
            provider: "facebook",
            type: "popup",
          };
          break;
        default:
          setError("Invalid authenticatin method");
          return;
      }
      firebase.login(credentials).catch(() => {
        setPassword("");
        setError("Invalid email or password");
      });
    }
  };

  return (
    <AuthLayout maxWidth={400}>
      <form className={classes.root} noValidate>
        <Typography variant="h5" className={classes.title}>
          Sign in to DSC Web App
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.googleOAuth}
          startIcon={<GoogleIcon />}
          onClick={(e: React.MouseEvent<HTMLElement>): void => {
            e.preventDefault();
            authenticate(AuthMethod.Google);
          }}
        >
          Google
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className={classes.githubOAuth}
          startIcon={<GitHubIcon />}
          onClick={(e: React.MouseEvent<HTMLElement>): void => {
            e.preventDefault();
            authenticate(AuthMethod.Github);
          }}
        >
          Github
        </Button>
        <div className={classes.dividerWrapper}>
          <Divider className={classes.divider} />
          <Typography variant="body2" className={classes.dividerText}>
            or
          </Typography>
          <Divider className={classes.divider} />
        </div>
        <TextField
          id="email"
          autoComplete="email"
          label="Email"
          type="email"
          variant="outlined"
          autoFocus={true}
          className={classes.email}
          value={email}
          error={!!emailError}
          helperText={emailError}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            setEmailError("");
            setError("");
            if (e.keyCode === 13) {
              e.preventDefault();
              authenticate(AuthMethod.Email);
            }
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setEmail(e.target.value)
          }
          onBlur={(): void => {
            if (!validateEmail(email) && email) setEmailError("Invalid email");
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
              authenticate(AuthMethod.Email);
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
              authenticate(AuthMethod.Email);
            }}
          >
            Next
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
