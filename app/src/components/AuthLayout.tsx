import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

interface AuthLayoutProps {
  maxWidth: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: (props: AuthLayoutProps) => ({
      maxWidth: props.maxWidth,
      flexGrow: 1,
      padding: theme.spacing(5, 5),
    }),
  })
);

const AuthLayout: React.FC<AuthLayoutProps> = function (props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>{props.children}</Paper>
    </div>
  );
};

export default AuthLayout;
