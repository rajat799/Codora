import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { PlayCircle, CheckCircle } from 'lucide-react';
import '../assets/CSS/courseView.css';

// Sample extended data that would normally come from a database
const detailedCourseData = {
  html: {
    id: 'html',
    title: 'HTML Fundamentals',
    description: 'Master the building blocks of web development with this comprehensive HTML course.',
    lessons: [
      { id: 'l1', title: '1. Introduction to HTML', youtubeId: '1JYo6aqZF08', duration: '05:00' },
      { id: 'l2', title: '2. HTML Elements and Tags', youtubeId: 'DxhXFpsN5I4', duration: '12:45' },
      { id: 'l3', title: '3. HTML Forms', youtubeId: 'fNcJuPIZ2WE', duration: '15:20' }
    ]
  },
  css: {
    id: 'css',
    title: 'CSS Styling Masterclass',
    description: 'Learn how to make beautiful websites with CSS.',
    lessons: [
      { id: 'l1', title: '1. CSS Basics', youtubeId: '2hjwlHcWBSk', duration: '05:00' },
      { id: 'l2', title: '2. CSS Selectors', youtubeId: 'l1mER1bV0N0', duration: '12:30' },
      { id: 'l3', title: '3. Flexbox Layout', youtubeId: 'JJSoEo8JSnc', duration: '18:20' }
    ]
  },
  javascript: {
    id: 'javascript',
    title: 'JavaScript Programming',
    description: 'Learn the language of the web with our JavaScript course.',
    lessons: [
      { id: 'l1', title: '1. JavaScript Basics', youtubeId: 'wUr3UOzsuLk', duration: '05:00' },
      { id: 'l2', title: '2. Functions & Scope', youtubeId: 'N8ap4k_1QEQ', duration: '15:45' },
      { id: 'l3', title: '3. DOM Manipulation', youtubeId: '0ik6X4DJKCc', duration: '20:15' }
    ]
  },
  python: {
    id: 'python',
    title: 'Python for Beginners',
    description: 'Learn Python programming from scratch with practical examples.',
    lessons: [
      { id: 'l1', title: '1. Python Basics', youtubeId: 'rfscVS0vtbw', duration: '15:00' },
      { id: 'l2', title: '2. Functions & Modules', youtubeId: '9Os0o3wzS_I', duration: '18:20' },
      { id: 'l3', title: '3. OOP in Python', youtubeId: 'Ej_02ICOIgs', duration: '22:10' }
    ]
  },
  c: {
    id: 'c',
    title: 'C Programming',
    description: 'Master the fundamentals of C programming language.',
    lessons: [
      { id: 'l1', title: '1. Introduction to C', youtubeId: 'KJgsSFOSQv0', duration: '12:00' },
      { id: 'l2', title: '2. Pointers', youtubeId: 'zuegQmMdy8M', duration: '20:45' },
      { id: 'l3', title: '3. Structures', youtubeId: 'VMFKz7Klx7I', duration: '15:30' }
    ]
  },
  cpp: {
    id: 'cpp',
    title: 'C++ and OOP',
    description: 'Learn object-oriented programming with C++.',
    lessons: [
      { id: 'l1', title: '1. C++ Basics', youtubeId: 'R2TJ-gXA8dA', duration: '05:00' },
      { id: 'l2', title: '2. Variables in CPP', youtubeId: 'ts0at8y05EU', duration: '05:00' },
      { id: 'l3', title: '3. STL Containers', youtubeId: 'LyGlTmaWEPs', duration: '19:45' }
    ]
  }
};

export default function CourseView() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const course = detailedCourseData[id];
  
  const [currentLesson, setCurrentLesson] = useState(course?.lessons[0] || null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [enrollmentId, setEnrollmentId] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser || !course) return;
      try {
        const q = query(
          collection(db, 'enrollments'), 
          where('userId', '==', currentUser.uid),
          where('courseId', '==', course.id)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const enrollmentDoc = snapshot.docs[0];
          setEnrollmentId(enrollmentDoc.id);
          const data = enrollmentDoc.data();
          if (data.completedLessons) {
            setCompletedLessons(data.completedLessons);
          }
        }
      } catch (error) {
        console.error("Error fetching progress:", error);
      }
    };
    fetchProgress();
  }, [currentUser, course]);

  if (!course) {
    return (
      <div className="course-view-error">
        <h2>Course Not Found</h2>
        <button onClick={() => navigate('/courses')} className="auth-btn">Back to Courses</button>
      </div>
    );
  }

  const markComplete = async () => {
    if (!completedLessons.includes(currentLesson.id)) {
      const newCompleted = [...completedLessons, currentLesson.id];
      setCompletedLessons(newCompleted);
      
      if (enrollmentId) {
        try {
          await updateDoc(doc(db, 'enrollments', enrollmentId), {
            completedLessons: newCompleted
          });
        } catch (error) {
          console.error("Error updating progress:", error);
        }
      }
    }
  };

  const isAllComplete = completedLessons.length === course.lessons.length;

  return (
    <div className="course-view-page">
      <div className="course-view-container">
        
        <div className="course-main">
          <div className="video-wrapper">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${currentLesson.youtubeId}?rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
          
          <div className="course-info">
            <h2>{course.title}</h2>
            <p className="lesson-title-display">{currentLesson.title}</p>
            <div className="course-description">
              <h3>About this course</h3>
              <p>{course.description}</p>
            </div>
          </div>
        </div>
        
        <div className="course-sidebar">
          <div className="sidebar-header">
            <h3>Course Content</h3>
            <p className="progress-text">{completedLessons.length} / {course.lessons.length} Completed</p>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${(completedLessons.length / course.lessons.length) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="lesson-list">
            {course.lessons.map((lesson) => {
              const isCompleted = completedLessons.includes(lesson.id);
              const isActive = currentLesson.id === lesson.id;
              
              return (
                <div 
                  key={lesson.id} 
                  className={`lesson-item ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentLesson(lesson)}
                >
                  <div className="lesson-icon">
                    {isCompleted ? <CheckCircle size={20} color="#4CAF50" /> : <PlayCircle size={20} color={isActive ? "#ffd700" : "#aaa"} />}
                  </div>
                  <div className="lesson-details">
                    <h4>{lesson.title}</h4>
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="sidebar-actions">
            <button 
              className={`mark-complete-btn ${completedLessons.includes(currentLesson.id) ? 'completed' : ''}`}
              onClick={markComplete}
              disabled={completedLessons.includes(currentLesson.id)}
            >
              {completedLessons.includes(currentLesson.id) ? 'Completed' : 'Mark as Complete'}
            </button>
            
            {isAllComplete && (
              <Link to="/quizzes" className="take-quiz-btn">
                Take Course Quiz
              </Link>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
