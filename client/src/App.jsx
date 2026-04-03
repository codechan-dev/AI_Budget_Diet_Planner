import { useState } from 'react'
import './App.css'
import DietPlanner from './components/DietPlanner'
import ParticalBG from './components/ParticalBG'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthModal from './components/AuthModal'

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
          <button
            className="btn btn-sm btn-success rounded-pill px-3 fw-semibold"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-person me-1" />
            Login / Register
          </button>
        )}
      </div>

      <AuthModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

function App() {
  // Disable hover effects on touch devices to avoid sticky :hover
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    document.documentElement.classList.add('no-hover');
  }
  return (
    <AuthProvider>
      <div className=''>
        <ParticalBG />
        <AuthBar />
        <DietPlanner />
      </div>
    </AuthProvider>
  )
}

export default App
