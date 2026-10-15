const BASE_URL = "https://app.ticketmaster.com/discovery/v2";
const API_KEY = import.meta.env.VITE_TICKETMASTER_API_KEY;

async function request(path, params = {}) {
    if (!API_KEY) {
        throw new Error("API key missing. Check your .env file and restart the dev server.");
    }

    const query = new URLSearchParams({ apikey: API_KEY });
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.append(key, value);
        }
    });

    const res = await fetch(`${BASE_URL}${path}?${query.toString()}`);

    if (res.status === 429) {
        throw new Error("Too many requests. Please wait a moment and try again.");
    }
    if (!res.ok) {
        throw new Error(`Request failed (status ${res.status}).`);
    }
    return res.json();
}

export const fetchEvents = (params) => request("/events.json", params);
export const fetchEventById = (id) => request(`/events/${id}.json`);
export const fetchClassifications = () =>
    request("/classifications.json", { size: 200 });