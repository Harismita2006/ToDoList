import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide navbar on login and signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: '#08457e' }}>
      <div className="container-fluid">

        <h2 className="navbar-brand" style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '30px', color: 'white' }}>
          Focus & Finish
        </h2>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/" style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '18px', color: 'white' }}>
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/tasks" style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '18px', color: 'white' }}>
                    Tasks
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add" style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '18px', color: 'white' }}>
                    Add Task
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleLogout}
                    className="nav-link"
                    style={{ 
                      fontWeight: 'bold',
                      fontFamily: 'Arial, sans-serif',
                      fontSize: '18px',
                      color: 'white',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
            {!isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '18px', color: 'white' }}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/signup" style={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif', fontSize: '18px', color: 'white' }}>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
