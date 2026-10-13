import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
    },
});

// Persist auth state to localStorage whenever it changes
store.subscribe(() => {
    const { users, user } = store.getState().auth;
    localStorage.setItem("auth", JSON.stringify({ users, user }));
});