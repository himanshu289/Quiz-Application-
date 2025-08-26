import React, { useState } from "react";
import Header from "./Header";

const SupportQuery = () => {
  const [query, setQuery] = useState("");
  const [charCount, setCharCount] = useState(0);
  const charLimit = 150;

  const handleChange = (e) => {
    const input = e.target.value;

    if (input.length <= charLimit) {
      setQuery(input);
      setCharCount(input.length);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-900">
        <Header />
        <div className="flex justify-center pt-[9%] w-full">
          <form className="w-full max-w-lg p-6 bg-white rounded-lg shadow-md border border-gray-200">
            <h2 className="text-2xl font-semibold mb-8 text-gray-800">
              Submit a Support Query
            </h2>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Upload Image
              </label>
              <input
                className="w-full p-2 cursor-pointer border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                type="file"
                accept="image/*"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Query
              </label>
              <textarea
                className="w-full resize-none p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your query here..."
                rows="4"
                value={query}
                onChange={handleChange}
              />
              <p
                className={`text-sm ${
                  charCount === charLimit ? "text-red-500" : "text-gray-500"
                } mt-2`}
              >
                {charCount}/{charLimit} characters
              </p>
            </div>

            <div className="flex justify-center">
              <button className="bg-red-800 text-white font-semibold rounded-lg px-6 py-3 hover:bg-red-700 transition">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SupportQuery;
