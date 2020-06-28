import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import AuthLayout from "../components/AuthLayout";
import VerifyEmail from "../components/VerifyEmail";
import ResetPassword from "../components/ResetPassword";
import { getParams } from "../utils/stringUtils";

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

const Handler: React.FC = () => {
  const classes = useStyles();

  const location = useLocation();

  const [mode, setMode] = useState("");
  const [oobCode, setOobCode] = useState("");

  useEffect(() => {
    const params = getParams(location.search);
    setMode(params.mode);
    setOobCode(params.oobCode);
  }, [location]);

  if (oobCode) {
    switch (mode) {
      case "resetPassword":
        return <ResetPassword oobCode={oobCode} />;
      case "verifyEmail":
        return <VerifyEmail oobCode={oobCode} />;
      default:
        break;
    }
  }

  return (
    <AuthLayout maxWidth={400}>
      <Typography variant="h5" className={classes.title}>
        Invalid Link
      </Typography>
      <Typography variant="body1" className={classes.body}>
        The link is invalid or broken.
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

export default Handler;
