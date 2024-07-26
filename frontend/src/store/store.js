import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./Slices/authSlice.js";
import videoSliceReducer from "./Slices/videoSlice.js";
import dashboardSlice from "./Slices/dashboardSlice.js";
import userSliceReducer from "./Slices/userSlice.js";

const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    video: videoSliceReducer,
    dashboard: dashboardSlice,
    user: userSliceReducer,
  },
});

export default store;
