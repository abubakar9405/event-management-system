import { Link } from "react-router-dom";
import { formatDate, formatTime } from "../utils/eventHelpers";

function EventCard({ event }) {
    const location = [event.venueName, event.city].filter(Boolean).join(", ");

    return (
        <Link to={`/events/${event.id}`} className="event-card">
            {event.image ? (
                <img src={event.image} alt={event.name} loading="lazy" />
            ) : (
                <div className="no-image">No image</div>
            )}
            <div className="event-card-body">
                {event.category && <span className="badge">{event.category}</span>}
                <h3>{event.name}</h3>
                <p className="muted">
                    📅 {formatDate(event.localDate)} · {formatTime(event.localTime)}
                </p>
                {location && <p className="muted">📍 {location}</p>}
            </div>
        </Link>
    );
}

export default EventCard;