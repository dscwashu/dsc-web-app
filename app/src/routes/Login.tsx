import React, { useState } from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import StudentLogin from "../components/loginTabs/StudentLogin";
import OrgLogin from "../components/loginTabs/OrgLogin";
import TabPanel from "../components/TabPanel";
import AuthLayout from "../components/AuthLayout";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: 0,
    },
    root: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      alignSelf: "center",
      marginBottom: theme.spacing(3),
    },
    googleOAuth: {
      marginBottom: theme.spacing(1),
      backgroundColor: theme.palette.common.white,
      color: theme.palette.getContrastText(theme.palette.common.white),
      "&:hover": {
        backgroundColor: theme.palette.grey[200],
      },
    },
    githubOAuth: {
      marginBottom: theme.spacing(2),
      backgroundColor: theme.palette.grey[900],
      color: theme.palette.getContrastText(theme.palette.grey[900]),
      "&:hover": {
        backgroundColor: theme.palette.grey[700],
      },
    },
    dividerWrapper: {
      display: "flex",
      alignItems: "center",
      marginBottom: theme.spacing(2),
    },
    divider: {
      flexGrow: 1,
    },
    dividerText: {
      margin: theme.spacing(0, 1),
    },
    email: {
      marginBottom: theme.spacing(2),
    },
    password: {
      marginBottom: theme.spacing(1),
    },
    forgot: {
      marginBottom: theme.spacing(2),
    },
    buttonWrapper: {
      marginTop: theme.spacing(3),
      display: "flex",
      justifyContent: "space-between",
    },
    registerButton: {
      alignSelf: "flex-start",
    },
    loginButton: {
      alignSelf: "flex-end",
    },
  })
);

const Login: React.FC = () => {
  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(0);

  return (
    <AuthLayout maxWidth={400} className={classes.paper}>
      <Tabs
        value={tabIndex}
        onChange={(event: React.ChangeEvent<{}>, newValue: number): void => {
          console.log(newValue);
          setTabIndex(newValue);
        }}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="toggle student or organization"
      >
        <Tab
          label="Student"
          id="full-width-tab-0"
          aria-controls="full-width-tabpanel-0"
        />
        <Tab
          label="Organization"
          id="full-width-tab-1"
          aria-controls="full-width-tabpanel-1"
        />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <StudentLogin />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <OrgLogin />
      </TabPanel>
    </AuthLayout>
  );
};

export default Login;
