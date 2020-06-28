import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import AuthLayout from "./AuthLayout";
import { useFirebase } from "react-redux-firebase";

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
    password: {
      marginBottom: theme.spacing(2),
    },
    confirmPassword: {
      marginBottom: theme.spacing(5),
    },
    nextButton: {
      alignSelf: "flex-end",
    },
    backButton: {
      alignSelf: "flex-start",
    },
  })
);

interface ResetPasswordProps {
  oobCode: string;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ oobCode }) => {
  const classes = useStyles();

  const firebase = useFirebase();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayTextField, setDisplayTextField] = useState(false);

  useEffect(() => {
    firebase
      .verifyPasswordResetCode(oobCode)
      .then(() => {
        setDisplayTextField(true);
      })
      .catch(() => {
        setTitle("Expired Link");
        setBody(
          "Your request to reset your password has expired or the link has already been used."
        );
      });
  }, [firebase, oobCode]);

  const resetPassword = function (): void {
    let reset = true;
    if (!password) {
      setError("Please enter a password");
      reset = false;
    }
    if (!confirmPassword) {
      setConfirmError("Please confirm your password");
      reset = false;
    }
    if (password !== confirmPassword && reset) {
      setConfirmError("Passwords do not match");
      reset = false;
    }
    if (reset) {
      firebase
        .confirmPasswordReset(oobCode, password)
        .then(() => {
          setTitle("Password Reset");
          setBody(
            "You have successfuly reset your password. Please return to the login screen."
          );
          setDisplayTextField(false);
        })
        .catch((error) => {
          if (error.code === "auth/weak-password") {
            setError("Password is less than 6 characters");
          } else {
            // TODO: Fix
            setError("Password reset failed. Please retry.");
          }
        });
    }
  };

  if (displayTextField) {
    return (
      <AuthLayout maxWidth={400}>
        <form noValidate className={classes.root}>
          <Typography variant="h5" className={classes.title}>
            Reset your password
          </Typography>
          <Typography variant="body1" className={classes.body}>
            Please enter a new password with a minimum 6 characters.
          </Typography>
          <TextField
            id="password"
            autoComplete="new-password"
            label="New Password"
            type="password"
            variant="outlined"
            autoFocus={true}
            className={classes.password}
            value={password}
            error={!!error}
            helperText={error}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
              if (e.keyCode === 13) {
                e.preventDefault();
                resetPassword();
              }
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              setError("");
              setConfirmError("");
              setPassword(e.target.value);
            }}
            onBlur={(): void => {
              if (password.length < 6 && password)
                setError("Password is less than 6 characters");
              if (confirmPassword !== password && confirmPassword)
                setConfirmError("Passwords don't match");
            }}
          />
          <TextField
            id="confirm-password"
            autoComplete="password"
            label="Confirm Password"
            type="password"
            variant="outlined"
            className={classes.confirmPassword}
            value={confirmPassword}
            error={!!confirmError}
            helperText={confirmError}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
              if (e.keyCode === 13) {
                e.preventDefault();
                resetPassword();
              }
            }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
              setConfirmError("");
              setConfirmPassword(e.target.value);
            }}
            onBlur={(): void => {
              if (confirmPassword !== password)
                setConfirmError("Passwords don't match");
            }}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            className={classes.nextButton}
            onClick={(e: React.MouseEvent<HTMLElement>): void => {
              e.preventDefault();
              resetPassword();
            }}
          >
            Next
          </Button>
        </form>
      </AuthLayout>
    );
  }
  return (
    <AuthLayout maxWidth={400} className={classes.root}>
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1" className={classes.body}>
        {body}
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
    </AuthLayout>
  );
};

export default ResetPassword;
