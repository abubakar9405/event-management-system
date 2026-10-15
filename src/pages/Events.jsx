import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadEvents } from "../features/events/eventsSlice";
import EventCard from "../components/EventCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";
import SearchBar from "../components/SearchBar";
import CategoryChips from "../components/CategoryChips";
import FilterBar from "../components/FilterBar";

function Events() {
    const dispatch = useDispatch();
    const { events, loading, error, page, totalPages, filters } = useSelector(
        (state) => state.events
    );

    useEffect(() => {
        dispatch(loadEvents(0));
    }, [dispatch, filters]);

    const goToPage = (p) => {
        dispatch(loadEvents(p));
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="container">
            <h1>Explore Events</h1>

            <SearchBar />
            <CategoryChips />
            <FilterBar />

            {loading && <Loader />}

            {error && !loading && (
                <ErrorMessage message={error} onRetry={() => dispatch(loadEvents(page))} />
            )}

            {!loading && !error && events.length === 0 && (
                <p className="muted">No events found. Try different filters.</p>
            )}

            {!loading && !error && events.length > 0 && (
                <>
                    <div className="event-grid">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>

                    <div className="pagination">
                        <button
                            className="btn btn-outline"
                            disabled={page === 0}
                            onClick={() => goToPage(page - 1)}
                        >
                            ← Previous
                        </button>
                        <span>
                            Page {page + 1} of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline"
                            disabled={page + 1 >= totalPages}
                            onClick={() => goToPage(page + 1)}
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Events;