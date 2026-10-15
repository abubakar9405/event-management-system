import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
    loadEventById,
    clearSelectedEvent,
} from "../features/events/eventsSlice";
import { formatDate, formatTime, formatPrice } from "../utils/eventHelpers";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

function EventDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { selectedEvent, detailsLoading, detailsError } = useSelector(
        (state) => state.events
    );

    useEffect(() => {
        dispatch(loadEventById(id));
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

    return (
        <div className="container">
            <Link to="/events">← Back to events</Link>

            <div className="card details">
                {e.image && <img className="details-image" src={e.image} alt={e.name} />}

                <h1>{e.name}</h1>
                {e.status && e.status !== "onsale" && (
                    <p className="alert alert-error">Status: {e.status}</p>
                )}

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
                    <a className="btn" href={e.url} target="_blank" rel="noreferrer">
                        Get tickets on Ticketmaster ↗
                    </a>
                )}
            </div>
        </div>
    );
}

export default EventDetails;