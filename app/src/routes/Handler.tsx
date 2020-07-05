import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useFirebase } from "react-redux-firebase";

import DialogLayout from "../components/DialogLayout";
import ResetInput from "../components/ResetPassword";
import LoadingHandler from "../components/LoadingHandler";
import { getParams } from "../utils/stringUtils";

export enum ParamState {
  Invalid,
  Valid,
}

export enum ResetState {
  Loading,
  Input,
  Done,
  Error,
}

export enum VerifyState {
  Loading,
  Done,
  Error,
}

export enum Mode {
  Reset = "resetPassword",
  VerifyEmail = "verifyEmail",
}

const Handler: React.FC = () => {
  const location = useLocation();

  const firebase = useFirebase();

  const [mode, setMode] = useState("");
  const [oobCode, setOobCode] = useState("");
  const [paramState, setParamState] = useState<ParamState>();
  const [resetState, setResetState] = useState<ResetState>(ResetState.Loading);
  const [verifyState, setVerifyState] = useState<VerifyState>(
    VerifyState.Loading
  );

  useEffect(() => {
    const params = getParams(location.search);
    if (params === undefined) {
      setParamState(ParamState.Invalid);
    } else {
      if (
        !params.oobCode ||
        (params.mode !== Mode.Reset && params.mode !== Mode.VerifyEmail)
      ) {
        setParamState(ParamState.Invalid);
      } else {
        setMode(params.mode);
        setOobCode(params.oobCode);
        setParamState(ParamState.Valid);
      }
    }
  }, [location]);

  switch (paramState) {
    case ParamState.Invalid:
      return (
        <DialogLayout
          title="Invalid Link"
          body="The link is invalid or broken."
        />
      );
    case ParamState.Valid:
      switch (mode) {
        case Mode.Reset:
          switch (resetState) {
            case ResetState.Loading:
              firebase
                .verifyPasswordResetCode(oobCode)
                .then(() => {
                  setResetState(ResetState.Input);
                })
                .catch(() => {
                  setResetState(ResetState.Error);
                });
              break;
            case ResetState.Input:
              return (
                <ResetInput oobCode={oobCode} setResetState={setResetState} />
              );
            case ResetState.Done:
              return (
                <DialogLayout
                  title="Password Succesfully Reset"
                  body="You have successfuly reset your password. Please return to the login screen."
                />
              );
            case ResetState.Error:
              return (
                <DialogLayout
                  title="Expired Link"
                  body="Your request to reset your password has expired or the link has already been used."
                />
              );
          }
          break;
        case Mode.VerifyEmail:
          switch (verifyState) {
            case VerifyState.Loading:
              firebase
                .auth()
                .applyActionCode(oobCode)
                .then(() => {
                  setVerifyState(VerifyState.Done);
                })
                .catch(() => {
                  setVerifyState(VerifyState.Error);
                });
              break;
            case VerifyState.Done:
              return (
                <DialogLayout
                  title="Verification Successful"
                  body="Your email has been verified. Please return to the application."
                />
              );
            case VerifyState.Error:
              return (
                <DialogLayout
                  title="Expired Link"
                  body="Your request to verify your email has expired or the link has already been used."
                />
              );
          }
          break;
      }
      break;
  }
  return <LoadingHandler />;
};

export default Handler;
