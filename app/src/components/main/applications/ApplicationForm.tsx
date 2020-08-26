import React, { useState, useEffect, useContext, useRef } from "react";
import { useFirestore } from "react-redux-firebase";
import { RootState } from "../../../app/rootReducer";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Panel from "../Panel";
import LoadingApplicationForm from "./LoadingApplicationForm";
import { MainLayoutContext } from "../MainLayout";

import { Answer, ApplicationType } from "../../../types";

interface ApplicationFormProps {
  type: ApplicationType;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(3),
    },
    question: {
      marginBottom: theme.spacing(2),
    },
    answer: {
      alignSelf: "stretch",
      marginBottom: theme.spacing(3),
    },
    button: {
      marginTop: theme.spacing(3),
      alignSelf: "flex-end",
    },
  })
);

const usePanelStyles = makeStyles(() =>
  createStyles({
    root: {
      maxWidth: 800,
      width: "100%",
    },
    content: {
      display: "flex",
      flexDirection: "column",
    },
  })
);

const ApplicationForm: React.FC<ApplicationFormProps> = ({ type }) => {
  const classes = useStyles();
  const panelClasses = usePanelStyles();

  const history = useHistory();

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [errors, setErrors] = useState<boolean[]>([]);
  const listNameRef = useRef<string>("");

  const { handleSnackbarOpen, getCache } = useContext(MainLayoutContext);

  let listName: string;
  let panelTitle: string;
  switch (type) {
    case "orgProject":
    case "studentProject":
      listName = "projectQuestions";
      panelTitle = "New Project Application";
      break;
    case "coreTeam":
      listName = "coreTeamQuestions";
      panelTitle = "New Core Team Application";
      break;
    case "projectManager":
      listName = "projectManagerQuestions";
      panelTitle = "New Project Manager Application";
      break;
    case "projectMember":
      listName = "";
      panelTitle = "";
      break;
    default:
      listName = "";
      panelTitle = "";
      break;
  }

  const firestore = useFirestore();

  useEffect(() => {
    if (listName && listNameRef.current !== listName) {
      listNameRef.current = listName;
      getCache(
        [
          {
            collection: "lists",
            doc: listName,
          },
        ],
        60000
      );
    }
  }, [listName, getCache]);

  const { questions, uid } = useSelector((state: RootState) => ({
    uid: state.firebase.auth.uid,
    questions: state.firestore.data.lists?.[listName]?.questions,
  }));
  useEffect(() => {
    if (questions) {
      const initAnswers: Answer[] = [];
      const initErrors: boolean[] = [];
      for (let i = 0; i < questions.length; i++) {
        initAnswers.push({
          question: questions[i].trim(),
          answer: "",
        });
        initErrors.push(false);
      }
      setAnswers(initAnswers);
      setErrors(initErrors);
    }
  }, [questions]);

  const submitApplication = (): void => {
    // Open snackbar of questions don't match errors (shouldn't happen)
    if (questions.length !== answers.length) {
      handleSnackbarOpen(
        "error",
        "There was an error submitting the application. Please try again later."
      );
      return;
    }

    // Make sure no answers are empty
    let match = true;
    const returnedErrors: boolean[] = [];
    for (let i = 0; i < questions.length; i++) {
      answers[i].answer = answers[i].answer.trim();
      if (answers[i].answer === "") {
        match = false;
        returnedErrors[i] = true;
      }
    }
    if (!match) {
      setErrors(returnedErrors);
      return;
    }

    const info = {
      answers: answers,
      createdAt: firestore.FieldValue.serverTimestamp(),
      type: type,
      user: uid,
    };
    switch (type) {
      case "orgProject":
      case "studentProject":
      case "coreTeam":
        Object.assign(info, {
          project: "",
        });
        break;
      case "projectManager":
      case "projectMember":
        Object.assign(info, {
          project: "",
        });
        break;
    }
    firestore
      .add(
        {
          collection: "applications",
        },
        {
          accepted: false,
          pending: true,
          info,
        }
      )
      .then(() => {
        handleSnackbarOpen(
          "success",
          "Thank you for submitting your application!"
        );
        history.push("/main/dashboard");
      })
      .catch(() => {
        handleSnackbarOpen(
          "error",
          "There was an error submitting the application. Please try again later."
        );
      });
  };

  if (questions) {
    return (
      <div className={classes.root}>
        <Panel title={panelTitle} classes={panelClasses}>
          {questions.map((question: string, index: number) => (
            <React.Fragment key={index}>
              <Typography className={classes.question}>{question}</Typography>
              <TextField
                className={classes.answer}
                id={question + "-answer-field"}
                label="Answer"
                multiline
                rows={4}
                variant="outlined"
                error={errors[index]}
                onKeyDown={(): void => {
                  if (errors[index]) {
                    setErrors((prev) => {
                      const errorsClone = prev.slice();
                      errorsClone[index] = false;
                      return errorsClone;
                    });
                  }
                }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                  const value = e.target.value;
                  setAnswers((prev) => {
                    const answersClone = prev.slice();
                    answersClone[index].answer = value;
                    return answersClone;
                  });
                }}
                helperText={
                  errors[index] ? "Please enter an answer" : undefined
                }
              />
            </React.Fragment>
          ))}
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            onClick={submitApplication}
          >
            Submit
          </Button>
        </Panel>
      </div>
    );
  }
  return <LoadingApplicationForm />;
};

export default ApplicationForm;
