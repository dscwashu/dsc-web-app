import React, { useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { useHistory } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

interface CreateAccountProps {
  role: string;
}

// update
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    title: {
      marginBottom: theme.spacing(3),
    },
    body: {
      marginBottom: theme.spacing(2),
    },
    contentWrapper: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
      display: "flex",
      flexDirection: "column",
      marginBottom: theme.spacing(3),
    },
    firstName: {
      marginBottom: theme.spacing(1),
      width: "100%",
    },
    lastName: {
      marginBottom: theme.spacing(1),
      width: "100%",
    },
    website: {
      marginBottom: theme.spacing(1),
      width: "100%",
    },
    grade: {
      marginBottom: theme.spacing(1),
      width: "100%",
    },
    bio: {
      marginBottom: theme.spacing(1),
      width: "100%",
    },
    button: {
      alignSelf: "flex-end",
    },
  })
);

const CreateAccount: React.FC<CreateAccountProps> = function ({ role }) {
  const classes = useStyles();

  const history = useHistory();

  const firebase = useFirebase();

  const [grade, setGrade] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [website, setWebsite] = useState("");
  const [bio, setBio] = useState("");
  const CHARACTER_LIMIT = 500;

  const updateProfile = (): void => {
    console.log("update");
  };

  return (
    <div className={classes.root}>
      <div className={classes.contentWrapper}>
        <Typography variant="h5" className={classes.title} align="center">
          Tell Us About Yourself
        </Typography>
        <Typography variant="body1" className={classes.body}>
          Help students and community organizations learn a little more about
          you.
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              required
              id="first-name"
              autoComplete="given-name"
              label="First Name"
              type="text"
              variant="outlined"
              autoFocus={true}
              value={firstName}
              className={classes.firstName}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  updateProfile();
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setFirstName(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="last-name"
              autoComplete="family-name"
              label="Last Name"
              type="text"
              variant="outlined"
              autoFocus={true}
              value={lastName}
              className={classes.lastName}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  updateProfile();
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setLastName(e.target.value);
              }}
            />
          </Grid>
          <Grid item xs>
            <TextField
              id="website"
              autoComplete="url"
              label="Website"
              type="text"
              variant="outlined"
              autoFocus={true}
              value={website}
              className={classes.website}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  updateProfile();
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setWebsite(e.target.value);
              }}
            />
          </Grid>
          {role === "student" ? (
            <Grid item xs={4}>
              <FormControl variant="outlined" className={classes.grade}>
                <InputLabel id="demo-simple-select-outlined-label">
                  Grade
                </InputLabel>
                <Select
                  labelId="demo-simple-select-outlined-label"
                  id="demo-simple-select-outlined"
                  value={grade}
                  onChange={(e: React.ChangeEvent<{ value: unknown }>): void =>
                    setGrade(e.target.value as string)
                  }
                  label="Grade"
                >
                  <MenuItem value={1}>First-Year</MenuItem>
                  <MenuItem value={2}>Sophomore</MenuItem>
                  <MenuItem value={3}>Junior</MenuItem>
                  <MenuItem value={4}>Senior</MenuItem>
                  <MenuItem value={5}>Graduate</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          ) : null}
          <Grid item xs={12}>
            <TextField
              multiline
              id="bio"
              label="Short Bio"
              inputProps={{
                maxlength: CHARACTER_LIMIT,
              }}
              helperText={`${bio.length}/${CHARACTER_LIMIT}`}
              type="text"
              variant="outlined"
              rows={4}
              autoFocus={true}
              value={bio}
              className={classes.bio}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>): void => {
                if (e.keyCode === 13) {
                  e.preventDefault();
                  updateProfile();
                }
              }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                setBio(e.target.value);
              }}
            />
          </Grid>
        </Grid>
      </div>
      <Button
        onClick={updateProfile}
        variant="contained"
        color="primary"
        size="large"
        className={classes.button}
      >
        Next
      </Button>
    </div>
  );
};

export default CreateAccount;
