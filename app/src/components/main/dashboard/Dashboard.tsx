import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/rootReducer";

import { useHistory } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";

import RoleContainer from "../RoleContainer";
import Panel from "../Panel";
import ApplicationBlurb from "../applications/ApplicationBlurb";
import { Application } from "../../../types";
import Paginate from "../Paginate";

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
    showMore: {
      alignSelf: "center",
    },
    collapse: {
      position: "absolute",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
    },
    empty: {
      flexGrow: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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
              <Paginate
                baseQuery={{
                  collection: "applications",
                  where: ["info.user", "==", uid],
                  orderBy: ["info.createdAt", "desc"],
                }}
                pageSize={10}
                render={({
                  queries,
                  queriesNames,
                  expand,
                  collapse,
                  pageSize,
                }): React.ReactElement<any, any> | null => (
                  <Panel
                    title="Your Applications"
                    minHeight={500}
                    connect={queries}
                    mapStateToProps={(
                      state: RootState
                    ): Record<string, any> => {
                      let applications: Application[] = [];
                      let showMore = true;
                      for (let i = 0; i < queriesNames.length; i++) {
                        const page =
                          state.firestore.queries[queriesNames[i]]?.data;
                        if (page) {
                          applications = applications.concat(
                            Object.values(page)
                          );
                          if (Object.keys(page).length < pageSize) {
                            showMore = false;
                          }
                        } else if (i === queriesNames.length - 1) {
                          showMore = false;
                        }
                      }
                      applications.sort((a, b) => {
                        if (a.info.createdAt && b.info.createdAt) {
                          return (
                            b.info.createdAt.seconds - a.info.createdAt.seconds
                          );
                        }
                        return 1;
                      });
                      let showCollapse = false;
                      if (applications.length > pageSize) {
                        showCollapse = true;
                      }
                      return {
                        applications,
                        showMore,
                        showCollapse,
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
                    render={({
                      applications,
                      showMore,
                      showCollapse,
                    }): React.ReactNode =>
                      applications ? (
                        <React.Fragment>
                          {applications.map(
                            (element: Application, index: number) => (
                              <ApplicationBlurb
                                key={index}
                                application={element}
                              />
                            )
                          )}
                          {showMore && (
                            <Button
                              color="primary"
                              onClick={expand}
                              className={classes.showMore}
                            >
                              Show More
                            </Button>
                          )}
                          {showCollapse && (
                            <IconButton
                              onClick={collapse}
                              className={classes.collapse}
                            >
                              <ExpandLessIcon />
                            </IconButton>
                          )}
                        </React.Fragment>
                      ) : (
                        <div className={classes.empty}>
                          <Typography
                            variant="subtitle1"
                            color="textSecondary"
                            align="center"
                          >
                            No applications
                          </Typography>
                        </div>
                      )
                    }
                  />
                )}
              />
            </Grid>
          </Grid>
        </RoleContainer>
      </div>
    </React.Fragment>
  );
};

export default Dashboard;
