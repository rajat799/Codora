import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import '../assets/CSS/quizView.css';

// Sample quiz data that would normally come from a database
const allQuizzes = {
  html: {
    id: 'html',
    title: "HTML Fundamentals Quiz",
    description: "Test your HTML knowledge after completing the course",
    questions: [
      {
        question: "What does HTML stand for?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyper Transfer Markup Language"],
        answer: 0,
        explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
      },
      {
        question: "Which HTML element is used for the largest heading?",
        options: ["heading", "h1", "head", "h6"],
        answer: 1,
        explanation: "The <h1> element is used for the most important heading (largest size) in HTML."
      },
      {
        question: "What is the correct HTML element for inserting a line break?",
        options: ["break", "lb", "br", "newline"],
        answer: 2,
        explanation: "The <br> tag inserts a single line break in HTML."
      }
    ]
  },
  css: {
    id: 'css',
    title: "CSS Styling Quiz",
    description: "Test your CSS knowledge after completing the course",
    questions: [
      {
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Creative Style Sheets", "Cascading Style Sheets", "Colorful Style Sheets"],
        answer: 2,
        explanation: "CSS stands for Cascading Style Sheets, used for styling web pages."
      },
      {
        question: "Which CSS property controls the text size?",
        options: ["font-style", "text-size", "font-size", "text-style"],
        answer: 2,
        explanation: "The font-size property sets the size of the text."
      },
      {
        question: "How do you select an element with id 'header'?",
        options: [".header", "#header", "*header", "header"],
        answer: 1,
        explanation: "The # symbol is used to select elements by their id attribute."
      }
    ]
  },
  javascript: {
    id: 'javascript',
    title: "JavaScript Fundamentals Quiz",
    description: "Test your JavaScript knowledge after completing the course",
    questions: [
      {
        question: "Which of the following is NOT a JavaScript data type?",
        options: ["Number", "String", "Boolean", "Character"],
        answer: 3,
        explanation: "JavaScript doesn't have a Character type - it uses Strings for single characters."
      },
      {
        question: "What does the '===' operator do in JavaScript?",
        options: ["Assigns a value", "Compares value and type", "Compares only value", "Checks for inequality"],
        answer: 1,
        explanation: "The '===' operator is the strict equality operator that compares both value and type."
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        answer: 0,
        explanation: "The push() method adds one or more elements to the end of an array."
      }
    ]
  },
  python: {
    id: 'python',
    title: "Python for Beginners Quiz",
    description: "Test your Python knowledge after completing the course",
    questions: [
      {
        question: "How do you create a variable with the numeric value 5?",
        options: ["x = 5", "x = int(5)", "Both of the above", "int x = 5"],
        answer: 2,
        explanation: "In Python, x = 5 and x = int(5) both create a variable with the numeric value 5."
      },
      {
        question: "What is the correct file extension for Python files?",
        options: [".pyt", ".py", ".pt", ".python"],
        answer: 1,
        explanation: "Python files are saved with the .py extension."
      },
      {
        question: "How do you insert comments in Python code?",
        options: ["/* This is a comment */", "// This is a comment", "# This is a comment", "<!-- This is a comment -->"],
        answer: 2,
        explanation: "Python uses the # symbol for single-line comments."
      }
    ]
  },
  c: {
    id: 'c',
    title: "C Programming Quiz",
    description: "Test your C knowledge after completing the course",
    questions: [
      {
        question: "Which of the following is the correct syntax to print a message in C?",
        options: ["echo \"Hello World\";", "printf(\"Hello World\");", "console.log(\"Hello World\");", "print(\"Hello World\");"],
        answer: 1,
        explanation: "In C, printf() is the standard function used to print output to the screen."
      },
      {
        question: "How do you create a variable with the numeric value 5 in C?",
        options: ["x = 5;", "int x = 5;", "val x = 5;", "num x = 5;"],
        answer: 1,
        explanation: "In C, you must specify the data type (int) before the variable name."
      },
      {
        question: "What is the format specifier for printing an integer?",
        options: ["%f", "%s", "%c", "%d"],
        answer: 3,
        explanation: "%d (or %i) is used as a format specifier for integers in C."
      }
    ]
  },
  cpp: {
    id: 'cpp',
    title: "C++ and OOP Quiz",
    description: "Test your C++ knowledge after completing the course",
    questions: [
      {
        question: "Which feature of OOP indicates code reusability?",
        options: ["Encapsulation", "Inheritance", "Polymorphism", "Abstraction"],
        answer: 1,
        explanation: "Inheritance allows a new class to inherit properties from an existing class, promoting code reusability."
      },
      {
        question: "What does 'cin' do in C++?",
        options: ["Prints output", "Takes input", "Declares a class", "Terminates the program"],
        answer: 1,
        explanation: "cin is the standard input stream object in C++ used for taking input from the user."
      },
      {
        question: "Which access specifier makes members accessible only from within the class?",
        options: ["public", "protected", "private", "internal"],
        answer: 2,
        explanation: "Private members can only be accessed by functions inside the class."
      }
    ]
  }
};

export default function QuizView() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const quiz = allQuizzes[id];
  
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!quiz) {
    return (
      <div className="quiz-view-error">
        <h2>Quiz Not Found</h2>
        <button onClick={() => navigate('/quizzes')} className="auth-btn">Back to Quizzes</button>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIdx];

  const handleOptionSelect = (index) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    setIsAnswerSubmitted(true);
    
    if (selectedOption === currentQuestion.answer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIdx < quiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      await saveQuizResult();
    }
  };

  const saveQuizResult = async () => {
    if (!currentUser) return;
    setSavingResult(true);
    try {
      await addDoc(collection(db, 'quizResults'), {
        userId: currentUser.uid,
        quizId: quiz.id,
        quizTitle: quiz.title,
        score: score,
        totalQuestions: quiz.questions.length,
        completedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error saving quiz result:", error);
    } finally {
      setSavingResult(false);
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const isPerfect = score === quiz.questions.length;
    
    return (
      <div className="quiz-view-page">
        <div className="quiz-container">
          <div className="quiz-result-card">
            <h2>Quiz Completed!</h2>
            <div className="quiz-score-display">
              <span className="score-number">{percentage}%</span>
            </div>
            <p>You answered {score} out of {quiz.questions.length} questions correctly.</p>
            
            {isPerfect && (
              <div className="certificate-earned-msg" style={{ marginBottom: '20px', color: '#4CAF50', fontWeight: 'bold' }}>
                🎉 Congratulations! You scored 100% and earned a certificate! 🎉
              </div>
            )}
            
            <div className="result-actions">
              <Link to="/quizzes" className="result-btn secondary">Back to Quizzes</Link>
              {isPerfect ? (
                <Link to={`/certificates/${quiz.id}`} className="result-btn primary" style={{ backgroundColor: '#4CAF50', color: 'white' }}>Claim Certificate</Link>
              ) : (
                <Link to={`/courses/${quiz.id}`} className="result-btn primary">Review Course</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = ((currentQuestionIdx + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-view-page">
      <div className="quiz-container">
        
        <div className="quiz-main">
          <div className="quiz-header">
            <h1>{quiz.title}</h1>
            <p>Question {currentQuestionIdx + 1} of {quiz.questions.length}</p>
            <div className="quiz-progress-bar-bg">
              <div className="quiz-progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          
          <div className="question-container">
            <h3 className="question-text">{currentQuestion.question}</h3>
            
            <div className="options-container">
              {currentQuestion.options.map((option, index) => {
                let optionClass = "option-item";
                if (selectedOption === index) optionClass += " selected";
                if (isAnswerSubmitted) {
                  if (index === currentQuestion.answer) optionClass += " option-correct";
                  else if (selectedOption === index) optionClass += " option-incorrect";
                }
                
                return (
                  <div 
                    key={index} 
                    className={optionClass}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className="option-radio">
                      {selectedOption === index && <div className="radio-dot"></div>}
                    </div>
                    <span>{option}</span>
                  </div>
                );
              })}
            </div>
            
            {isAnswerSubmitted && (
              <div className="explanation-box">
                <h4>{selectedOption === currentQuestion.answer ? "Correct!" : "Incorrect."}</h4>
                <p>{currentQuestion.explanation}</p>
              </div>
            )}
          </div>
          
          <div className="quiz-navigation">
            {!isAnswerSubmitted ? (
              <button 
                className="quiz-action-btn submit-btn" 
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
              >
                Submit Answer
              </button>
            ) : (
              <button 
                className="quiz-action-btn next-btn" 
                onClick={handleNextQuestion}
              >
                {currentQuestionIdx === quiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </button>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
