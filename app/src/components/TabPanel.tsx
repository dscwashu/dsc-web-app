import React from "react";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tab: {
      padding: theme.spacing(5, 2),
      [theme.breakpoints.up(450)]: {
        padding: theme.spacing(5, 5),
      },
    },
  })
);

const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, value, index, ...other } = props;

  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <div className={classes.tab}>{children}</div>}
    </div>
  );
};

export default TabPanel;
