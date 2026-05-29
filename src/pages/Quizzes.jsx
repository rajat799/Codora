import React from 'react';
import { Link } from 'react-router-dom';

export default function Quizzes() {
  return (
    <main>
      <section className="quizzes-section" style={{ minHeight: '60vh' }}>
        <div className="container">
          <h2 className="section-title">All Quizzes</h2>
          <p className="section-subtitle">Test your knowledge with our interactive quizzes</p>
          
          <div className="quiz-cards">
            {[
              { id: 'html', title: 'HTML Fundamentals', questions: 3, time: '5 mins' },
              { id: 'css', title: 'CSS Styling', questions: 3, time: '5 mins' },
              { id: 'javascript', title: 'JavaScript Fundamentals', questions: 3, time: '5 mins' },
              { id: 'python', title: 'Python for Beginners', questions: 3, time: '5 mins' },
              { id: 'c', title: 'C Programming', questions: 3, time: '5 mins' },
              { id: 'cpp', title: 'C++ and OOP', questions: 3, time: '5 mins' }
            ].map((quiz, i) => (
              <div className="quiz-card" key={i}>
                <div className="quiz-icon html-icon">
                  <i className="fas fa-question"></i>
                </div>
                <h3 className="quiz-title">{quiz.title}</h3>
                <div className="quiz-stats">
                  <span><i className="fas fa-question-circle"></i> {quiz.questions} Questions</span>
                  <span><i className="fas fa-clock"></i> {quiz.time}</span>
                </div>
                <Link to={`/quizzes/${quiz.id}`} className="quiz-btn">Start Quiz <i className="fas fa-arrow-right"></i></Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
