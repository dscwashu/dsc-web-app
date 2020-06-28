import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

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
    backButton: {
      alignSelf: "flex-start",
    },
  })
);

interface VerifyEmailProps {
  oobCode: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({ oobCode }) => {
  const classes = useStyles();

  const firebase = useFirebase();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    firebase
      .auth()
      .applyActionCode(oobCode)
      .then(() => {
        setTitle("Verification Successful");
        setBody(
          "Your email has been verified. Please return to the application."
        );
      })
      .catch(() => {
        setTitle("Expired Link");
        setBody(
          "Your request to verify your email has expired or the link has already been used."
        );
      });
  }, [firebase, oobCode]);

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

export default VerifyEmail;
