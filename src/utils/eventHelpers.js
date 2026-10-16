// Turns a raw Ticketmaster event into a clean, simple object
export function normalizeEvent(e) {
    const venue = e._embedded?.venues?.[0];
    const classification = e.classifications?.[0];
    const price = e.priceRanges?.[0];

    return {
        id: e.id,
        name: e.name,
        url: e.url || null,
        image:
            e.images?.find((i) => i.ratio === "16_9" && i.width >= 640)?.url ??
            e.images?.[0]?.url ??
            null,
        localDate: e.dates?.start?.localDate || null,
        localTime: e.dates?.start?.localTime || null,
        timezone: e.dates?.timezone || null,
        status: e.dates?.status?.code || null,
        category: classification?.segment?.name || null,
        genre: classification?.genre?.name || null,
        subGenre: classification?.subGenre?.name || null,
        venueName: venue?.name || null,
        address: venue?.address?.line1 || null,
        city: venue?.city?.name || null,
        state: venue?.state?.name || null,
        country: venue?.country?.name || null,
        priceMin: price?.min ?? null,
        priceMax: price?.max ?? null,
        currency: price?.currency || null,
        info: e.info || null,
        pleaseNote: e.pleaseNote || null,
        promoter: e.promoter?.name || null,
        attractions: (e._embedded?.attractions || []).map((a) => a.name),
    };
}

export function formatDate(localDate) {
    if (!localDate) return "Date TBA";
    return new Date(`${localDate}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function formatTime(localTime) {
    if (!localTime) return "Time TBA";
    const [h, m] = localTime.split(":");
    const d = new Date();
    d.setHours(Number(h), Number(m));
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatPrice(event) {
    if (event.priceMin == null) return "Price not available";
    const cur = event.currency || "";
    if (event.priceMax != null && event.priceMax !== event.priceMin) {
        return `${cur} ${event.priceMin} – ${event.priceMax}`;
    }
    return `${cur} ${event.priceMin}`;
}
// true if the event date is before today
export function isPastEvent(localDate) {
    if (!localDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(`${localDate}T00:00:00`) < today;
}