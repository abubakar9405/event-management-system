import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { cancelRegistration } from "../features/registrations/registrationsSlice";
import { isPastEvent } from "../utils/eventHelpers";
import EventCard from "../components/EventCard";

function MyEvents() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const registrations = useSelector((state) => state.registrations.items);

    // only this user's registrations
    const mine = registrations.filter((r) => r.userId === user?.id);

    const byDate = (r) => r.event.localDate || "9999-12-31";
    const upcoming = mine
        .filter((r) => !isPastEvent(r.event.localDate))
        .sort((a, b) => byDate(a).localeCompare(byDate(b)));
    const completed = mine
        .filter((r) => isPastEvent(r.event.localDate))
        .sort((a, b) => byDate(b).localeCompare(byDate(a)));

    const handleCancel = (eventId) => {
        if (!window.confirm("Cancel your registration for this event?")) return;
        dispatch(cancelRegistration({ userId: user.id, eventId }));
    };

    return (
        <div className="container">
            <h1>My Events</h1>

            {mine.length === 0 && (
                <div className="card">
                    <p>You haven't registered for any events yet.</p>
                    <Link className="btn" to="/events">
                        Browse events
                    </Link>
                </div>
            )}

            {upcoming.length > 0 && (
                <>
                    <h2 className="section-title">Upcoming ({upcoming.length})</h2>
                    <div className="event-grid">
                        {upcoming.map((r) => (
                            <div key={r.eventId} className="my-event">
                                <EventCard event={r.event} />
                                <button
                                    className="btn btn-danger"
                                    onClick={() => handleCancel(r.eventId)}
                                >
                                    Cancel registration
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {completed.length > 0 && (
                <>
                    <h2 className="section-title">Completed ({completed.length})</h2>
                    <div className="event-grid completed">
                        {completed.map((r) => (
                            <div key={r.eventId} className="my-event">
                                <EventCard event={r.event} />
                                <span className="badge badge-done">Completed</span>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default MyEvents;