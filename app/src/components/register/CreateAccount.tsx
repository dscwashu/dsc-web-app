import React, { useState } from "react";
import { useFirebase } from "react-redux-firebase";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";

import { validateEmail, validateEmailDomain } from "../../utils/stringUtils";

interface CreateAccountProps {
  handleBack: () => void;
  setCreated: (isCreated: boolean) => void;
  role: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    contentWrapper: {
      width: "100%",
      maxWidth: 300,
      display: "flex",
      alignSelf: "center",
      flexDirection: "column",
      marginBottom: theme.spacing(3),
    },
    email: {
      marginBottom: theme.spacing(2),
    },
    password: {
      marginBottom: theme.spacing(2),
    },
    confirm: {
      marginBottom: theme.spacing(3),
    },
    caption: {
      marginBottom: theme.spacing(2),
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
);

const CreateAccount: React.FC<CreateAccountProps> = function ({
  handleBack,
  setCreated,
  role,
}) {
  const validate =
    role === "student"
      ? (email: string): boolean => validateEmailDomain(email, "wustl.edu")
      : validateEmail;
  const classes = useStyles();

  const firebase = useFirebase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = (): void => {
    if (!email || !password || !confirmPassword) {
      if (!email) {
        setEmailError("Please enter an email");
      }
      if (!password) {
        setPasswordError("Please enter a password");
      }
      if (!confirmPassword) {
        setConfirmError("Please confirm your password");
      }
      return;
    }
    if (!validate(email)) {
      role === "student"
        ? setEmailError("Invalid @wustl.edu email")
        : setEmailError("Invalid email");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password is less than 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmError("Passwords do not match");
      return;
    }
    const credentials = {
      email: email,
      password: password,
    };
    firebase
      .createUser(credentials)
      .then(() => {
        setCreated(true);
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setEmailError("Email is already in use.");
        } else {
          setError("Error creating account. Please try again later.");
        }
      });
  };

  return (
    <div className={classes.root}>
      <div className={classes.contentWrapper}>
        <Typography variant="h5" className={classes.title} align="center">
          Create your account
        </Typography>
        <TextField
          id="email"
          autoComplete="email"
          label={role === "student" ? "WUSTL Email" : "Email"}
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
              signUp();
            }
          }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            setEmail(e.target.value);
          }}
          onBlur={(): void => {
            if (!validate(email) && email)
              role === "student"
                ? setEmailError("Invalid @wustl.edu email")
                : setEmailError("Invalid email");
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
          onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
            setPasswordError("");
            setConfirmError("");
            setPassword(e.target.value);
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            setPasswordError("");
            setError("");
            if (e.keyCode === 13) {
              e.preventDefault();
              signUp();
            }
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
          autoComplete="current-password"
          label="Confirm Password"
          type="password"
          variant="outlined"
          value={confirmPassword}
          error={!!confirmError}
          helperText={confirmError}
          className={classes.confirm}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
            if (e.keyCode === 13) {
              e.preventDefault();
              signUp();
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
        <Typography variant="caption" className={classes.caption}>
          The password must be a minimum of 6 characters.
        </Typography>
        <Typography variant="body1" color="error" align="center">
          {error}
        </Typography>
      </div>
      <div className={classes.buttonWrapper}>
        <Button
          onClick={handleBack}
          variant="outlined"
          color="primary"
          size="large"
        >
          Back
        </Button>
        <Button
          onClick={signUp}
          variant="contained"
          color="primary"
          size="large"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default CreateAccount;
