import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";

import AccountType from "../components/register/AccountType";
import CreateAccount from "../components/register/CreateAccount";
import EditProfile from "../components/register/EditProfile";
import AuthLayout from "../components/AuthLayout";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
    },
    stepper: {
      marginBottom: theme.spacing(3),
    },
  })
);

interface LocationState {
  from: string;
}

const Register: React.FC = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState("student");

  const location = useLocation<LocationState>();
  useEffect(() => {
    if (location.state?.from === "main") {
      setActiveStep(2);
    }
  }, [location]);

  const handleNext = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <AuthLayout maxWidth={600}>
      <form className={classes.root} noValidate>
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          className={classes.stepper}
        >
          <Step>
            <StepLabel>Account Type</StepLabel>
          </Step>
          <Step>
            <StepLabel>Create Account</StepLabel>
          </Step>
          <Step>
            <StepLabel>Edit Profile</StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 ? (
          <AccountType handleNext={handleNext} role={role} setRole={setRole} />
        ) : null}
        {activeStep === 1 ? (
          <CreateAccount
            handleBack={handleBack}
            handleNext={handleNext}
            role={role}
          />
        ) : null}
        {activeStep === 2 ? <EditProfile role={role} /> : null}
      </form>
    </AuthLayout>
  );
};

export default Register;
