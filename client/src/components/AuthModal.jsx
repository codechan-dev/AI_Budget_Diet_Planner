import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ show, onClose }) => {
    const { register, login, authLoading, authError, clearAuthError } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    // Reset form when modal opens/closes or mode switches
    useEffect(() => {
        setForm({ name: '', email: '', password: '' });
        clearAuthError();
    }, [show, mode, clearAuthError]);

    if (!show) return null;

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let ok;
        if (mode === 'register') {
            ok = await register({ name: form.name, email: form.email, password: form.password });
        } else {
            ok = await login({ email: form.email, password: form.password });
        }
        if (ok) onClose();
    };

    return (
        <div
            className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{ background: 'rgba(0,0,0,0.55)', zIndex: 1050 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="glass-card p-4 p-md-5 rounded-4"
                style={{ width: '100%', maxWidth: 420 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0" style={{ color: '#0f172a' }}>
                        {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h5>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Close"
                        onClick={onClose}
                    />
                </div>

                {/* Toggle tabs */}
                <div className="d-flex mb-4 gap-2">
                    <button
                        type="button"
                        className={`btn btn-sm flex-fill rounded-3 fw-semibold ${mode === 'login' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setMode('login')}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`btn btn-sm flex-fill rounded-3 fw-semibold ${mode === 'register' ? 'btn-success' : 'btn-outline-secondary'}`}
                        onClick={() => setMode('register')}
                    >
                        Register
                    </button>
                </div>

                {/* Error */}
                {authError && (
                    <div className="alert alert-danger py-2 small" role="alert">
                        {authError}
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {mode === 'register' && (
                        <div className="mb-3">
                            <label className="form-label fw-semibold" style={{ color: '#0f172a' }}>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                required
                                minLength={2}
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label fw-semibold" style={{ color: '#0f172a' }}>
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ color: '#0f172a' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'}
                            value={form.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={authLoading}
                        className="btn btn-success w-100 fw-semibold rounded-3"
                    >
                        {authLoading
                            ? (mode === 'login' ? 'Logging in…' : 'Registering…')
                            : (mode === 'login' ? 'Login' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
