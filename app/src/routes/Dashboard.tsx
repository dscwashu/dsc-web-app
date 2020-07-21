import React from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";

import { Route, Link, useLocation } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Button from "@material-ui/core/Button";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AssignmentIcon from "@material-ui/icons/Assignment";
import EventIcon from "@material-ui/icons/Event";
import AssignmentIndIcon from "@material-ui/icons/AssignmentInd";

import { RootState } from "../app/rootReducer";
import horizontallockup from "../images/horizontallockup.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    title: {
      flexGrow: 1,
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    // necessary for content to be below app bar
    toolbar: {
      ...theme.mixins.toolbar,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
    logo: {
      width: drawerWidth - 20,
      height: "auto",
    },
  })
);

const Dashboard: React.FC = function () {
  const location = useLocation();
  const classes = useStyles();
  const firebase = useFirebase();
  const signOut = (): void => {
    firebase.logout();
  };
  const auth = useSelector((state: RootState) => state.firebase.auth);
  const { firstName } = useSelector((state: RootState) => {
    return {
      firstName: state.firestore.data.users?.[auth.uid]?.firstName,
    };
  });

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap className={classes.title}>
            {location.pathname.split("/")[1].charAt(0).toUpperCase() +
              location.pathname.split("/")[1].slice(1)}
          </Typography>
          <Button color="inherit" onClick={signOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor="left"
      >
        <div className={classes.toolbar}>
          <img
            src={horizontallockup}
            alt="DSC WashU Logo"
            className={classes.logo}
          />
        </div>
        <Divider />
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/projects">
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Projects" />
          </ListItem>
          <ListItem button component={Link} to="/events">
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Events" />
          </ListItem>
          <ListItem button component={Link} to="/applications">
            <ListItemIcon>
              <AssignmentIndIcon />
            </ListItemIcon>
            <ListItemText primary="Applications" />
          </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Route path="/dashboard/">Welcome, {firstName}</Route>
        <Route path="/projects">projects</Route>
        <Route path="/events">events</Route>
        <Route path="/applications">applications</Route>
      </main>
    </div>
  );
};

export default Dashboard;
