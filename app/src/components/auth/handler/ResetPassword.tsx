import React, { useState } from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

import AuthLayout from "../AuthLayout";
import { ResetState } from "../../../routes/Handler";
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
      marginBottom: theme.spacing(2),
    },
    nextButton: {
      marginTop: theme.spacing(3),
      alignSelf: "flex-end",
    },
  })
);

interface ResetPasswordProps {
  oobCode: string;
  setResetState: (state: ResetState) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
  oobCode,
  setResetState,
}) => {
  const classes = useStyles();

  const firebase = useFirebase();

  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPassword = function (): void {
    if (!password) {
      setPasswordError("Please enter a password");
      return;
    }
    if (!confirmPassword) {
      setConfirmError("Please confirm your password");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password is less than 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords don't match");
      return;
    }
    firebase
      .confirmPasswordReset(oobCode, password)
      .then(() => {
        setResetState(ResetState.Done);
      })
      .catch(() => {
        setError("Error resetting password. Please try again later.");
      });
  };
  return (
    <AuthLayout maxWidth={400}>
      <form noValidate className={classes.root}>
        <Typography variant="h5" className={classes.title} align="center">
          Reset Your Password
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
          error={!!passwordError}
          helperText={passwordError}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.keyCode === 13) {
              e.preventDefault();
              resetPassword();
            }
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            setPasswordError("");
            setConfirmError("");
            setPassword(e.target.value);
          }}
          onBlur={(): void => {
            if (password.length < 6 && password)
              setPasswordError("Password is less than 6 characters");
            if (confirmPassword !== password && confirmPassword)
              setConfirmError("Passwords don't match");
          }}
        />
        <TextField
          id="confirm-password"
          autoComplete="new-password"
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
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
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
};

export default ResetPassword;
