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
  body: React.ReactNode;
  buttonOptions?: {
    link?: boolean;
    path?: string;
    text?: string;
    variant?: "text" | "outlined" | "contained" | undefined;
    onClick?: () => void;
  };
}

interface Options {
  link: boolean;
  path: string;
  text: string;
  variant: "text" | "outlined" | "contained" | undefined;
  onClick: undefined | (() => void);
}

const DialogLayout: React.FC<DialogLayoutProps> = ({
  title,
  body,
  buttonOptions,
}) => {
  const options: Options = Object.assign(
    {
      link: true,
      path: "/login",
      variant: "outlined",
      onClick: undefined,
      text: "Go Back",
    },
    buttonOptions
  );
  const classes = useStyles();

  return (
    <AuthLayout maxWidth={400}>
      <Typography variant="h5" className={classes.title} align="center">
        {title}
      </Typography>
      <Typography variant="body1" className={classes.body}>
        {body}
      </Typography>
      <Button
        component={options.link ? Link : "button"}
        to={options.link ? options.path : undefined}
        variant={options.variant}
        color="primary"
        size="large"
        onClick={options.onClick}
      >
        {options.text}
      </Button>
    </AuthLayout>
  );
};

export default DialogLayout;
