import React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.default,
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    progress: {
      width: "500px",
    },
  })
);

const LoadingDashboard: React.FC = function (props) {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <LinearProgress className={classes.progress} />
    </div>
  );
};

export default LoadingDashboard;
