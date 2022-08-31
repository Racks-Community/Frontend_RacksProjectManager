import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
    },
  });

export const wrapper = createWrapper(makeStore);
