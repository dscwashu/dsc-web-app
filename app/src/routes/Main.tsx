import React from "react";
import { useSelector } from "react-redux";
import { useFirebase } from "react-redux-firebase";

import { Route, Link, useLocation, Switch, Redirect } from "react-router-dom";

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
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Hidden from "@material-ui/core/Hidden";

import { RootState } from "../app/rootReducer";
import horizontallockup from "../images/horizontallockup.png";

import Dashboard from "../components/main/dashboard/Dashboard";
import MainLayout from "../components/main/MainLayout";
import RoleRoute from "../components/main/RoleRoute";
import RoleContainer from "../components/main/RoleContainer";
import ApplicationForm from "../components/main/applications/ApplicationForm";
import SetBreadcrumbs from "../components/main/SetBreadcrumbs";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100vh",
    },
    appBar: (props: { drawerWidth: number }) => ({
      [theme.breakpoints.up("sm")]: {
        width: `calc(100% - ${props.drawerWidth}px)`,
        marginLeft: props.drawerWidth,
      },
    }),
    title: {
      flexGrow: 1,
    },
    drawer: (props: { drawerWidth: number }) => ({
      [theme.breakpoints.up("sm")]: {
        width: props.drawerWidth,
        flexShrink: 0,
      },
    }),
    drawerPaper: (props: { drawerWidth: number }) => ({
      width: props.drawerWidth,
    }),
    // Necessary for content to be below app bar
    toolbar: {
      ...theme.mixins.toolbar,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
    logo: (props: { drawerWidth: number }) => ({
      width: props.drawerWidth - 20,
      height: "auto",
    }),
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
  })
);

const Main: React.FC = function () {
  const location = useLocation();
  const firebase = useFirebase();

  const signOut = (): void => {
    firebase.logout();
  };

  const auth = useSelector((state: RootState) => state.firebase.auth);
  const { role } = useSelector((state: RootState) => {
    return {
      role: state.firestore.data.users?.[auth.uid]?.profile?.role,
    };
  });
  const classes = useStyles(
    role === "student" ? { drawerWidth: 240 } : { drawerWidth: 0 }
  );

  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = (): void => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <React.Fragment>
      <div className={classes.toolbar}>
        <a
          href="https://www.dscwashu.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={horizontallockup}
            alt="DSC WashU Logo"
            className={classes.logo}
          />
        </a>
      </div>
      <Divider />
      <List onClick={handleDrawerToggle}>
        <ListItem button component={Link} to="/main/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/main/projects">
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItem>
        <ListItem button component={Link} to="/main/events">
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Events" />
        </ListItem>
        <ListItem button component={Link} to="/main/applications">
          <ListItemIcon>
            <AssignmentIndIcon />
          </ListItemIcon>
          <ListItemText primary="Applications" />
        </ListItem>
      </List>
    </React.Fragment>
  );

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <RoleContainer role="student">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          </RoleContainer>
          <Typography variant="h6" noWrap className={classes.title}>
            {location.pathname.split("/")[2].charAt(0).toUpperCase() +
              location.pathname.split("/")[2].slice(1)}
          </Typography>
          <Button color="inherit" onClick={signOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <RoleContainer role="student">
        <nav className={classes.drawer}>
          <Hidden smUp implementation="js">
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="js">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
      </RoleContainer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <MainLayout>
          <Switch>
            <Route path="/main/dashboard/">
              <Switch>
                <Route exact path="/main/dashboard">
                  <SetBreadcrumbs items={[{ text: "Overview", link: "" }]}>
                    <Dashboard />
                  </SetBreadcrumbs>
                </Route>
                <RoleRoute
                  role="org"
                  exact
                  path="/main/dashboard/projects/:projectID"
                >
                  details
                </RoleRoute>
                <RoleRoute
                  role="org"
                  exact
                  path="/main/dashboard/applications/:projectID"
                >
                  applications
                </RoleRoute>
                <RoleRoute
                  role="org"
                  exact
                  path="/main/dashboard/application-form"
                >
                  <SetBreadcrumbs
                    items={[
                      { text: "Overview", link: "/main/dashboard" },
                      { text: "New Application", link: "" },
                    ]}
                  >
                    <ApplicationForm type="orgProject" />
                  </SetBreadcrumbs>
                </RoleRoute>
                <Redirect to="/main/dashboard" />
              </Switch>
            </Route>
            <RoleRoute role="student" path="/main/projects">
              projects
            </RoleRoute>
            <RoleRoute role="student" path="/main/events">
              events
            </RoleRoute>
            <RoleRoute role="student" path="/main/applications">
              applications
            </RoleRoute>
            <Redirect to="/main/dashboard" />
          </Switch>
        </MainLayout>
      </main>
    </div>
  );
};

export default Main;
