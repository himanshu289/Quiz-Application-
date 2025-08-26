import React, { useState } from "react";
import Header from "./Header";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa";
import axiosInstance from "../utils/axiosinstance";

const FileUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [topic, setTopic] = useState("");
  const [numberOfQuestions, setNumberOfQuestions] = useState("");
  const [questionType, setQuestionType] = useState("mcqs");
  const [loading, setLoading] = useState(false);
  const [quizShow, setQuizShow] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [isTitleValid, setIsTitleValid] = useState(true);
  const [isDescriptionValid, setIsDescriptionValid] = useState(true);
  const [questionsValidity, setQuestionsValidity] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState(""); // State for start date
  const [endDate, setEndDate] = useState(""); // State for end date

  const user = useSelector((state) => state.app.user);
  const navigate = useNavigate();

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile || !topic || !numberOfQuestions || !questionType) {
      toast.error("Please fill out all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("file", pdfFile);
    formData.append("topic", topic);
    formData.append("number_of_questions", numberOfQuestions);
    formData.append("question_type", questionType);

    try {
      setLoading(true);
      console.log("hello");
      console.log(formData);
      const response = await axiosInstance.post("generate-mcqs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      // Set the generated questions to the 'questions' state
      // console.log(response);
      console.log(response.data.questions);
      setQuestions(response.data.questions);
      //  Initialize validity state based on the fetched quiz data
      const initialValidity = response.data.questions.map((q) => ({
        isQuestionValid: q.question.trim() !== "",
        areOptionsValid: q.options.map((opt) => opt.trim() !== ""),
        isCorrectAnswerValid: q.correctAnswers.length > 0,
      }));
      setQuizShow(true);
      setQuestionsValidity(initialValidity);
    } catch (error) {
      console.error("Error generating MCQs:", error);
      toast.error("Error generating MCQs. Please try again.");
    } finally {
      setLoading(false);
    }
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
    if (isSubmitting) return;

    setIsSubmitting(true);

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
          q.isFilledOptionsValid &&
          q.areOptionsValid.every((valid) => valid) &&
          q.isCorrectAnswerValid
      );

    if (!isValidForm) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    const quizData = {
      title: quizTitle,
      description: quizDescription,
      questions: questions.map((q) => {
        // Create a new object without the _id field
        const { _id, ...rest } = q;
        return {
          ...rest,
          correctAnswers: Array.isArray(q.correctAnswers)
            ? q.correctAnswers.map((optIndex) => Number(optIndex))
            : [], // Ensure correctAnswers is always an array
        };
      }),
      userId: user._id,
      startDate: startDate,
      endDate: endDate,
    };

    // questions.forEach((q, index) => {
    //   console.log(
    //     `Type of correctAnswers for question ${index + 1}:`,
    //     typeof q.correctAnswers
    //   );
    // });

    try {
      // console.log(quizData);
      const response = await axiosInstance.post(`quiz/create`, quizData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success("Quiz Created successfully!");
      const data = response.data;
      if (data.success) {
        navigate("/make-quiz");
      } else {
        toast.error("Failed to submit quiz: " + data.message);
      }
    } catch (error) {
      toast.error("Error submitting quiz: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    setPdfFile(e.target.files[0]);
  };

  const token = localStorage.getItem("UserToken");

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
    <>
      <Header />

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="bg-gray-800 rounded-lg shadow-md p-6 w-full max-w-md mt-20">
          <h1 className="text-2xl font-bold text-center mb-4 text-white">
            Generate MCQs from PDF
          </h1>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-white">Upload PDF:</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="mt-1  block w-full border rounded-lg bg-gray-800 text-white border-gray-700 shadow-sm p-2 focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-white">Topic:</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-1  block w-full border rounded-lg bg-gray-800 text-white border-gray-700 shadow-sm p-2 focus:ring-2 focus:ring-blue-600"
                placeholder="Enter topic"
              />
            </div>
            <div>
              <label className="block text-white">Number of Questions:</label>
              <input
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(e.target.value)}
                className="mt-1  block w-full border rounded-lg bg-gray-800 text-white border-gray-700 shadow-sm p-2 focus:ring-2 focus:ring-blue-500"
                min="1"
                placeholder="Enter number of questions"
              />
            </div>
            <div>
              <label className="block text-white">Question Type:</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="mt-1 block w-full border border-gray-700 bg-gray-800 text-white rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500"
              >
                <option value="mcqs">Multiple Choice Questions</option>
                <option value="true/false">True/False Questions</option>
                <option value="both">Both</option>
              </select>
            </div>
            <button
              type="submit"
              className={`w-full p-2 text-white  ${
                loading ? "bg-gray-800" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={loading}
            >
              {!loading ? (
                "Generate MCQs"
              ) : (
                <div className="">
                  <div className=" flex justify-center items-center text-center text-white">
                    <FaSpinner className="animate-spin text-4xl mb-4" />
                  </div>
                  <p className="text-lg"> Generating MCQs...</p>
                </div>
              )}
            </button>
          </form>
        </div>

        {loading && (
          <div className="mt-8 warning text-white bg-red-600 p-4 rounded-md shadow-lg">
            Note: Not reloading the page after submitting the form. Don't close
            the tab; otherwise, MCQs will not be generated. Please wait for 2-3
            minutes.
          </div>
        )}
      </div>

      {quizShow && (
        <div className="mx-auto p-6 bg-gray-900  shadow-lg">
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
                  className="w-full p-4 bg-gray-800 text-white border rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  End Date :
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-4 bg-gray-800  text-white border rounded-lg mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
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
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
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
                        <span className="font-semibold text-white">
                          {option}
                        </span>
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
                {isSubmitting ? "Submitting..." : "Create Quiz"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FileUpload;
