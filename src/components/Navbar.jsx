import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Navbar() {
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <Link to="/events" className="brand">
                🎟️ EventHub
            </Link>
            <div className="nav-links">
                <NavLink to="/events">Events</NavLink>
                {user ? (
                    <>
                        <NavLink to="/my-events">My Events</NavLink>
                        <span className="nav-user">Hi, {user.name}</span>
                        <button className="btn btn-outline" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <NavLink to="/login">Login</NavLink>
                        <NavLink to="/register">Register</NavLink>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;