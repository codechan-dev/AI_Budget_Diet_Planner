import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import PreferencesForm from '../components/PreferencesForm';

const formatINR = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);

const MEAL_ICONS = {
    Breakfast: 'bi-cup-hot',
    Lunch: 'bi-basket',
    Dinner: 'bi-moon-stars',
    Snack: 'bi-apple',
};

const DayCard = ({ dayData }) => (
    <div className="card border-0 shadow-sm mb-3">
        <div className="card-header bg-success text-white fw-bold d-flex justify-content-between align-items-center">
            <span><i className="bi bi-calendar3 me-2" />Day {dayData.day}</span>
            <span className="badge bg-white text-success">
                {formatINR(dayData.daily_total_cost_approx)}
            </span>
        </div>
        <ul className="list-group list-group-flush">
            {dayData.meals.map((meal, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between align-items-start py-3">
                    <div>
                        <span className="badge bg-success-subtle text-success-emphasis me-2 rounded-pill">
                            <i className={`bi ${MEAL_ICONS[meal.meal_type] || 'bi-bowl'} me-1`} />
                            {meal.meal_type}
                        </span>
                        <span className="fw-semibold">{meal.dish_name}</span>
                    </div>
                    <div className="text-end text-nowrap ms-3">
                        <span className="text-muted small d-block">{meal.calories_approx} kcal</span>
                        <span className="text-success small fw-semibold">{formatINR(meal.budget_cost_approx)}</span>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

const PlanPage = () => {
    const { user } = useAuth();
    const [plan, setPlan] = useState(null);
    const [generating, setGenerating] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [error, setError] = useState(null);

    if (!user) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning d-inline-block">
                    <i className="bi bi-lock me-2" />
                    Please{' '}
                    <Link to="/login" className="alert-link">log in</Link>
                    {' '}to access the Plan page.
                </div>
            </div>
        );
    }

    const handleGenerate = async () => {
        setError(null);
        setGenerating(true);
        try {
            const { data } = await api.post('/api/plan/generate');
            setPlan(data.plan);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to generate plan.');
        } finally {
            setGenerating(false);
        }
    };

    const handleRegenerate = async () => {
        setError(null);
        setRegenerating(true);
        try {
            const { data } = await api.post('/api/plan/regenerate');
            setPlan(data.plan);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to regenerate plan.');
        } finally {
            setRegenerating(false);
        }
    };

    const isAnyLoading = generating || regenerating;
    const meals = plan ? plan.meals : [];

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
                <div>
                    <Link to="/" className="btn btn-sm btn-outline-secondary rounded-pill me-2">
                        <i className="bi bi-arrow-left me-1" />Back
                    </Link>
                    <h3 className="d-inline fw-bold text-success mb-0">My Diet Plan</h3>
                </div>
                <span className="badge rounded-pill bg-success-subtle text-success-emphasis px-3 py-2 fw-semibold">
                    <i className="bi bi-person-check me-1" />
                    {user.name}
                </span>
            </div>

            {/* Preferences */}
            <PreferencesForm />

            {/* Action buttons */}
            <div className="d-flex gap-3 mb-4 flex-wrap">
                <button
                    className="btn btn-success fw-semibold px-4"
                    onClick={handleGenerate}
                    disabled={isAnyLoading}
                >
                    {generating ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                            Generating…
                        </>
                    ) : (
                        <>
                            <i className="bi bi-stars me-2" />
                            Generate Plan
                        </>
                    )}
                </button>

                {plan && (
                    <button
                        className="btn btn-outline-success fw-semibold px-4"
                        onClick={handleRegenerate}
                        disabled={isAnyLoading}
                    >
                        {regenerating ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                Regenerating…
                            </>
                        ) : (
                            <>
                                <i className="bi bi-arrow-repeat me-2" />
                                Regenerate Plan
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                    <i className="bi bi-exclamation-triangle-fill" />
                    {error}
                </div>
            )}

            {/* Empty state hint */}
            {!plan && !isAnyLoading && !error && (
                <div className="text-center text-muted py-5">
                    <i className="bi bi-calendar-week display-4 d-block mb-3 text-success opacity-50" />
                    <p className="mb-0">Save your preferences above and click <strong>Generate Plan</strong> to get a personalised 7-day meal plan.</p>
                </div>
            )}

            {/* Plan output */}
            {plan && (
                <>
                    <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <h5 className="fw-bold mb-0">
                            <i className="bi bi-list-check me-2 text-success" />
                            7-Day Plan
                        </h5>
                        <span className="badge bg-success fs-6 px-3 py-2">
                            Total: {formatINR(plan.totalCost)}
                        </span>
                    </div>

                    <div className="row g-3">
                        {meals.map((day) => (
                            <div key={day.day} className="col-12 col-lg-6">
                                <DayCard dayData={day} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PlanPage;
