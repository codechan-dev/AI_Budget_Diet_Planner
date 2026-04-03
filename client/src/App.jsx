import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import DietPlanner from './components/DietPlanner'
import ParticalBG from './components/ParticalBG'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function AuthBar() {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="position-fixed top-0 end-0 m-3 d-flex align-items-center gap-2"
        style={{ zIndex: 1040 }}
      >
        {user ? (
          <>
            <span className="badge rounded-pill px-3 py-2 fw-semibold"
              style={{ background: 'rgba(255,255,255,0.25)', color: '#0f172a', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.4)' }}>
              <i className="bi bi-person-check me-1" />
              {user.name}
            </span>
            <button
              className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-success rounded-pill px-3 fw-semibold">
              Register
            </Link>
            <button
              className="btn btn-sm btn-link text-success fw-semibold p-0 ms-1"
              onClick={() => setShowModal(true)}
              title="Quick login"
            >
              <i className="bi bi-person" />
            </button>
          </>
        )}
      </div>

      <AuthModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

function HomePage() {
  // Disable hover effects on touch devices to avoid sticky :hover
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('no-hover');
  }
  return (
    <div className=''>
      <ParticalBG />
      <AuthBar />
      <DietPlanner />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
