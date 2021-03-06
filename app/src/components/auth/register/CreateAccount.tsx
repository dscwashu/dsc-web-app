import React, { useState } from "react";
import { useFirebase } from "react-redux-firebase";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MaterialLink from "@material-ui/core/Link";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import { validateEmail, validateEmailDomain } from "../../../utils/stringUtils";

interface CreateAccountProps {
  handleBack: () => void;
  handleNext: () => void;
  role: string;
}

const useLabelStyles = makeStyles((theme: Theme) =>
  createStyles({
    label: {
      ...theme.typography.caption,
    },
  })
);

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
      marginBottom: theme.spacing(2),
    },
    agree: {
      marginBottom: theme.spacing(3),
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
);

const CreateAccount: React.FC<CreateAccountProps> = function ({
  handleBack,
  handleNext,
  role,
}) {
  const validate =
    role === "student"
      ? (email: string): boolean => validateEmailDomain(email, "wustl.edu")
      : validateEmail;
  const classes = useStyles();
  const labelClasses = useLabelStyles();

  const firebase = useFirebase();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const signUp = (): void => {
    let match = true;
    if (!email) {
      setEmailError("Please enter an email");
      match = false;
    }
    if (!password) {
      setPasswordError("Please enter a password");
      match = false;
    }
    if (password && !confirmPassword) {
      setConfirmError("Please confirm your password");
      match = false;
    }
    if (email && !validate(email)) {
      role === "student"
        ? setEmailError("Invalid @wustl.edu email")
        : setEmailError("Invalid email");
      match = false;
    }
    if (password && password.length < 6) {
      setPasswordError("Password is less than 6 characters");
      match = false;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      setConfirmError("Passwords don't match");
      match = false;
    }
    if (!checked) {
      setError("Please agree to the privacy policy and terms and conditions");
      match = false;
    }
    if (match) {
      const credentials = {
        email: email,
        password: password,
      };
      firebase
        .createUser(credentials)
        .then(() => {
          handleNext();
        })
        .catch((error) => {
          setError(error.message);
        });
    }
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
          autoComplete="new-password"
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
          autoComplete="new-password"
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
        <FormControlLabel
          classes={labelClasses}
          className={classes.agree}
          onChange={(): void => {
            if (
              error ===
              "Please agree to the privacy policy and terms and conditions"
            ) {
              setError("");
            }
            setChecked(!checked);
          }}
          control={
            <Checkbox
              checked={checked}
              icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
              checkedIcon={<CheckBoxIcon fontSize="small" />}
            />
          }
          label={
            <React.Fragment>
              {"I agree to the "}
              <MaterialLink
                variant="caption"
                href="https://www.dscwashu.com/privacy"
              >
                Privacy Policy
              </MaterialLink>
              {" and "}
              <MaterialLink
                variant="caption"
                href="https://www.dscwashu.com/terms"
              >
                Terms and Conditions
              </MaterialLink>
              .
            </React.Fragment>
          }
        />
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
