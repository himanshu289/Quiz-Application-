import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ConfirmModal from "./ConfirmModal";
import axiosInstance from "../utils/axiosinstance";
import { FaSpinner, FaExclamationCircle, FaTrash, FaFilePdf, FaFileExcel  } from 'react-icons/fa';

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const navigate = useNavigate();
  const user = useSelector((state) => state.app.user);
  const [showModal, setShowModal] = useState(false);
  const [submissionToDelete, setSubmissionToDelete] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // console.log("token", token);
        const response = await axiosInstance.get(
          `quiz`,
          {
            params: { userId: user._id },  
          }
        );
        console.log(response.data);
        if (response.data.success) {
          const sortedQuizzes = response.data.quizzes.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setQuizzes(sortedQuizzes);
        } else {
          toast.error("Failed to fetch quizzes.");
          // console.error("Failed to fetch quizzes:", response.data.message);
        }
      } catch (error) {
        toast.error("Error fetching quizzes.");
        // console.error("Error fetching quizzes:", error);
      }
    };

    if (user) {
      fetchQuizzes();
    }
  }, [user]);

  const handleAddQuiz = () => {
    navigate("/add-quiz");
  };

  const handleAIQuiz = () => {
    navigate("/quiz-create");
  };

  const handleEditQuiz = (code) => {
    navigate(`/edit-quiz/${code}`);
  };

  const handleDashboardQuiz = (code, title) => {
    navigate(`/dashboard`, { state: { quizCode: code, quizTitle: title } });
  };

  const handleDeleteQuiz = async (code) => {
    try {
      // console.log("code", user._id);
      const response = await axiosInstance.delete(
        `quiz/${code}`,
      );
      // console.log(response.data);
      if (response.data.success) {
        setQuizzes(quizzes.filter((quiz) => quiz.code !== code));
        toast.success("Quiz deleted successfully!");
        setShowModal(false); // Hide modal after deletion
      } else {
        toast.error("Failed to delete quiz.");
      }
    } catch (error) {
      // console.error("Error deleting quiz:", error);
      toast.error("Error deleting quiz.");
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  const openDeleteModal = (code) => {
    setSubmissionToDelete(code);
    setShowModal(true);
  };

  // Filter quizzes based on search query
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="mx-auto p-4">
        <div className="flex flex-col sm:flex-row mt-20 space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleAddQuiz}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
          >
            Add Quiz
          </button>

          <button
            onClick={handleAIQuiz}
            className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
          >
            Generate Quiz
          </button>
        </div>

        {/* Search Input */}
        <br />
        <input
          type="text"
          placeholder="Search by quiz title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-800 text-white placeholder-gray-400 p-3 mb-6 mt-5 rounded-lg w-full sm:w-1/2 border border-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:outline-none transition-all duration-300 shadow-md"
        />

        {/* Display filtered quizzes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredQuizzes.length > 0 ? (
            filteredQuizzes.map((quiz, index) => (
              <div
                key={quiz.code}
                className="p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md flex flex-col"
              >
                <p className="text-gray-400 mb-2">#{quizzes.length - index}</p>
                <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                <p className="text-gray-400 mb-2">
                  <span className="font-semibold text-white">Code:</span>{" "}
                  <span
                    className="text-blue-400 cursor-pointer"
                    onClick={() => handleCopyCode(quiz.code)}
                  >
                    {quiz.code}
                  </span>
                </p>
                <button
                  onClick={() => handleCopyCode(quiz.code)}
                  className="bg-green-500 text-white font-semibold py-1 px-4 mb-4 rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
                >
                  Copy Code
                </button>
                <p className="text-gray-400 mb-2">
                  <span className="font-semibold">Questions:</span>{" "}
                  {quiz.questions.length}
                </p>
                <p className="text-gray-400 mb-1">
                  <span className="font-semibold">Status:</span> {quiz.status}
                </p>
                <p className="text-gray-400 mb-1">
                  <span className="font-semibold">updated:</span>{" "}
                  {new Date(quiz.updatedAt).toLocaleString()}
                </p>

                <p className="text-gray-400 mb-4">
                  <span className="font-semibold">Quiz Start:</span>{" "}
                  {new Date(quiz.startDate).toLocaleString()}
                </p>
                <p className="text-gray-400 mb-4">
                  <span className="font-semibold">Quiz End:</span>{" "}
                  {new Date(quiz.endDate).toLocaleString()}
                </p>
                <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                  <button
                    onClick={() => handleDashboardQuiz(quiz.code, quiz.title)}
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleEditQuiz(quiz.code)}
                    className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-600 transition w-full sm:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(quiz.code)}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition w-full sm:w-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No quizzes found.</p>
          )}
        </div>
      </div>
      <ConfirmModal
        show={showModal}
        onConfirm={() => handleDeleteQuiz(submissionToDelete)}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default Quiz;
