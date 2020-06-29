import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase, Credentials } from "react-redux-firebase";
import rawFirebase from "firebase/app";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import MaterialLink from "@material-ui/core/Link";
import GitHubIcon from "@material-ui/icons//GitHub";

import GoogleIcon from "../GoogleIcon";
import { validateEmail } from "../../utils/stringUtils";

enum AuthMethod {
  Email,
  Google,
  Github,
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

const OrgLogin: React.FC = () => {
  const classes = useStyles();

  const firebase = useFirebase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");

  const authenticate = (method: AuthMethod): void => {
    let credentials: Credentials;
    let provider: rawFirebase.auth.GithubAuthProvider;
    switch (method) {
      case AuthMethod.Email:
        if (!email || !password) {
          if (!email) {
            setEmailError("Please enter an email");
          }
          if (!email) {
            setPasswordError("Please enter a password");
          }
          return;
        }
        if (!validateEmail(email)) {
          setEmailError("Invalid email");
          return;
        }
        credentials = {
          email: email,
          password: password,
        };
        firebase.login(credentials).catch(() => {
          setError("Invalid username or password");
        });
        break;
      case AuthMethod.Google:
        credentials = {
          provider: "google",
          type: "popup",
        };
        firebase.login(credentials).catch((error) => {
          if (error.code === "auth/account-exists-with-different-credential") {
            setError(
              "An account already exists with the same email address. Sign in using a provider associated with this email address."
            );
          } else {
            setError("Error signing in with provider. Please try again later.");
          }
        });
        break;
      case AuthMethod.Github:
        // react-redux-firebase does not provide github option :(
        provider = new rawFirebase.auth.GithubAuthProvider();
        firebase
          .auth()
          .signInWithPopup(provider)
          .catch((error) => {
            if (
              error.code === "auth/account-exists-with-different-credential"
            ) {
              setError(
                "An account already exists with the same email address. Sign in using a provider associated with this email address."
              );
            } else {
              setError(
                "Error signing in with provider. Please try again later."
              );
            }
          });
        return;
      default:
        setError("Invalid authentication method");
        return;
    }
  };

  return (
    <form className={classes.root} noValidate>
      <Typography variant="h5" className={classes.title} align="center">
        Sign in as Client
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
            authenticate(AuthMethod.Email);
          }
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
          setEmail(e.target.value);
        }}
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
  );
};

export default OrgLogin;
