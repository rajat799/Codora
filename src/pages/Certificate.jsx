import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../assets/CSS/certificate.css';

export default function Certificate() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const certificateRef = useRef(null);
  
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Generate a random stable-ish cert ID based on user UID and quiz ID
  const generateCertId = () => {
    const hash1 = currentUser.uid.substring(0, 4).toUpperCase();
    const hash2 = id.substring(0, 3).toUpperCase();
    const hash3 = Math.floor(Math.random() * 9000 + 1000);
    return `COD-${hash1}-${hash2}-${hash3}`;
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const verifyCertificate = async () => {
      try {
        const q = query(
          collection(db, 'quizResults'),
          where('userId', '==', currentUser.uid),
          where('quizId', '==', id)
        );
        const snapshot = await getDocs(q);
        
        let foundPerfect = false;
        
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.score >= data.totalQuestions && data.totalQuestions > 0) {
            foundPerfect = true;
            setCertData({
              studentName: currentUser.displayName || 'Student',
              courseName: data.quizTitle.replace(' Quiz', ''), // Clean up title
              date: data.completedAt?.toDate().toLocaleDateString() || new Date().toLocaleDateString(),
              score: '100%',
              certId: generateCertId()
            });
          }
        });
        
        if (!foundPerfect) {
          setError("You haven't achieved a perfect score on this quiz yet!");
        }
      } catch (err) {
        console.error("Error verifying certificate:", err);
        setError("Failed to load certificate data.");
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [currentUser, id, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div style={{padding: '100px', color: 'white', textAlign: 'center'}}><h2>Loading Certificate...</h2></div>;
  }

  if (error) {
    return (
      <div style={{padding: '100px', color: 'white', textAlign: 'center'}}>
        <h2>Access Denied</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/quizzes')} className="auth-btn" style={{marginTop: '20px'}}>Back to Quizzes</button>
      </div>
    );
  }

  return (
    <div className="certificate-page-wrapper">
      <div className="certificate-container">
        <div className="certificate" ref={certificateRef}>
          <div className="seal">
            <i className="fas fa-award"></i>
          </div>
          
          <div className="certificate-content">
            <div className="cert-header">
              <div className="cert-logo">Codora</div>
              <div className="cert-title">Certificate of Achievement</div>
              <div className="cert-subtitle">This certificate is proudly presented to</div>
            </div>
            
            <div className="awarded-to">
              <div className="cert-name">{certData.studentName}</div>
              <div className="cert-for">for successfully completing the course</div>
              <div className="cert-course-name">{certData.courseName}</div>
              <div className="cert-for">with a perfect score</div>
            </div>
            
            <div className="cert-details">
              <div className="detail-item">
                <div className="detail-label">Date Awarded</div>
                <div className="detail-value">{certData.date}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Quiz Score</div>
                <div className="detail-value" style={{color: '#4CAF50'}}>{certData.score}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Certificate ID</div>
                <div className="detail-value">{certData.certId}</div>
              </div>
            </div>
            
            <div className="signatures">
              <div className="signature">
                <div className="signature-line"></div>
                <div className="detail-label">Instructor</div>
                <div className="detail-value">Sarah Johnson</div>
              </div>
              <div className="signature">
                <div className="signature-line"></div>
                <div className="detail-label">Codora Team</div>
                <div className="detail-value">Alex Smith</div>
              </div>
            </div>
            
            <div className="cert-footer">
              This certificate verifies that the above individual has demonstrated mastery of the course material.
            </div>
          </div>
        </div>
        
        <div className="cert-actions">
          <button className="cert-btn primary" onClick={handlePrint}>
            <i className="fas fa-print"></i> Print Certificate
          </button>
          <button className="cert-btn secondary" onClick={() => navigate('/certificates')}>
            <i className="fas fa-arrow-left"></i> Back to Certificates
          </button>
        </div>
      </div>
    </div>
  );
}
