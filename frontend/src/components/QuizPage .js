import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosinstance";

const QuizPage = () => {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showModal, setShowModal] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  const location = useLocation();
  const user = useSelector((state) => state.app.user);
  const { quiz: quizData } = location.state || {};
  const token = localStorage.getItem("UserToken");
  const navigate = useNavigate();

  useEffect(() => {
    const savedAnswers = JSON.parse(
      localStorage.getItem("quizAnswers") || "{}"
    );
    setAnswers(savedAnswers);

    const fetchQuiz = async () => {
      try {
        const code = window.location.pathname.split("/").pop();
        const response = await axiosInstance.get(`quiz/${code}`);
        if (!response.ok) {
          toast.error("An error occurred while fetching the quiz.");
          return;
        }
        const data = await response.json();
        setQuiz(data.quiz);
      } catch (error) {
        toast.error("An error occurred while fetching the quiz.");
      }
    };

    if (!quizData) {
      fetchQuiz();
    } else {
      setQuiz(quizData);
    }
  }, [quizData, token]);

  useEffect(() => {
    if (quiz && quiz.endDate) {
      const endDateInMs = new Date(quiz.endDate).getTime();

      const intervalId = setInterval(() => {
        const nowInMs = new Date().getTime();
        const remainingTimeInMs = endDateInMs - nowInMs;

        if (remainingTimeInMs <= 0) {
          clearInterval(intervalId);
          setRemainingTime(0);
          toast.error("Time is up! Quiz submission is disabled.");
        } else {
          setRemainingTime(remainingTimeInMs);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [quiz]);

  const handleAnswerChange = (questionId, answer, type) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      if (type === "single" || type === "truefalse") {
        updatedAnswers[questionId] = [answer];
      } else if (type === "multiple") {
        const currentAnswers = prevAnswers[questionId] || [];
        if (currentAnswers.includes(answer)) {
          updatedAnswers[questionId] = currentAnswers.filter(
            (a) => a !== answer
          );
        } else {
          updatedAnswers[questionId] = [...currentAnswers, answer];
        }
      }

      localStorage.setItem("quizAnswers", JSON.stringify(updatedAnswers));
      return updatedAnswers;
    });
  };

  const handleSubmit = async () => {
    if (remainingTime <= 0) {
      toast.error("Time is up! Quiz submission is disabled.");
      return;
    }

    const unansweredQuestions = quiz.questions.filter(
      (question) => !answers[question._id] || answers[question._id].length === 0
    );

    if (unansweredQuestions.length > 0) {
      toast.error("Please answer all questions before submitting.");
      return;
    }

    const score = calculateScore();

    try {
      const response = await axiosInstance.post("quiz/submit", {
        quizId: quiz._id,
        quizCode: quiz.code,
        Creater: quiz.userId,
        userId: user._id,
        username: user.fullName,
        score: score,
      });

      const result = response.data;
      if (result.success) {
        toast.success("Quiz submitted successfully!");
        localStorage.removeItem("quizAnswers"); // Clear local storage after submission
        navigate("/quiz-results", {
          state: {
            score: score,
            username: user.fullName,
            totalQuestions: quiz.questions.length,
          },
        });
      } else {
        toast.error(result.message || "Failed to submit score.");
      }
    } catch (error) {
      toast.error("An error occurred while submitting the score.");
    }
  };

  const calculateScore = () => {
    let score = 0;
    quiz.questions.forEach((question) => {
      const selectedAnswers = answers[question._id] || [];
      const correctAnswers = question.correctAnswers || [];
      if (question.type === "single" || question.type === "truefalse") {
        const selectedAnswerIndex = question.options.findIndex(
          (option) =>
            option.trim().toLowerCase() ===
            (selectedAnswers[0] || "").trim().toLowerCase()
        );
        if (selectedAnswerIndex === correctAnswers[0]) {
          score += 1;
        }
      } else if (question.type === "multiple") {
        const correctAnswerSet = new Set(correctAnswers);
        const selectedAnswerSet = new Set(
          selectedAnswers.map((answer) =>
            question.options.findIndex(
              (option) =>
                option.trim().toLowerCase() === answer.trim().toLowerCase()
            )
          )
        );
        if (
          correctAnswerSet.size === selectedAnswerSet.size &&
          [...correctAnswerSet].every((index) => selectedAnswerSet.has(index))
        ) {
          score += 1;
        }
      }
    });
    return score;
  };

  if (!quiz) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="mx-auto p-6 bg-gray-900 rounded-lg shadow-lg text-justify">
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center text-gray-800">
                  Rules and Regulations
                </h2>
                <p className="mb-4 text-gray-700 text-base sm:text-lg">
                  Please read the following rules and regulations before
                  starting the quiz:
                </p>
                <ul className="list-disc list-inside mb-6 text-gray-600 text-sm sm:text-base space-y-2">
                  <li>Each question has one correct answer.</li>
                  <li>Answer all questions to the best of your ability.</li>
                  <li>No external help is allowed.</li>
                </ul>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setQuizStarted(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full transition duration-200"
                >
                  I Understand
                </button>
              </div>
            </div>
          )}

          {quizStarted && (
            <>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-10 text-center capitalize">
                {quiz.title}
              </h1>
              <hr className="border-gray-500 opacity-70 mb-10" />

              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3">
                Description
              </h2>
              <p className="w-full p-4 text-gray-300 bg-gray-800 border rounded-lg shadow-sm  border-gray-700 mb-10">
                {quiz.description}
              </p>

              <div className="text-center mb-6">
                <p className="text-gray-300 text-lg mb-4">Starts in</p>
                <div className="flex justify-center space-x-4">
                  <div className="bg-gray-800 text-white p-4 rounded-lg">
                    <p className="text-3xl  font-semibold">
                      {Math.floor(remainingTime / (1000 * 60 * 60 * 24))}
                    </p>
                    <p className="text-sm mt-2">day</p>
                  </div>
                  <div className="bg-gray-800 text-white p-4 rounded-lg">
                    <p className="text-3xl font-semibold">
                      {Math.floor(
                        (remainingTime % (1000 * 60 * 60 * 24)) /
                          (1000 * 60 * 60)
                      )}
                    </p>
                    <p className="text-sm mt-2">hrs</p>
                  </div>
                  <div className="bg-gray-800 text-white p-4 rounded-lg">
                    <p className="text-3xl font-semibold">
                      {Math.floor(
                        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
                      )}
                    </p>
                    <p className="text-sm mt-2">mins</p>
                  </div>
                  <div className="bg-gray-800 text-white p-4 rounded-lg">
                    <p className="text-3xl font-semibold">
                      {Math.floor((remainingTime % (1000 * 60)) / 1000)}
                    </p>
                    <p className="text-sm mt-2">secs</p>
                  </div>
                </div>
              </div>

              <hr className="border-gray-500 opacity-70 mb-6" />

              {quiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-lg shadow-md transition-all hover:w-full bg-gray-800 border border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3 text-white break-words">
                      {`${index + 1}. ${question.question}`}
                    </h3>
                    {/* Badge for multiple-answer questions */}
                    {question.type === "multiple" && (
                      <span className="bg-yellow-300 text-gray-800 text-xs font-semibold px-2 py-1 rounded-md">
                        Multiple answers
                      </span>
                    )}
                  </div>

                  <div className="pl-2 sm:pl-4">
                    {question.type === "truefalse" ? (
                      <>
                        <label
                          className={`block mb-3 p-2 cursor-pointer rounded-md transition-all ${
                            answers[question._id]?.includes("true")
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-white" // Set text to white
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value="true"
                            checked={
                              answers[question._id]?.includes("true") || false
                            }
                            onChange={() =>
                              handleAnswerChange(
                                question._id,
                                "true",
                                "truefalse"
                              )
                            }
                            className="hidden"
                          />
                          True
                        </label>
                        <label
                          className={`block mb-3 p-2 cursor-pointer rounded-md transition-all ${
                            answers[question._id]?.includes("false")
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-white" // Set text to white
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value="false"
                            checked={
                              answers[question._id]?.includes("false") || false
                            }
                            onChange={() =>
                              handleAnswerChange(
                                question._id,
                                "false",
                                "truefalse"
                              )
                            }
                            className="hidden"
                          />
                          False
                        </label>
                      </>
                    ) : (
                      question.options.map((option, optionIndex) => (
                        <label
                          key={optionIndex}
                          className={`block mb-3 p-2 cursor-pointer rounded-md transition-all ${
                            answers[question._id]?.includes(option)
                              ? "bg-blue-600 text-white"
                              : "bg-gray-700 hover:bg-gray-600 text-white" // Set text to white
                          }`}
                        >
                          <input
                            type={
                              question.type === "single" ? "radio" : "checkbox"
                            }
                            name={`question-${index}`}
                            value={option}
                            checked={
                              answers[question._id]?.includes(option) || false
                            }
                            onChange={() =>
                              handleAnswerChange(
                                question._id,
                                option,
                                question.type
                              )
                            }
                            className="hidden"
                          />
                          <span className="font-bold text-base mr-2 text-white">
                            {String.fromCharCode(65 + optionIndex)}.{" "}
                            {/* A, B, C, D labels */}
                          </span>
                          <span className="text-white">{option}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                className={`w-full py-3 px-4 mt-5 text-sm sm:text-base font-bold tracking-wide rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 ${
                  remainingTime <= 0
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600 text-white"
                }`}
                disabled={remainingTime <= 0}
              >
                Submit Quiz
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
