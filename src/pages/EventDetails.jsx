import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    loadEventById,
    clearSelectedEvent,
} from "../features/events/eventsSlice";
import {
    registerForEvent,
    cancelRegistration,
} from "../features/registrations/registrationsSlice";
import {
    formatDate,
    formatTime,
    formatPrice,
    isPastEvent,
} from "../utils/eventHelpers";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function EventDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const location = useLocation();
    const { selectedEvent, detailsLoading, detailsError } = useSelector(
        (state) => state.events
    );
    const user = useSelector((state) => state.auth.user);
    const registrations = useSelector((state) => state.registrations.items);
    const [message, setMessage] = useState(null); // { type, text }

    useEffect(() => {
        dispatch(loadEventById(id));
        setMessage(null);
        return () => {
            dispatch(clearSelectedEvent());
        };
    }, [dispatch, id]);

    if (detailsLoading || (!selectedEvent && !detailsError)) {
        return (
            <div className="container">
                <Loader />
            </div>
        );
    }

    if (detailsError) {
        return (
            <div className="container">
                <ErrorMessage
                    message={detailsError}
                    onRetry={() => dispatch(loadEventById(id))}
                />
                <p>
                    <Link to="/events">← Back to events</Link>
                </p>
            </div>
        );
    }

    const e = selectedEvent;
    const address = [e.address, e.city, e.state, e.country].filter(Boolean).join(", ");
    const category = [e.category, e.genre, e.subGenre].filter(Boolean).join(" / ");

    const isRegistered =
        !!user && registrations.some((r) => r.userId === user.id && r.eventId === e.id);
    const isPast = isPastEvent(e.localDate);

    const handleRegister = () => {
        if (isRegistered) {
            setMessage({ type: "error", text: "You are already registered for this event." });
            return;
        }
        // store a snapshot so My Events needs no extra API calls
        dispatch(
            registerForEvent(user.id, {
                id: e.id,
                name: e.name,
                image: e.image,
                localDate: e.localDate,
                localTime: e.localTime,
                venueName: e.venueName,
                city: e.city,
                category: e.category,
                url: e.url,
            })
        );
        setMessage({ type: "success", text: "You have successfully registered for this event!" });
    };

    const handleCancel = () => {
        if (!window.confirm("Cancel your registration for this event?")) return;
        dispatch(cancelRegistration({ userId: user.id, eventId: e.id }));
        setMessage({ type: "success", text: "Your registration has been cancelled." });
    };

    return (
        <div className="container">
            <Link to="/events">← Back to events</Link>

            <div className="card details">
                {e.image && <img className="details-image" src={e.image} alt={e.name} />}

                <h1>{e.name}</h1>
                {e.status && e.status !== "onsale" && (
                    <p className="alert alert-error">Status: {e.status}</p>
                )}

                <div className="register-box">
                    {message && (
                        <p className={`alert alert-${message.type === "success" ? "success" : "error"}`}>
                            {message.text}
                        </p>
                    )}

                    {!user && (
                        <Link className="btn" to="/login" state={{ from: location }}>
                            Login to register
                        </Link>
                    )}

                    {user && isRegistered && (
                        <>
                            <p className="registered-tag">✅ You are registered for this event</p>
                            {!isPast && (
                                <button className="btn btn-danger" onClick={handleCancel}>
                                    Cancel registration
                                </button>
                            )}
                        </>
                    )}

                    {user && !isRegistered && !isPast && (
                        <button className="btn" onClick={handleRegister}>
                            Register for this event
                        </button>
                    )}

                    {user && !isRegistered && isPast && (
                        <p className="muted">This event has already taken place.</p>
                    )}
                </div>

                <div className="details-grid">
                    <div>
                        <h4>Date & Time</h4>
                        <p>
                            {formatDate(e.localDate)} at {formatTime(e.localTime)}
                        </p>
                    </div>
                    <div>
                        <h4>Venue</h4>
                        <p>{e.venueName || "Venue TBA"}</p>
                    </div>
                    <div>
                        <h4>Location</h4>
                        <p>{address || "Location TBA"}</p>
                    </div>
                    <div>
                        <h4>Category</h4>
                        <p>{category || "Not specified"}</p>
                    </div>
                    <div>
                        <h4>Price</h4>
                        <p>{formatPrice(e)}</p>
                    </div>
                    {e.promoter && (
                        <div>
                            <h4>Promoter</h4>
                            <p>{e.promoter}</p>
                        </div>
                    )}
                </div>

                {e.attractions.length > 0 && (
                    <>
                        <h4>Performers / Teams</h4>
                        <p>{e.attractions.join(", ")}</p>
                    </>
                )}
                {e.info && (
                    <>
                        <h4>Event Info</h4>
                        <p>{e.info}</p>
                    </>
                )}
                {e.pleaseNote && (
                    <>
                        <h4>Please Note</h4>
                        <p>{e.pleaseNote}</p>
                    </>
                )}

                {e.url && (
                    <a className="btn btn-outline" href={e.url} target="_blank" rel="noreferrer">
                        Get tickets on Ticketmaster ↗
                    </a>
                )}
            </div>
        </div>
    );
}

export default EventDetails;