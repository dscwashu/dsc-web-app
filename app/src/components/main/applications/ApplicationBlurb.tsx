import React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import { Application } from "../../../types";

interface ApplicationBlurbProps {
  application: Application;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      marginBottom: theme.spacing(2),
    },
    status: (application: Application) => ({
      color: application.pending
        ? theme.palette.warning.main
        : application.accepted
        ? theme.palette.success.main
        : theme.palette.error.main,
    }),
  })
);

const ApplicationBlurb: React.FC<ApplicationBlurbProps> = function ({
  application,
}) {
  const classes = useStyles(application);

  let blurbTitle: string;
  switch (application.info.type) {
    case "orgProject":
    case "studentProject":
      blurbTitle = "New Project Application";
      break;
    case "coreTeam":
      blurbTitle = "New Core Team Application";
      break;
    case "projectManager":
      blurbTitle = "New Project Manager Application";
      break;
    case "projectMember":
      blurbTitle = "";
      break;
    default:
      blurbTitle = "";
      break;
  }

  return (
    <div className={classes.root}>
      <Typography variant="h6">{blurbTitle}</Typography>
      <Typography variant="subtitle1">
        {application.info.createdAt?.toDate().toLocaleString()}
      </Typography>
      <Typography className={classes.status}>
        {application.pending
          ? "Pending"
          : application.accepted
          ? "Accepted"
          : "Denied"}
      </Typography>
    </div>
  );
};

export default ApplicationBlurb;
