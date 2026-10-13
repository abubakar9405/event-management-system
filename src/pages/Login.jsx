import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login, clearMessages } from "../features/auth/authSlice";

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, error, success } = useSelector((state) => state.auth);

    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});

    const redirectTo = location.state?.from?.pathname || "/events";

    useEffect(() => {
        if (user) navigate(redirectTo, { replace: true });
    }, [user, navigate, redirectTo]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const v = {};
        if (!/^\S+@\S+\.\S+$/.test(form.email)) v.email = "Enter a valid email address.";
        if (!form.password) v.password = "Password is required.";
        setErrors(v);
        if (Object.keys(v).length > 0) return;
        dispatch(login({ email: form.email.trim(), password: form.password }));
    };

    return (
        <div className="auth-page">
            <form className="card auth-form" onSubmit={handleSubmit} noValidate>
                <h2>Welcome back</h2>
                {success && <p className="alert alert-success">{success}</p>}
                {error && <p className="alert alert-error">{error}</p>}

                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
                {errors.email && <small className="field-error">{errors.email}</small>}

                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} />
                {errors.password && <small className="field-error">{errors.password}</small>}

                <button className="btn" type="submit">Login</button>
                <p className="muted">
                    No account?{" "}
                    <Link to="/register" onClick={() => dispatch(clearMessages())}>
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}

export default Login;