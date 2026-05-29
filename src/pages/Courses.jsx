import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const courseData = [
  { id: "html", title: "HTML Fundamentals", lessons: 12, duration: "4 Hours", level: "beginner", category: "html", thumbnail: "/images/html_img.png" },
  { id: "css", title: "CSS Styling", lessons: 10, duration: "8 Hours", level: "beginner", category: "css", thumbnail: "/images/css_img.png" },
  { id: "javascript", title: "JavaScript Programming", lessons: 8, duration: "5 Hours", level: "intermediate", category: "js", thumbnail: "/images/javascript_img.png" },
  { id: "python", title: "Python Programming", lessons: 15, duration: "8 Hours", level: "beginner", category: "python", thumbnail: "/images/python_img.png" },
  { id: "c", title: "C Fundamentals", lessons: 5, duration: "3 Hours", level: "beginner", category: "c", thumbnail: "/images/c_img.png" },
  { id: "cpp", title: "C++ and OOP", lessons: 7, duration: "5 Hours", level: "advanced", category: "cpp", thumbnail: "/images/cpp_img.png" }
];

export default function Courses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [enrolling, setEnrolling] = useState(null);
  
  const coursesPerPage = 6;
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = async (course) => {
    if (!currentUser) {
      alert("Please log in to enroll in a course!");
      navigate('/login');
      return;
    }
    
    setEnrolling(course.id);
    
    try {
      // Check if already enrolled
      const q = query(
        collection(db, 'enrollments'), 
        where('userId', '==', currentUser.uid),
        where('courseId', '==', course.id)
      );
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        await addDoc(collection(db, 'enrollments'), {
          userId: currentUser.uid,
          courseId: course.id,
          courseTitle: course.title,
          level: course.level,
          enrolledAt: serverTimestamp()
        });
      }
      
      // Navigate straight to the course player!
      navigate(`/courses/${course.id}`);
    } catch (error) {
      console.error("Error enrolling in course: ", error);
      alert("Failed to enroll. Please try again.");
    } finally {
      setEnrolling(null);
    }
  };

  const filteredCourses = courseData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'all' || course.category === category;
    const matchesLevel = level === 'all' || course.level === level;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage) || 1;
  const startIndex = (currentPage - 1) * coursesPerPage;
  const currentCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);

  const getCategoryIcon = (cat) => {
    const icons = { html: 'html5', css: 'css3-alt', js: 'js', python: 'python', c: 'code', cpp: 'code' };
    return icons[cat] || 'code';
  };

  const formatLevel = (lvl) => {
    const levels = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
    return levels[lvl] || lvl;
  };

  return (
    <main>
      <section className="all-courses">
        <div className="container">
          <h1 className="page-title">All Courses</h1>
          <div className="course-filters">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
              <button><i className="fas fa-search"></i></button>
            </div>
            <div className="filter-options">
              <select value={category} onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Categories</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="js">JavaScript</option>
                <option value="python">Python</option>
                <option value="c">C Programming</option>
                <option value="cpp">C++</option>
              </select>
              <select value={level} onChange={(e) => { setLevel(e.target.value); setCurrentPage(1); }}>
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="course-grid">
            {currentCourses.length === 0 ? (
              <p className="no-results">No courses found matching your criteria.</p>
            ) : (
              currentCourses.map(course => (
                <div className="course-card" key={course.id}>
                  <img src={course.thumbnail} alt={course.title} className="course-thumbnail" />
                  <div className="course-content">
                    <div className={`course-icon ${course.category}-icon`}>
                      <i className={`fab fa-${getCategoryIcon(course.category)}`}></i>
                    </div>
                    <h3 className="course-title">{course.title}</h3>
                    <div className="course-stats">
                      <span><i className="fas fa-book-open"></i> {course.lessons} Lessons</span>
                      <span><i className="fas fa-clock"></i> {course.duration}</span>
                    </div>
                    <div className="course-level">
                      <span className="level-label">Level:</span>
                      <span className={`level-value ${course.level}`}>{formatLevel(course.level)}</span>
                    </div>
                    <button 
                      onClick={() => handleEnroll(course)} 
                      disabled={enrolling === course.id}
                      className="course-btn"
                      style={{ border: 'none', width: '100%', cursor: 'pointer' }}
                    >
                      {enrolling === course.id ? 'Enrolling...' : 'Enroll Now'} <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pagination">
            <button 
              className="pagination-btn" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="page-numbers">{currentPage} of {totalPages}</span>
            <button 
              className="pagination-btn" 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
