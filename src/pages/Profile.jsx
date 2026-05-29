import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { updateProfile } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import '../assets/CSS/profile.css';

export default function Profile() {
  const { currentUser } = useAuth();
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser?.uid || 'default'}`);
  const [uploading, setUploading] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    if (currentUser?.photoURL) {
      setPhotoURL(currentUser.photoURL);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!currentUser) return;
      try {
        const q = query(collection(db, 'enrollments'), where('userId', '==', currentUser.uid));
        const querySnapshot = await getDocs(q);
        const coursesMap = new Map();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (!coursesMap.has(data.courseId)) {
            coursesMap.set(data.courseId, { id: doc.id, ...data });
          }
        });
        setEnrolledCourses(Array.from(coursesMap.values()));
      } catch (error) {
        console.error("Error fetching courses: ", error);
      } finally {
        setLoadingCourses(false);
      }
    };
    
    fetchCourses();
  }, [currentUser]);

  const handleGenerateAvatar = async () => {
    if (!currentUser) return;
    setUploading(true);
    
    try {
      // Generate a random seed to get a unique robot avatar
      const randomSeed = Math.random().toString(36).substring(7);
      const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomSeed}`;
      
      await updateProfile(currentUser, { photoURL: url });
      setPhotoURL(url);
      alert('Avatar updated successfully!');
    } catch (error) {
      console.error("Error updating avatar: ", error);
      alert('Failed to update avatar. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (!currentUser) {
    return <div className="profile-page"><div className="profile-container"><h2>Please log in to view your profile.</h2></div></div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        
        <div className="profile-header">
          <h2>My Profile</h2>
        </div>
        
        <div className="profile-content">
          <div className="profile-sidebar">
            <div className="avatar-section">
              <img src={photoURL} alt="Profile" className="profile-avatar" />
              <h3>{currentUser.displayName}</h3>
              <p className="user-email">{currentUser.email}</p>
              
              <div className="upload-section">
                <button onClick={handleGenerateAvatar} disabled={uploading} className="upload-btn">
                  {uploading ? 'Generating...' : 'Generate Random Avatar'}
                </button>
              </div>
            </div>
          </div>
          
          <div className="profile-main">
            <h3>Enrolled Courses</h3>
            {loadingCourses ? (
              <p>Loading courses...</p>
            ) : enrolledCourses.length === 0 ? (
              <p className="no-courses">You haven't enrolled in any courses yet.</p>
            ) : (
              <div className="enrolled-grid">
                {enrolledCourses.map(course => (
                  <div key={course.id} className="enrolled-card">
                    <div className="enrolled-card-header">
                      <h4>{course.courseTitle}</h4>
                      <span className="enrolled-date">
                        {new Date(course.enrolledAt?.toDate()).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="enrolled-card-body">
                      <p>Level: <span style={{color: '#ffd700'}}>{course.level}</span></p>
                      <button className="continue-btn" onClick={() => window.location.href = `/courses/${course.courseId}`}>Continue Learning</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
