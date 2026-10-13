import { createSlice } from "@reduxjs/toolkit";

const loadAuth = () => {
    try {
        const saved = localStorage.getItem("auth");
        if (saved) return JSON.parse(saved);
    } catch {
        // ignore corrupted storage
    }
    return { users: [], user: null };
};

const saved = loadAuth();

const initialState = {
    users: saved.users, // all registered accounts (frontend simulation)
    user: saved.user, // currently logged-in user
    error: null,
    success: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        register(state, action) {
            const { name, email, password } = action.payload;
            const exists = state.users.some(
                (u) => u.email.toLowerCase() === email.toLowerCase()
            );
            if (exists) {
                state.error = "An account with this email already exists.";
                state.success = null;
                return;
            }
            state.users.push({ id: Date.now().toString(), name, email, password });
            state.error = null;
            state.success = "Registration successful! Please log in.";
        },
        login(state, action) {
            const { email, password } = action.payload;
            const found = state.users.find(
                (u) =>
                    u.email.toLowerCase() === email.toLowerCase() &&
                    u.password === password
            );
            if (!found) {
                state.error = "Invalid email or password.";
                state.success = null;
                return;
            }
            state.user = { id: found.id, name: found.name, email: found.email };
            state.error = null;
            state.success = null;
        },
        logout(state) {
            state.user = null;
        },
        clearMessages(state) {
            state.error = null;
            state.success = null;
        },
    },
});

export const { register, login, logout, clearMessages } = authSlice.actions;
export default authSlice.reducer;