import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./Login";
import Browse from "./Browse";
import SupportQuery from "./SupportQuery";
import Quiz from "./Quiz";
import AddQuiz from "./AddQuiz";
import EditQuiz from "./EditQuiz";
import QuizPage from "./QuizPage ";
import ResultPage from "./ResultPage";
import Dashboard from "./Dashboard";
import UploadQuiz from "./UploadQuiz";
import NotFoundError from "./NotFoundError";
import Profile from "./Profile";
import History from "./History";

const Body = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/browse",
      element: <Browse />,
    },
    {
      path: "/support",
      element: <SupportQuery />,
    },
    {
      path: "/make-quiz",
      element: <Quiz />,
    },
    {
      path: "/add-quiz",
      element: <AddQuiz />,
    },
    {
      path: "/edit-quiz/:code",
      element: <EditQuiz />,
    },
    {
      path: "/quiz/:code", // Dynamic route for specific quiz
      element: <QuizPage />, // Quiz component where you will render the quiz
    },
    {
      path: "quiz-results",
      element: <ResultPage />,
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "quiz-create",
      element: <UploadQuiz />,
    },
    {
      path: "*",
      element: <NotFoundError />,
    },
    {
      path: "profile",
      element: <Profile />,
    },
    {
      path: "history",
      element: <History />,
    }
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;
