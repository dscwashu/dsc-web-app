import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/rootReducer";

import { useHistory } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";

import RoleContainer from "../RoleContainer";
import Panel from "../Panel";
import ApplicationBlurb from "../applications/ApplicationBlurb";
import { Application } from "../../../types";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: 220,
      background: "center no-repeat url('/backdrop.jpg')",
      backgroundSize: "cover",
      "&::before": {
        content: "''",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(255,255,255,.9)",
      },
    },
    content: {
      padding: theme.spacing(0, 3),
    },
    welcome: {
      position: "relative",
      marginBottom: theme.spacing(3),
    },
    grid: {
      position: "relative",
    },
  })
);

const Dashboard: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const { uid } = useSelector((state: RootState) => state.firebase.auth);
  const { firstName } = useSelector((state: RootState) => {
    return {
      firstName: state.firestore.data.users?.[uid]?.profile?.firstName,
    };
  });

  return (
    <React.Fragment>
      <div className={classes.backdrop} />
      <div className={classes.content}>
        <Typography variant="h2" className={classes.welcome}>
          Welcome, {firstName}
        </Typography>
        <RoleContainer role="org">
          <Grid container spacing={3} className={classes.grid}>
            <Grid item xs={12} md={7}>
              <Panel title="Active Projects">Hello</Panel>
            </Grid>
            <Grid item xs={12} md={5}>
              <Panel
                title="Your Applications"
                connect={[
                  {
                    collection: "applications",
                    where: ["info.user", "==", uid],
                    orderBy: ["info.createdAt", "desc"],
                    limit: 10,
                  },
                ]}
                mapStateToProps={(state: RootState): Record<string, any> => {
                  return {
                    applications: state.firestore.ordered.applications,
                  };
                }}
                action={
                  <IconButton
                    onClick={(): void => {
                      history.push("/main/dashboard/application-form");
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                }
                render={({ applications }): React.ReactNode =>
                  applications
                    ? applications.map(
                        (element: Application, index: number) => (
                          <ApplicationBlurb key={index} application={element} />
                        )
                      )
                    : undefined
                }
              ></Panel>
            </Grid>
          </Grid>
        </RoleContainer>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
