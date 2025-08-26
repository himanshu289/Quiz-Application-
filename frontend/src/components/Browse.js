import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Steps from "./Steps";
import Footer from "./Footer";
import toast from 'react-hot-toast';
import axiosInstance from "../utils/axiosinstance";

const Browse = () => {
  const user = useSelector((store) => store.app.user);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New loading state
  const [errorMessage, setErrorMessage] = useState(""); // For displaying errors

  const handleJoinQuizClick = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setJoinCode(""); // Reset code when closing popup
    setErrorMessage(""); // Clear any previous errors
  };

  const handleJoinQuiz = async () => {
    if (joinCode.trim() === "") {
      setErrorMessage("Please enter a valid join code.");
      toast.error("Please enter a valid join code.");
      return;
    }
  
    try {
      setIsLoading(true); // Start loading state
  
      const response = await axiosInstance.post("quiz/join", {
        code: joinCode,
        userId: user._id,
        action: "join", // Ensure the action is specified here
      });
  
      if (response.status === 200) {
        if (response.data.quiz.status === "upcoming" || response.data.quiz.status === "ended") {
          toast.error("This quiz is not yet available.");
          setErrorMessage("This quiz is not yet available.");
          return;
        }
        const quizData = response.data.quiz;
        toast.success("Quiz joined successfully!");
        navigate(`/quiz/${quizData.code}`, { state: { quiz: quizData } });
      } else if (response.status === 202) {
        toast.error("You have already submitted this quiz.");
        setErrorMessage(response.data.message || "You have already submitted this quiz.");
      } else {
        toast.error("Invalid code. Please try again.");
        setErrorMessage("Invalid code. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to join the quiz. Please try again later.");
      setErrorMessage("Failed to join the quiz. Please try again later.");
    } finally {
      setIsLoading(false); // Stop loading state
    }
  };
  

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <>
      <div className="relative min-h-screen bg-gray-900 text-white">
        <Header />
        {/* Center content both vertically and horizontally */}
        <div className="flex flex-col justify-center items-center px-4 lg:px-20 pt-20 md:pt-[14%] min-h-[70vh]">
          <div className="w-full  bg-white text-black p-8 lg:p-16 rounded-lg shadow-lg bg-opacity-80 text-justify">
            <h2 className="text-2xl lg:text-4xl font-bold mb-4 lg:mb-8">
              Quiz Time!
            </h2>
            <p className="mb-5">
              Test your movie knowledge with our quick quiz. Ready to challenge yourself?
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
              onClick={handleJoinQuizClick}
            >
              Join Quiz
            </button>
          </div>
        </div>

        {/* Popup for joining quiz */}
        {isPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 lg:p-10 rounded-lg shadow-2xl max-w-md lg:max-w-lg w-full">
              <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 text-black">
                Enter Join Code
              </h2>
              <input
                type="text"
                placeholder="Enter your code"
                className="w-full text-black px-4 py-2 lg:py-3 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />

              {/* Display error message */}
              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleClosePopup}
                  className="px-4 py-2 lg:px-6 lg:py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinQuiz}
                  className={`px-4 py-2 lg:px-6 lg:py-3 bg-gradient-to-r from-green-500 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Joining..." : "Join Quiz"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Adjust margin-top on medium screens for Steps */}
      <Steps />
      <Footer />
    </>
  );
};

export default Browse;
  