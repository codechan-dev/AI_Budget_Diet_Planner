import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ParticalBG from '../components/ParticalBG';

const RegisterPage = () => {
    const { register, authLoading, authError, clearAuthError } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: '' }));
        clearAuthError();
    };

    const validate = () => {
        const errs = {};
        if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.';
        if (!form.email.trim()) errs.email = 'Email is required.';
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) errs.email = 'Enter a valid email.';
        if (!form.password) errs.password = 'Password is required.';
        else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters.';
        return errs;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        const ok = await register({ name: form.name.trim(), email: form.email, password: form.password });
        if (ok) navigate('/');
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <ParticalBG />
            <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <div className="glass-card p-4 p-md-5 rounded-4 w-100" style={{ maxWidth: 440, zIndex: 1 }}>
                    <h4 className="fw-bold mb-1 text-center" style={{ color: '#0f172a' }}>Create Account</h4>
                    <p className="text-center text-muted small mb-4">Join us today — it&apos;s free</p>

                    {authError && (
                        <div className="alert alert-danger py-2 small" role="alert">{authError}</div>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ color: '#0f172a' }}>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                autoComplete="name"
                            />
                            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                        </div>

                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ color: '#0f172a' }}>Email</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold" style={{ color: '#0f172a' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                placeholder="Min. 6 characters"
                                value={form.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={authLoading}
                            className="btn btn-success w-100 fw-semibold rounded-3"
                        >
                            {authLoading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center small mt-3 mb-0" style={{ color: '#0f172a' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="text-success fw-semibold">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
