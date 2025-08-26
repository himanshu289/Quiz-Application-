import React from "react";

const Steps = () => {
  return (
    <>
      <div className="px-4 md:px-10 lg:px-20 py-10 md:py-16 bg-gray-900 text-white border-t border-gray-700">
        <div className="relative z-1">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-8 md:mb-12 lg:mb-16 text-center text-blue-400">
            How It Works
          </h2>
          <ol className="mx-4 sm:mx-8 md:mx-16 list-decimal list-inside space-y-6 text-base md:text-lg lg:text-xl leading-relaxed">
            <li className="flex items-start space-x-4">
              <span className="text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-person-circle w-6 md:w-8 h-6 md:h-8"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.468 12.37C12.758 11.226 11.387 10 8 10c-3.387 0-4.758 1.226-5.468 2.37C2.058 13.826 2 14.722 2 15h12c0-.278-.058-1.174-.532-2.63z" />
                  <path
                    fillRule="evenodd"
                    d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1z"
                  />
                </svg>
              </span>
              <span>
                <span className="font-semibold">Step 1:</span> Sign Up or Log In
                to your account.
              </span>
            </li>
            <li className="flex items-start space-x-4">
              <span className="text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-pencil-square w-6 md:w-8 h-6 md:h-8"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706l-9 9a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l9-9a.5.5 0 0 1 .707 0zM11.5 2.207l-9 9L2 13l1.793-1.793 9-9L11.5 2.207zM12.5 1.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5z" />
                </svg>
              </span>
              <span>
                <span className="font-semibold">Step 2:</span> Navigate to the
                "Make Quiz" section to create your quiz.
              </span>
            </li>
            <li className="flex items-start space-x-4">
              <span className="text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-file-earmark-check w-6 md:w-8 h-6 md:h-8"
                  viewBox="0 0 16 16"
                >
                  <path d="M9.854 9.354a.5.5 0 0 0-.708-.708L7.5 10.293 6.854 9.646a.5.5 0 0 0-.708.708l1 1a.5.5 0 0 0 .708 0l2-2z" />
                  <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3-.5a.5.5 0 0 0 .5-.5V2.707L10.707 2H10.5a.5.5 0 0 0-.5.5v1z" />
                </svg>
              </span>
              <span>
                <span className="font-semibold">Step 3:</span> Fill in the quiz
                details and save it.
              </span>
            </li>
            <li className="flex items-start space-x-4">
              <span className="text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-people w-6 md:w-8 h-6 md:h-8"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM1 8a4 4 0 1 1 8 0A4 4 0 0 1 1 8zM14 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12.5 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
                </svg>
              </span>
              <span>
                <span className="font-semibold">Step 4:</span> Share the team
                code with your friends.
              </span>
            </li>
            <li className="flex items-start space-x-4">
              <span className="text-blue-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-ui-checks w-6 md:w-8 h-6 md:h-8"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.354 2.646a.5.5 0 0 0-.708 0L7.5 6.793l-1.146-1.147a.5.5 0 0 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l4-4a.5.5 0 0 0 0-.708zM1 10.5A.5.5 0 0 1 1.5 10h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5z" />
                </svg>
              </span>
              <span>
                <span className="font-semibold">Step 5:</span> Have friends use
                the "Join Quiz" option and enter the code to participate.
              </span>
            </li>
          </ol>
        </div>
      </div>
    </>
  );
};

export default Steps;
