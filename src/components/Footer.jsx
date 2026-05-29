import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Codora</h3>
          <p>Learn. Practice. Build. Get Rewarded.</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-facebook-f"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin-in"></i></a>
            <a href="#"><i className="fab fa-github"></i></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/courses">Courses</Link></li>
            <li><Link to="/quizzes">Quizzes</Link></li>
            <li><Link to="#">Projects</Link></li>
            <li><Link to="#">Community</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Courses</h3>
          <ul>
            <li><Link to="/courses">HTML Basics</Link></li>
            <li><Link to="/courses">CSS Fundamentals</Link></li>
            <li><Link to="/courses">JavaScript Essentials</Link></li>
            <li><Link to="/courses">Python for Beginners</Link></li>
            <li><Link to="/courses">C Programming</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul>
            <li><i className="fas fa-envelope"></i> BeyondCode@codora.com</li>
            <li><i className="fas fa-phone"></i> +91 - 8263075985</li>
            <li><i className="fas fa-map-marker-alt"></i> 123 Coding Street, Tech City</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2023 Codora. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookies Policy</a>
        </div>
      </div>
    </footer>
  );
}
