import { createSlice } from "@reduxjs/toolkit";

const loadRegistrations = () => {
    try {
        const saved = localStorage.getItem("registrations");
        if (saved) return JSON.parse(saved);
    } catch {
        // ignore corrupted storage
    }
    return [];
};

const initialState = {
    items: loadRegistrations(),
};

const registrationsSlice = createSlice({
    name: "registrations",
    initialState,
    reducers: {
        registerForEvent: {
            reducer(state, action) {
                const { userId, event } = action.payload;
                const exists = state.items.some(
                    (r) => r.userId === userId && r.eventId === event.id
                );
                if (exists) return; // prevents duplicate registration
                state.items.push(action.payload.registration);
            },
            // prepare() keeps the reducer pure: the timestamp is created here
            prepare(userId, event) {
                return {
                    payload: {
                        userId,
                        event,
                        registration: {
                            userId,
                            eventId: event.id,
                            registeredAt: new Date().toISOString(),
                            event,
                        },
                    },
                };
            },
        },
        cancelRegistration(state, action) {
            const { userId, eventId } = action.payload;
            state.items = state.items.filter(
                (r) => !(r.userId === userId && r.eventId === eventId)
            );
        },
    },
});

export const { registerForEvent, cancelRegistration } =
    registrationsSlice.actions;
export default registrationsSlice.reducer;