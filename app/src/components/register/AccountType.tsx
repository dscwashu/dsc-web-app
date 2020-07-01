import React from "react";
import { Link } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import FormControlLabel from "@material-ui/core/FormControlLabel";

interface AccountTypeProps {
  handleNext: () => void;
  role: string;
  setRole: (role: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    contentWrapper: {
      maxWidth: 320,
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: theme.spacing(5),
    },
    question: {
      marginBottom: theme.spacing(3),
    },
    radio: {
      alignSelf: "stretch",
    },
    buttonWrapper: {
      display: "flex",
      justifyContent: "space-between",
    },
  })
);

const AccountType: React.FC<AccountTypeProps> = function ({
  handleNext,
  role,
  setRole,
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.contentWrapper}>
        <Typography variant="h5" className={classes.question} align="center">
          Are you a student or a community organization?
        </Typography>
        <FormControl component="fieldset" className={classes.radio}>
          <RadioGroup
            aria-label="role"
            name="role"
            value={role}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
              setRole(e.target.value)
            }
          >
            <FormControlLabel
              value="student"
              control={<Radio />}
              label="Student"
            />
            <FormControlLabel
              value="org"
              control={<Radio />}
              label="Organization"
            />
          </RadioGroup>
        </FormControl>
      </div>
      <div className={classes.buttonWrapper}>
        <Button
          component={Link}
          to="/login"
          variant="text"
          color="primary"
          size="large"
        >
          Sign in Instead
        </Button>
        <Button
          onClick={handleNext}
          variant="contained"
          color="primary"
          size="large"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AccountType;
