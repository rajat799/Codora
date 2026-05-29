import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [typingText, setTypingText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fullText = "Code Beyond Your Limits";

  useEffect(() => {
    let i = 0;
    let timer;
    const typing = () => {
      if (i <= fullText.length) {
        setTypingText(fullText.substring(0, i));
        i++;
        timer = setTimeout(typing, 80);
      }
    };
    typing();
    return () => clearTimeout(timer);
  }, []);

  const courses = [
    { id: 1, title: 'HTML Fundamentals', img: '/images/html_img.png', lessons: 12, hours: 4, level: 'Beginner' },
    { id: 2, title: 'CSS Fundamentals', img: '/images/css_img.png', lessons: 12, hours: 4, level: 'Beginner' },
    { id: 3, title: 'JavaScript Fundamentals', img: '/images/javascript_img.png', lessons: 12, hours: 4, level: 'Advanced' },
    { id: 4, title: 'Python Fundamentals', img: '/images/python_img.png', lessons: 12, hours: 4, level: 'Beginner' },
    { id: 5, title: 'C Fundamentals', img: '/images/c_img.png', lessons: 12, hours: 4, level: 'Beginner' },
    { id: 6, title: 'C++ Fundamentals', img: '/images/cpp_img.png', lessons: 12, hours: 4, level: 'Advanced' }
  ];

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <h1><span className="typing-text">{typingText}</span><span className="cursor">|</span></h1>
          <p>Learn. Practice. Build. Get Rewarded.</p>
          <div className="hero-search">
            <input 
              type="text" 
              id="search-input" 
              placeholder="Search for courses, topics, or tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button id="search-btn"><i className="fas fa-search"></i></button>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses">
        <h2 className="section-heading">Our Courses</h2>
        <div className="course-grid">
          {filteredCourses.map(course => (
            <div className="course-card" key={course.id}>
              <img src={course.img} alt={course.title} className="course-thumbnail" />
              <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <div className="course-stats">
                      <span><i className="fas fa-book-open"></i> {course.lessons} Lessons</span>
                      <span><i className="fas fa-clock"></i> {course.hours} Hours</span>
                  </div>
                  <div className="course-level">
                      <span className="level-label">Level:</span>
                      <span className={`level-value ${course.level.toLowerCase()}`}>{course.level}</span>
                  </div>
                  <Link to="/courses" className="course-btn">Start Learning <i className="fas fa-arrow-right"></i></Link>
              </div>
            </div>
          ))}
        </div>

        <div className="view-all-container">
            <Link to="/courses" className="view-all-btn">View All Courses <i className="fas fa-chevron-right"></i></Link>
        </div>
      </section>

      {/* Quizzes Section */}
      <section className="quizzes-section">
        <div className="container">
          <h2 className="section-title">Challenge Yourself</h2>
          <p className="section-subtitle">Test your knowledge with our interactive quizzes</p>
          
          <div className="quiz-cards">
            <div className="quiz-card">
              <div className="quiz-badge">Popular</div>
              <div className="quiz-icon html-icon">
                <i className="fab fa-html5"></i>
              </div>
              <h3 className="quiz-title">HTML Mastery</h3>
              <div className="quiz-stats">
                <span><i className="fas fa-question-circle"></i> 20 Questions</span>
                <span><i className="fas fa-clock"></i> 15 mins</span>
              </div>
              <div className="quiz-difficulty">
                <span className="difficulty-label">Difficulty:</span>
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="far fa-star"></i>
                  <i className="far fa-star"></i>
                </div>
              </div>
              <Link to="/quizzes" className="quiz-btn">Start Quiz <i className="fas fa-arrow-right"></i></Link>
            </div>
            
            <div className="quiz-card">
              <div className="quiz-badge">New</div>
              <div className="quiz-icon css-icon">
                <i className="fab fa-css3-alt"></i>
              </div>
              <h3 className="quiz-title">CSS Challenge</h3>
              <div className="quiz-stats">
                <span><i className="fas fa-question-circle"></i> 25 Questions</span>
                <span><i className="fas fa-clock"></i> 20 mins</span>
              </div>
              <div className="quiz-difficulty">
                <span className="difficulty-label">Difficulty:</span>
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="far fa-star"></i>
                </div>
              </div>
              <Link to="/quizzes" className="quiz-btn">Start Quiz <i className="fas fa-arrow-right"></i></Link>
            </div>
            
            <div className="quiz-card">
              <div className="quiz-icon js-icon">
                <i className="fab fa-js"></i>
              </div>
              <h3 className="quiz-title">JavaScript Expert</h3>
              <div className="quiz-stats">
                <span><i className="fas fa-question-circle"></i> 30 Questions</span>
                <span><i className="fas fa-clock"></i> 25 mins</span>
              </div>
              <div className="quiz-difficulty">
                <span className="difficulty-label">Difficulty:</span>
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <Link to="/quizzes" className="quiz-btn">Start Quiz <i className="fas fa-arrow-right"></i></Link>
            </div>
          </div>
          
          <div className="view-all-container">
            <Link to="/quizzes" className="view-all-btn">Browse All Quizzes <i className="fas fa-chevron-right"></i></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
