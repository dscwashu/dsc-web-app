import React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(3),
    },
    form: {
      display: "flex",
      flexDirection: "column",
      maxWidth: 800,
      padding: theme.spacing(3),
      width: "100%",
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    button: {
      alignSelf: "flex-end",
      marginTop: theme.spacing(2),
    },
    answer: {
      marginBottom: theme.spacing(2),
    },
  })
);

const LoadingApplicationForm: React.FC = function (props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Paper className={classes.form}>
        <Skeleton
          variant="text"
          width={200}
          data-testid="skeleton"
          animation="wave"
          className={classes.title}
        />
        {[...Array(5)].map((element: any, index: number) => (
          <React.Fragment key={index}>
            <Skeleton variant="text" width="75%" animation="wave" />
            <Skeleton
              variant="text"
              animation="wave"
              className={classes.answer}
            />
          </React.Fragment>
        ))}
        <Skeleton
          variant="rect"
          width={100}
          height={30}
          animation="wave"
          className={classes.button}
        />
      </Paper>
    </div>
  );
};

export default LoadingApplicationForm;
