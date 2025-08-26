import React, { useState, useEffect } from "react";
import Header from "./Header";
import ConfirmationModal from "./ConfirmationModal"; // Import the modal component
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosinstance";

const EditQuiz = () => {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [questionsValidity, setQuestionsValidity] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date
  const user = useSelector((state) => state.app.user);
  // console.log("user", user);

  const navigate = useNavigate();
  const { code } = useParams(); // Get quiz ID from route params

  const formatDateForInput = (dateString) => {
    if (!dateString) return ""; // Return an empty string if the date is not provided

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axiosInstance.post("quiz/join", {
          code: code,
          userId: user._id,
          action: "fetch", // Specify the action as 'fetch'
        });
  
        const data = response.data;
        if (data.success) {
          setQuizTitle(data.quiz.title);
          setQuizDescription(data.quiz.description);
          setQuestions(data.quiz.questions);
          setStartDate(formatDateForInput(data.quiz.startDate));
          setEndDate(formatDateForInput(data.quiz.endDate));
  
          // Initialize validity state based on the fetched quiz data
          const initialValidity = data.quiz.questions.map((q) => ({
            isQuestionValid: q.question.trim() !== "",
            areOptionsValid: q.options.map((opt) => opt.trim() !== ""),
            isCorrectAnswerValid: q.correctAnswers.length > 0,
          }));
          setQuestionsValidity(initialValidity);
        } else {
          toast.error("Failed to load quiz data.");
        }
      } catch (error) {
        toast.error("Error fetching quiz data: " + error.message);
      }
    };
  
    fetchQuiz();
  }, [code, user._id]);
  

  const handleBackClick = () => {
    setIsModalOpen(true); // Open the modal when the "Back" button is clicked
  };

  const handleConfirmBack = () => {
    setIsModalOpen(false); // Close the modal
    navigate(-1); // Go back to the previous page
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal without navigating
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].question = value;

    const newValidity = [...questionsValidity];
    newValidity[index].isQuestionValid = value.trim() !== "";
    setQuestions(newQuestions);
    setQuestionsValidity(newValidity);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[optIndex] = value;

    const newValidity = [...questionsValidity];
    newValidity[qIndex].areOptionsValid[optIndex] = value.trim() !== "";
    setQuestions(newQuestions);
    setQuestionsValidity(newValidity);
  };

  const handleCorrectAnswerChange = (qIndex, optIndex) => {
    const newQuestions = [...questions];
    const question = newQuestions[qIndex];

    if (question.type === "truefalse") {
      question.correctAnswers = [optIndex]; // Only one correct answer in True/False
    } else if (question.type === "multiple") {
      // Toggle the correct answer for multiple answers
      if (question.correctAnswers.includes(optIndex)) {
        question.correctAnswers = question.correctAnswers.filter(
          (i) => i !== optIndex
        );
      } else {
        question.correctAnswers.push(optIndex);
      }
    } else {
      question.correctAnswers = [optIndex]; // Single answer
    }

    const newValidity = [...questionsValidity];
    newValidity[qIndex].isCorrectAnswerValid =
      question.correctAnswers.length > 0;
    setQuestions(newQuestions);
    setQuestionsValidity(newValidity);
  };

  const handleQuestionTypeChange = (qIndex, type) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].type = type;
    newQuestions[qIndex].options =
      type === "truefalse" ? ["True", "False"] : ["", "", "", ""];
    newQuestions[qIndex].correctAnswers = []; // Reset correct answers when type changes

    const newValidity = [...questionsValidity];
    newValidity[qIndex].areOptionsValid =
      type === "truefalse" ? [true, true] : [true, true, true, true];
    newValidity[qIndex].isCorrectAnswerValid = false;
    setQuestions(newQuestions);
    setQuestionsValidity(newValidity);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        type: "single",
        options: ["", "", "", ""],
        correctAnswers: [],
      },
    ]);
    setQuestionsValidity([
      ...questionsValidity,
      {
        isQuestionValid: false,
        areOptionsValid: [true, true, true, true],
        isCorrectAnswerValid: false,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions

    setIsSubmitting(true); // Disable submit button

    // Validate required fields
    const isTitleValid = quizTitle.trim() !== "";
    const isDescriptionValid = quizDescription.trim() !== "";

    const newQuestionsValidity = questions.map((q) => {
      const isQuestionValid = q.question.trim() !== "";
      const areOptionsValid = q.options.map((opt) => opt.trim() !== "");
      const filledOptionsCount = q.options.filter((opt) => opt.trim() !== "")
        .length;

      let isCorrectAnswerValid = false;
      if (q.type === "single" || q.type === "truefalse") {
        isCorrectAnswerValid = q.correctAnswers.length === 1;
      } else if (q.type === "multiple") {
        isCorrectAnswerValid = q.correctAnswers.length > 1;
      }

      return {
        isQuestionValid,
        areOptionsValid,
        isCorrectAnswerValid,
        isFilledOptionsValid: filledOptionsCount >= 2,
      };
    });

    setIsTitleValid(isTitleValid);
    setIsDescriptionValid(isDescriptionValid);
    setQuestionsValidity(newQuestionsValidity);

    const isValidForm =
      isTitleValid &&
      isDescriptionValid &&
      newQuestionsValidity.every(
        (q) =>
          q.isQuestionValid &&
          q.isFilledOptionsValid && // Ensure at least two options are filled
          q.areOptionsValid.every((valid) => valid) && // Ensure all options are filled
          q.isCorrectAnswerValid
      );

    if (!isValidForm) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false); // Re-enable submit button
      return;
    }

    const quizData = {
      title: quizTitle,
      description: quizDescription,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      questions: questions,
    };

    try {
      const response = await axiosInstance.put(`quiz/${code}`, quizData);

      toast.success("Quiz updated successfully!");
      const data = response.data;
      if (data.success) {
        navigate("/make-quiz");
      } else {
        toast.error("Failed to update quiz: " + data.message);
      }
    } catch (error) {
      toast.error("Error updating quiz: " + error.message);
    } finally {
      setIsSubmitting(false); // Re-enable submit button after request
    }
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const shuffleQuestions = () => {
    const shuffledQuestions = [...questions];
    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledQuestions[i], shuffledQuestions[j]] = [shuffledQuestions[j], shuffledQuestions[i]];
    }
    setQuestions(shuffledQuestions);
    toast.success("Questions shuffled successfully!");
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100">
      <Header />

      <div className="mx-auto p-6 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg">
        <div className="mb-12 mt-16">
          <h1 className="text-3xl mb-3 font-bold text-center text-white">
            Edit Quiz
          </h1>
          <button
            onClick={handleBackClick}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 float-right"
          >
            Back
          </button>
        </div>
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmBack}
        />

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quiz Title
            </label>
            <input
              type="text"
              className={`mt-1 p-4 block w-full rounded-md border ${
                isTitleValid ? "border-gray-700" : "border-red-500"
              } shadow-sm bg-gray-800 text-white`}
              value={quizTitle}
              placeholder="Quiz Title"
              onChange={(e) => setQuizTitle(e.target.value)}
            />
            {!isTitleValid && (
              <p className="text-red-500 text-xs mt-1">Title is required</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Quiz Description
            </label>
            <textarea
              className={`mt-1 p-4 block w-full rounded-lg border ${
                isDescriptionValid ? "border-gray-700" : "border-red-500"
              } shadow-sm bg-gray-800 text-white`}
              value={quizDescription}
              placeholder="Quiz Description"
              onChange={(e) => setQuizDescription(e.target.value)}
              rows="3"
            />
            {!isDescriptionValid && (
              <p className="text-red-500 text-xs mt-1">
                Description is required
              </p>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Start Date :
              </label>
              <input
                type="datetime-local"
                className="w-full p-4 bg-gray-800 border rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate || ""} // Handle the case where startDate might be undefined or null
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                End Date :
              </label>
              <input
                type="datetime-local"
                className="w-full p-4 bg-gray-800 border rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate || ""} // Handle the case where endDate might be undefined or null
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <div>
                <a onClick={shuffleQuestions}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 cursor-pointer">
                  Shuffle Question
                </a>
              </div>
          </div>

          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="mb-10 p-4 border border-gray-700 rounded-lg shadow-sm"
            >
              <div className="mb-4">
                <label className="block text-lg font-semibold mb-2 text-white">
                  Question {qIndex + 1}
                </label>
                <textarea
                  rows="2"
                  type="text"
                  className={`w-full p-4 border rounded-lg mb-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !questionsValidity[qIndex].isQuestionValid
                      ? "border-red-500"
                      : "border-gray-700"
                  } bg-gray-800 text-white`}
                  placeholder={`Question ${qIndex + 1}`}
                  value={q.question}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
                <select
                  value={q.type}
                  onChange={(e) =>
                    handleQuestionTypeChange(qIndex, e.target.value)
                  }
                  className="w-full p-4 border border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
                >
                  <option value="single">Single Answer</option>
                  <option value="multiple">Multiple Answers</option>
                  <option value="truefalse">True/False</option>
                </select>
              </div>

              {q.type === "truefalse"
                ? q.options.map((option, optIndex) => (
                    <div key={optIndex} className="mb-2 flex items-center">
                      <input
                        type="radio"
                        name={`correctAnswer-${qIndex}`}
                        checked={q.correctAnswers.includes(optIndex)}
                        onChange={() =>
                          handleCorrectAnswerChange(qIndex, optIndex)
                        }
                        className="mr-2"
                      />
                      <span className="font-semibold text-white">{option}</span>
                    </div>
                  ))
                : q.options.map((option, optIndex) => (
                    <div key={optIndex} className="mb-2 flex items-center">
                      <span className="mr-4 font-semibold text-white">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      <textarea
                        rows="1"
                        type="text"
                        className={`w-full p-2 border rounded-lg shadow-sm ${
                          !questionsValidity[qIndex].areOptionsValid[optIndex]
                            ? "border-red-500"
                            : "border-gray-700"
                        } bg-gray-800 text-white`}
                        placeholder={`Option ${String.fromCharCode(
                          65 + optIndex
                        )}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(qIndex, optIndex, e.target.value)
                        }
                      />
                      {q.type !== "truefalse" && (
                        <input
                          type="checkbox"
                          checked={q.correctAnswers.includes(optIndex)}
                          onChange={() =>
                            handleCorrectAnswerChange(qIndex, optIndex)
                          }
                          className="ml-2"
                        />
                      )}
                    </div>
                  ))}

              {!questionsValidity[qIndex].isCorrectAnswerValid && (
                <p className="text-red-600">
                  {q.type === "multiple"
                    ? "Please select at least two correct answers."
                    : "Please select at least one correct answer."}
                </p>
              )}

              <div className="mt-4 mb-6 border-t border-gray-700"></div>
              <div
                onClick={() => handleRemoveQuestion(qIndex)}
                style={{ width: "fit-content" }}
                className="bg-gradient-to-r cursor-pointer  from-red-500 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 hover:shadow-2xl transition duration-300 ease-in-out px-8 py-3 border-2"
              >
                Delete
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <button
              type="button"
              className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none w-full sm:w-auto"
              onClick={handleAddQuestion}
            >
              Add Question
            </button>

            <button
              type="submit"
              className={`flex justify-center items-center p-4 text-center border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Update Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
