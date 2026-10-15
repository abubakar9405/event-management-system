import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCategories, setFilters } from "../features/events/eventsSlice";

function CategoryChips() {
    const dispatch = useDispatch();
    const categories = useSelector((state) => state.events.categories);
    const segmentId = useSelector((state) => state.events.filters.segmentId);

    useEffect(() => {
        if (categories.length === 0) dispatch(loadCategories());
    }, [dispatch, categories.length]);

    if (categories.length === 0) return null;

    return (
        <div className="chips">
            <button
                className={`chip ${segmentId === "" ? "active" : ""}`}
                onClick={() => dispatch(setFilters({ segmentId: "" }))}
            >
                All
            </button>
            {categories.map((c) => (
                <button
                    key={c.id}
                    className={`chip ${segmentId === c.id ? "active" : ""}`}
                    onClick={() => dispatch(setFilters({ segmentId: c.id }))}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
}

export default CategoryChips;