import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register, clearMessages } from "../features/auth/authSlice";

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { error, success } = useSelector((state) => state.auth);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirm: "",
    });
    const [errors, setErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        dispatch(clearMessages());
    }, [dispatch]);

    useEffect(() => {
        if (submitted && success) {
            navigate("/login");
        }
    }, [submitted, success, navigate]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const e = {};
        if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters.";
        if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email address.";
        if (form.password.length < 6) e.password = "Password must be at least 6 characters.";
        if (form.password !== form.confirm) e.confirm = "Passwords do not match.";
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const v = validate();
        setErrors(v);
        if (Object.keys(v).length > 0) return;
        dispatch(
            register({
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
            })
        );
        setSubmitted(true);
    };

    return (
        <div className="auth-page">
            <form className="card auth-form" onSubmit={handleSubmit} noValidate>
                <h2>Create account</h2>
                {error && <p className="alert alert-error">{error}</p>}

                <label>Name</label>
                <input name="name" value={form.name} onChange={handleChange} />
                {errors.name && <small className="field-error">{errors.name}</small>}

                <label>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} />
                {errors.email && <small className="field-error">{errors.email}</small>}

                <label>Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} />
                {errors.password && <small className="field-error">{errors.password}</small>}

                <label>Confirm password</label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} />
                {errors.confirm && <small className="field-error">{errors.confirm}</small>}

                <button className="btn" type="submit">Register</button>
                <p className="muted">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;