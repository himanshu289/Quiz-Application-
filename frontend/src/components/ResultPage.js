import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [score, setScore] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (location.state) {
      const { score, totalQuestions, username } = location.state;

      localStorage.setItem("quizScore", score);
      localStorage.setItem("totalQuestions", totalQuestions);
      localStorage.setItem("quizUsername", username);

      setScore(score);
      setTotalQuestions(totalQuestions);
      setUsername(username);
    } else {
      const savedScore = localStorage.getItem("quizScore");
      const savedTotalQuestions = localStorage.getItem("totalQuestions");
      const savedUsername = localStorage.getItem("quizUsername");

      if (savedScore && savedTotalQuestions && savedUsername) {
        setScore(savedScore);
        setTotalQuestions(savedTotalQuestions);
        setUsername(savedUsername);
      }
    }

    window.history.pushState(null, null, window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState(null, null, window.location.href);
    });
  }, [location.state]);

  const handleBackToHome = () => {
    localStorage.removeItem("quizScore");
    localStorage.removeItem("totalQuestions");
    localStorage.removeItem("quizUsername");
    navigate("/browse");
  };

  if (score === null || totalQuestions === null || username === null) {
    return (
      <div className="bg-gray-900 min-h-screen flex flex-col justify-center items-center text-white">
        <h1 className="text-2xl font-bold mb-4">No Result Available</h1>
        <p className="text-gray-400 mb-6">Please complete a quiz to see the results.</p>
        <button
          onClick={handleBackToHome}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center">
      <div className="max-w-4xl w-full bg-gray-800 text-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-4">Quiz Result</h1>
        <p className="text-gray-400 mb-6">Congratulations, {username}! Here are your results:</p>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">Score: {score} / {totalQuestions}</h2>
        </div>
        <button
          onClick={handleBackToHome}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
