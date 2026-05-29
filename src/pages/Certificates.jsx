import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/CSS/style.css';

export default function Certificates() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchCertificates = async () => {
      try {
        const q = query(
          collection(db, 'quizResults'),
          where('userId', '==', currentUser.uid)
        );
        const snapshot = await getDocs(q);
        
        // Filter out only perfect scores to become certificates
        const earnedCerts = [];
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          // We know standard length is 3 for our mock quizzes
          // If score is >= total questions, it's a perfect score
          if (data.score >= data.totalQuestions && data.totalQuestions > 0) {
            // Check if we already have this course cert to avoid duplicates
            if (!earnedCerts.find(c => c.quizId === data.quizId)) {
              earnedCerts.push({
                id: doc.id,
                quizId: data.quizId,
                title: data.quizTitle,
                completedAt: data.completedAt?.toDate() || new Date()
              });
            }
          }
        });
        
        setCertificates(earnedCerts);
      } catch (error) {
        console.error("Error fetching certificates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [currentUser, navigate]);

  if (loading) {
    return <div className="loading-screen" style={{padding: '100px', color: 'white', textAlign: 'center'}}><h2>Loading Certificates...</h2></div>;
  }

  return (
    <section className="courses-section">
      <div className="section-header">
        <h2 className="section-title">Your <span className="highlight">Certificates</span></h2>
        <p className="section-subtitle">View and download your earned course certificates</p>
      </div>

      <div className="courses-container" style={{ minHeight: '50vh', padding: '0 20px' }}>
        {certificates.length === 0 ? (
          <div className="empty-state" style={{ textAlign: 'center', marginTop: '50px', color: '#aaa' }}>
            <i className="fas fa-certificate" style={{ fontSize: '4rem', color: '#333', marginBottom: '20px' }}></i>
            <h2>No Certificates Yet</h2>
            <p style={{ maxWidth: '400px', margin: '20px auto' }}>
              You haven't earned any certificates yet. Complete a course and score 100% on its quiz to earn one!
            </p>
            <Link to="/quizzes" className="auth-btn">Take a Quiz</Link>
          </div>
        ) : (
          <div className="quiz-cards">
            {certificates.map((cert) => (
              <div className="quiz-card" key={cert.id}>
                <div className="quiz-icon" style={{ background: 'linear-gradient(45deg, #ffd700, #ff8c00)' }}>
                  <i className="fas fa-certificate"></i>
                </div>
                <h3 className="quiz-title">{cert.title}</h3>
                <div className="quiz-stats">
                  <span><i className="fas fa-calendar"></i> {cert.completedAt.toLocaleDateString()}</span>
                  <span style={{ color: '#4CAF50' }}><i className="fas fa-check-circle"></i> 100% Score</span>
                </div>
                <Link to={`/certificates/${cert.quizId}`} className="quiz-btn" style={{ background: '#ffd700', color: '#0b0220' }}>
                  View Certificate <i className="fas fa-arrow-right"></i>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
