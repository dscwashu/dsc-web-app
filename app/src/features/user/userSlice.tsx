import { createSlice } from "@reduxjs/toolkit";

interface RepoDetailsState {
  openIssuesCount: number;
  error: string | null;
}

const initialState: RepoDetailsState = {
  openIssuesCount: -1,
  error: null,
};

const user = createSlice({
  name: "user",
  initialState,
  reducers: {},
});

//export const {} = user.actions;

export default user.reducer;
