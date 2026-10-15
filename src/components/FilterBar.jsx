import { useDispatch, useSelector } from "react-redux";
import { setFilters, resetFilters } from "../features/events/eventsSlice";

function FilterBar() {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.events.filters);
    const isUpcoming = filters.view === "upcoming";

    return (
        <div className="filter-bar">
            <div className="tabs">
                <button
                    className={`tab ${!isUpcoming ? "active" : ""}`}
                    onClick={() => dispatch(setFilters({ view: "all" }))}
                >
                    All Events
                </button>
                <button
                    className={`tab ${isUpcoming ? "active" : ""}`}
                    onClick={() => dispatch(setFilters({ view: "upcoming" }))}
                >
                    Upcoming (next 30 days)
                </button>
            </div>

            <div className="filter-controls">
                <label>
                    Date
                    <input
                        type="date"
                        value={filters.date}
                        disabled={isUpcoming}
                        onChange={(e) => dispatch(setFilters({ date: e.target.value }))}
                    />
                </label>
                <label>
                    Sort by
                    <select
                        value={filters.sort}
                        disabled={isUpcoming}
                        onChange={(e) => dispatch(setFilters({ sort: e.target.value }))}
                    >
                        <option value="relevance,desc">Relevance</option>
                        <option value="date,asc">Date (soonest)</option>
                        <option value="name,asc">Name (A–Z)</option>
                    </select>
                </label>
                <button className="btn btn-outline" onClick={() => dispatch(resetFilters())}>
                    Reset
                </button>
            </div>
        </div>
    );
}

export default FilterBar;