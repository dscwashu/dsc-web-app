import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import store, { AppThunk, AppDispatch } from "../app/store";
import { UserCredential, Auth } from "../types";

export type AuthQuery = {
  auth: Auth;
  email: string;
  password: string;
};

interface AuthState {
  isLoaded: boolean;
  isEmpty: boolean;
  credentials?: Record<string, any>;
}

export const initialState: AuthState = {
  isLoaded: false,
  isEmpty: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    registerStart: (state): void => {
      state.isLoaded = false;
    },
    loginStart: (state): void => {
      state.isLoaded = false;
    },
    loadCredentials: (
      state,
      action: PayloadAction<Record<string, any>>
    ): void => {
      state.isLoaded = true;
      state.isEmpty = false;
      state.credentials = action.payload;
    },
    eraseCredentials: (state): void => {
      state.isLoaded = true;
      state.isEmpty = true;
      state.credentials = undefined;
    },
  },
});

export const {
  registerStart,
  loginStart,
  loadCredentials,
  eraseCredentials,
} = authSlice.actions;

export const register = ({ auth, email, password }: AuthQuery): AppThunk => {
  return (dispatch): Promise<UserCredential> => {
    dispatch(registerStart);
    return auth.createUserWithEmailAndPassword(email, password);
  };
};

export const login = ({
  auth,
  email,
  password,
}: AuthQuery): AppThunk<Promise<UserCredential>> => {
  return (dispatch: AppDispatch): Promise<UserCredential> => {
    dispatch(loginStart);
    return auth.signInWithEmailAndPassword(email, password);
  };
};

export const init = (auth: Auth): void => {
  auth.onAuthStateChanged((user) => {
    if (user) {
      store.dispatch(loadCredentials(user));
    } else {
      store.dispatch(eraseCredentials);
    }
  });
};

export default authSlice.reducer;
