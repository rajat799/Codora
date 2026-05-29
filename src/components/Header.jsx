import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="navbar">
        <div className="logo">
          <Link to="/"><span className="logo1">Codora.</span></Link>
        </div>

        <button className="downArrow" onClick={toggleMenu}>
          <span className="text">menu {menuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
        </button> 

        <div className={`nav-elements ${menuOpen ? 'active' : ''}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/quizzes">Quizzes</Link></li>
            <li><Link to="/certificates">Certificates</Link></li>
            <li><Link to="/contact">Contacts</Link></li>
          </ul>
        </div>

        <div className="auth-buttons" id="auth-buttons">
          {currentUser ? (
            <>
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'white', marginRight: '15px' }}>
                <img 
                  src={currentUser?.photoURL || 'https://via.placeholder.com/30'} 
                  alt="Profile" 
                  style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '10px', objectFit: 'cover' }} 
                />
                <span>Hello, {currentUser?.displayName || currentUser?.email.split('@')[0]}</span>
              </Link>
              <button onClick={logout} className="auth-btn logout-btn">Log Out</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className={`auth-btn login-btn ${location.pathname === '/login' ? 'active' : ''}`}>Login</button></Link>
              <Link to="/signup"><button className={`auth-btn signup-btn ${location.pathname === '/signup' ? 'active' : ''}`}>Sign Up</button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
