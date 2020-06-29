import React from "react";
import { Link } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import AuthLayout from "./AuthLayout";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      marginBottom: theme.spacing(3),
    },
    body: {
      marginBottom: theme.spacing(2),
    },
  })
);

interface DialogLayoutProps {
  title: string;
  body: string;
  path?: string;
}

const DialogLayout: React.FC<DialogLayoutProps> = ({
  title,
  body,
  path = "/login",
}) => {
  const classes = useStyles();

  return (
    <AuthLayout maxWidth={400}>
      <Typography variant="h5" className={classes.title}>
        {title}
      </Typography>
      <Typography variant="body1" className={classes.body}>
        {body}
      </Typography>
      <Button
        component={Link}
        to={path}
        variant="outlined"
        color="primary"
        size="large"
      >
        Go Back
      </Button>
    </AuthLayout>
  );
};

export default DialogLayout;
