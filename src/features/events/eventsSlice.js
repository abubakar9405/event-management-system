import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    fetchEvents,
    fetchEventById,
    fetchClassifications,
} from "../../services/ticketmaster";
import { normalizeEvent } from "../../utils/eventHelpers";

const PAGE_SIZE = 12;
const MAX_PAGES = Math.floor(1000 / PAGE_SIZE); // API allows size * page < 1000

export const defaultFilters = {
    keyword: "",
    city: "",
    segmentId: "",
    date: "",
    sort: "relevance,desc",
    view: "all", // "all" or "upcoming"
};

const toApiDate = (d) => d.toISOString().split(".")[0] + "Z";

const buildParams = (filters, page) => {
    const params = {
        size: PAGE_SIZE,
        page,
        keyword: filters.keyword,
        city: filters.city,
        segmentId: filters.segmentId,
    };

    if (filters.view === "upcoming") {
        const now = new Date();
        const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        params.startDateTime = toApiDate(now);
        params.endDateTime = toApiDate(end);
        params.sort = "date,asc";
    } else {
        params.sort = filters.sort;
        if (filters.date) {
            params.startDateTime = `${filters.date}T00:00:00Z`;
            params.endDateTime = `${filters.date}T23:59:59Z`;
        }
    }
    return params;
};

export const loadEvents = createAsyncThunk(
    "events/loadEvents",
    async (page = 0, { getState, rejectWithValue }) => {
        try {
            const { filters } = getState().events;
            const data = await fetchEvents(buildParams(filters, page));
            return {
                events: (data._embedded?.events || []).map(normalizeEvent),
                page: data.page?.number ?? 0,
                totalPages: Math.min(data.page?.totalPages ?? 0, MAX_PAGES),
            };
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const loadEventById = createAsyncThunk(
    "events/loadEventById",
    async (id, { rejectWithValue }) => {
        try {
            const data = await fetchEventById(id);
            return normalizeEvent(data);
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const loadCategories = createAsyncThunk(
    "events/loadCategories",
    async (_, { rejectWithValue }) => {
        try {
            const data = await fetchClassifications();
            const map = new Map();
            (data._embedded?.classifications || []).forEach((c) => {
                if (c.segment && c.segment.name !== "Undefined") {
                    map.set(c.segment.id, { id: c.segment.id, name: c.segment.name });
                }
            });
            return [...map.values()];
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const initialState = {
    events: [],
    page: 0,
    totalPages: 0,
    loading: true,
    error: null,
    filters: defaultFilters,
    selectedEvent: null,
    detailsLoading: false,
    detailsError: null,
    categories: [],
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        setFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters(state) {
            state.filters = { ...defaultFilters };
        },
        clearSelectedEvent(state) {
            state.selectedEvent = null;
            state.detailsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // events list
            .addCase(loadEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.events;
                state.page = action.payload.page;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(loadEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Something went wrong.";
            })
            // single event
            .addCase(loadEventById.pending, (state) => {
                state.detailsLoading = true;
                state.detailsError = null;
            })
            .addCase(loadEventById.fulfilled, (state, action) => {
                state.detailsLoading = false;
                state.selectedEvent = action.payload;
            })
            .addCase(loadEventById.rejected, (state, action) => {
                state.detailsLoading = false;
                state.detailsError = action.payload || "Could not load this event.";
            })
            // categories
            .addCase(loadCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            });
    },
});

export const { setFilters, resetFilters, clearSelectedEvent } =
    eventsSlice.actions;
export default eventsSlice.reducer;