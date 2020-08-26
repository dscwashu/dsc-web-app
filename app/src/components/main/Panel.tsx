import React, { useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { ReduxFirestoreQuerySetting } from "react-redux-firebase";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";

import { MainLayoutContext } from "./MainLayout";

import clsx from "clsx";
import { RootState } from "../../app/rootReducer";

interface PanelProps {
  title: string;
  action?: React.ReactNode;
  className?: string;
  classes?: Record<"root" | "content", string>;
  connect?: ReduxFirestoreQuerySetting[];
  minHeight?: number;
  mapStateToProps?: (state: RootState) => Record<string, any>;
  render?: (props: Record<string, any>) => React.ReactNode;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: (props: { minHeight: number | undefined }) => ({
      display: "flex",
      flexDirection: "column",
      minHeight: props.minHeight,
    }),
    title: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: theme.spacing(0, 1, 0, 2),
      height: 60,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    emptyText: {
      justifyContent: "center",
      alignItems: "center",
    },
  })
);

const Panel: React.FC<PanelProps> = ({
  title,
  action,
  className,
  classes,
  minHeight,
  render,
  children,
  mapStateToProps,
  connect,
}) => {
  const panelClasses = useStyles({ minHeight });
  const { addListeners } = useContext(MainLayoutContext);
  const mappedState = useSelector(
    mapStateToProps
      ? mapStateToProps
      : // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (state: RootState): undefined => undefined
  );
  useEffect(() => {
    addListeners(connect);
  }, [addListeners, connect]);
  return (
    <Paper className={clsx(panelClasses.root, className, classes?.root)}>
      <div className={panelClasses.title}>
        <Typography variant="h5">{title}</Typography>
        {action}
      </div>
      <Divider />
      <div className={clsx(panelClasses.content, classes?.content)}>
        {render && mappedState ? render(mappedState) : undefined}
        {children}
      </div>
    </Paper>
  );
};

export default Panel;
