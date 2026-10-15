import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../features/events/eventsSlice";

function SearchBar() {
    const dispatch = useDispatch();
    const filters = useSelector((state) => state.events.filters);
    const [keyword, setKeyword] = useState(filters.keyword);
    const [city, setCity] = useState(filters.city);

    // keep inputs in sync when filters are reset
    useEffect(() => {
        setKeyword(filters.keyword);
        setCity(filters.city);
    }, [filters.keyword, filters.city]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setFilters({ keyword: keyword.trim(), city: city.trim() }));
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                placeholder="Search events, artists, teams..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <input
                placeholder="City (e.g. London)"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button className="btn" type="submit">
                Search
            </button>
        </form>
    );
}

export default SearchBar;