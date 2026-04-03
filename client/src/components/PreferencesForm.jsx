import { useState, useEffect } from 'react';
import api from '../utils/api';

const DIET_TYPES = [
    { value: 'veg', label: 'Vegetarian' },
    { value: 'non-veg', label: 'Non-Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
];

const PreferencesForm = ({ onSaved }) => {
    const [form, setForm] = useState({
        budget: '',
        allergies: '',
        dietType: 'veg',
        caloriesTarget: '',
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Load existing preferences on mount
    useEffect(() => {
        api.get('/api/preferences')
            .then(({ data }) => {
                const p = data.preferences;
                setForm({
                    budget: p.budget ?? '',
                    allergies: Array.isArray(p.allergies) ? p.allergies.join(', ') : '',
                    dietType: p.dietType ?? 'veg',
                    caloriesTarget: p.caloriesTarget ?? '',
                });
            })
            .catch(() => { /* no prefs yet — stay with defaults */ })
            .finally(() => setFetching(false));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        setError(null);
        setSuccess(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        // Parse allergies from comma-separated string
        const allergies = form.allergies
            .split(',')
            .map(a => a.trim())
            .filter(Boolean);

        const payload = {
            budget: Number(form.budget),
            allergies,
            dietType: form.dietType,
            caloriesTarget: form.caloriesTarget !== '' ? Number(form.caloriesTarget) : null,
        };

        // Client-side guard before hitting the server
        if (!payload.budget || payload.budget < 1 || payload.budget >= 10000) {
            setError('Budget must be greater than 0 and less than 10000.');
            return;
        }
        if (allergies.length > 10) {
            setError('You can enter at most 10 allergies.');
            return;
        }
        if (payload.caloriesTarget !== null &&
            (payload.caloriesTarget < 1000 || payload.caloriesTarget > 5000)) {
            setError('Calories target must be between 1000 and 5000.');
            return;
        }

        setLoading(true);
        try {
            await api.post('/api/preferences', payload);
            setSuccess(true);
            if (onSaved) onSaved();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to save preferences.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="text-center py-4">
                <div className="spinner-border text-success" role="status" />
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
                <h5 className="card-title mb-4 fw-bold">
                    <i className="bi bi-sliders me-2 text-success" />
                    My Preferences
                </h5>

                {error && (
                    <div className="alert alert-danger py-2 px-3" role="alert">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success py-2 px-3" role="alert">
                        <i className="bi bi-check-circle me-1" />
                        Preferences saved successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    <div className="row g-3">
                        {/* Daily Budget */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                <i className="bi bi-currency-rupee me-1 text-success" />
                                Daily Budget (INR)
                            </label>
                            <input
                                type="number"
                                name="budget"
                                value={form.budget}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g. 300"
                                min="1"
                                max="9999"
                                required
                                disabled={loading}
                            />
                            <div className="form-text">Must be between 1 and 9999 INR.</div>
                        </div>

                        {/* Diet Type */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                <i className="bi bi-egg-fried me-1 text-success" />
                                Diet Type
                            </label>
                            <select
                                name="dietType"
                                value={form.dietType}
                                onChange={handleChange}
                                className="form-select"
                                required
                                disabled={loading}
                            >
                                {DIET_TYPES.map(dt => (
                                    <option key={dt.value} value={dt.value}>{dt.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Calories Target */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                <i className="bi bi-fire me-1 text-success" />
                                Daily Calories Target{' '}
                                <span className="text-muted fw-normal">(optional)</span>
                            </label>
                            <input
                                type="number"
                                name="caloriesTarget"
                                value={form.caloriesTarget}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g. 2000"
                                min="1000"
                                max="5000"
                                disabled={loading}
                            />
                            <div className="form-text">Between 1000 and 5000 kcal if specified.</div>
                        </div>

                        {/* Allergies */}
                        <div className="col-md-6">
                            <label className="form-label fw-semibold">
                                <i className="bi bi-exclamation-triangle me-1 text-success" />
                                Allergies / Avoidances{' '}
                                <span className="text-muted fw-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                name="allergies"
                                value={form.allergies}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="e.g. peanut, dairy, seafood"
                                disabled={loading}
                            />
                            <div className="form-text">Comma-separated, up to 10 items.</div>
                        </div>

                        <div className="col-12">
                            <button
                                type="submit"
                                className="btn btn-success px-4 fw-semibold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                        Saving…
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save me-2" />
                                        Save Preferences
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreferencesForm;
