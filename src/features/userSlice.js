import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
  },
  reducers: {
    login: (state, action) => {
      // in actions payload we will be passing the signed in user name from app.js the one where we have the useEffect hook which keeps a check whether the user is signed in or not
      state.user = action.payload;
    },
    logout: (state) => {
      // remove user from state
      state.user = null;
    },
    setSubscription: (state,action) =>{
      state.user.currSubscription = action.payload.currSubscription
    }
  
  },
});
// get access to login logout actions outside
export const { login, logout,setSubscription } = userSlice.actions;

//exporting selectors , which helps to access the states
export const selectUser = (state) => state.user.user;


export default userSlice.reducer;