import React from "react";
import { Link } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import MaterialLink from "@material-ui/core/Link";
import clsx from "clsx";

import horizontallockup from "../images/horizontallockup.png";

interface AuthLayoutProps {
  maxWidth: number;
  className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(2),
    },
    logo: {
      position: "absolute",
      left: theme.spacing(2),
      top: theme.spacing(2),
      width: 250,
      height: "auto",
    },
    wrapper: (props: AuthLayoutProps) => ({
      maxWidth: props.maxWidth,
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
    }),
    paper: {
      marginTop: 100,
      padding: theme.spacing(5, 2),
      marginBottom: theme.spacing(3),
      [theme.breakpoints.up(450)]: {
        padding: theme.spacing(5, 5),
      },
    },
    links: {
      alignSelf: "stretch",
      display: "flex",
      justifyContent: "flex-end",
    },
    terms: {
      marginLeft: theme.spacing(3),
    },
  })
);

const AuthLayout: React.FC<AuthLayoutProps> = function (props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <div className={classes.wrapper}>
        <Link to="/login">
          <img
            src={horizontallockup}
            alt="DSC WashU Logo"
            className={classes.logo}
          />
        </Link>
        <Paper className={clsx(classes.paper, props.className)}>
          {props.children}
        </Paper>
        <div className={classes.links}>
          <MaterialLink
            color="textSecondary"
            variant="caption"
            href="https://www.dscwashu.com/privacy"
          >
            Privacy
          </MaterialLink>
          <MaterialLink
            color="textSecondary"
            variant="caption"
            href="https://www.dscwashu.com/termsandconditions"
            className={classes.terms}
          >
            Terms
          </MaterialLink>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
