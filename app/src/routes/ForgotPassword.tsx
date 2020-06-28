import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import AuthLayout from "../components/AuthLayout";
import { validateEmail } from "../utils/stringUtils";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    body: {
      marginBottom: theme.spacing(2),
    },
    email: {
      marginBottom: theme.spacing(5),
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "space-between",
    },
    backButton: {
      alignSelf: "flex-start",
    },
  })
);

const ForgotPassword: React.FC = () => {
  const classes = useStyles();

  const firebase = useFirebase();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [reset, setReset] = useState(false);

  const resetPassword = function (): void {
    if (!email) {
      setError("Please enter an email");
      return;
    }
    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }
    firebase.resetPassword(email).catch(() => {
      setError("Email not found");
    });
    setReset(true);
  };

  if (reset) {
    return (
      <AuthLayout maxWidth={400} className={classes.root}>
        <React.Fragment>
          <Typography variant="h5" className={classes.title}>
            Check Your Email
          </Typography>
          <Typography variant="body1" className={classes.body}>
            Check {email} for instructions on how to reset your password.
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="outlined"
            color="primary"
            size="large"
            className={classes.backButton}
          >
            Go Back
          </Button>
        </React.Fragment>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout maxWidth={400}>
      <form noValidate className={classes.root}>
        <Typography variant="h5" className={classes.title}>
          Forgot Password?
        </Typography>
        <Typography variant="body1" className={classes.title}>
          To reset your password, please enter the email address you use to sign
          in.
        </Typography>
        <TextField
          id="email"
          autoComplete="email"
          label="Email"
          type="email"
          variant="outlined"
          autoFocus={true}
          className={classes.email}
          value={email}
          error={!!error}
          helperText={error}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            setError("");
            if (e.keyCode === 13) {
              e.preventDefault();
              resetPassword();
            }
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
            setEmail(e.target.value)
          }
          onBlur={(): void => {
            if (!validateEmail(email) && email) setError("Invalid email");
          }}
        />
        <div className={classes.buttonWrapper}>
          <Button
            component={Link}
            to="/login"
            variant="text"
            color="primary"
            size="large"
          >
            Go Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={(e: React.MouseEvent<HTMLElement>): void => {
              e.preventDefault();
              resetPassword();
            }}
          >
            Next
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
