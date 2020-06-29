import React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";

import AuthLayout from "../AuthLayout";

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

const LoadingHandler: React.FC = () => {
  const classes = useStyles();

  return (
    <AuthLayout maxWidth={400}>
      <Skeleton variant="text" animation="wave" className={classes.title} />
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" />
      <Skeleton variant="text" animation="wave" className={classes.body} />
      <Skeleton variant="rect" width={100} height={30} animation="wave" />
    </AuthLayout>
  );
};

export default LoadingHandler;
