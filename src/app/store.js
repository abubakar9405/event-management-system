import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import eventsReducer from "../features/events/eventsSlice";
import registrationsReducer from "../features/registrations/registrationsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        events: eventsReducer,
        registrations: registrationsReducer,
    },
});

// Persist auth and registrations to localStorage whenever state changes
store.subscribe(() => {
    const { auth, registrations } = store.getState();
    localStorage.setItem(
        "auth",
        JSON.stringify({ users: auth.users, user: auth.user })
    );
    localStorage.setItem("registrations", JSON.stringify(registrations.items));
});