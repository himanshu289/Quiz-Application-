import React, { useState } from "react";
import Header from "./Header";
import UserData from "./UserData";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle change in the search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="p-4 sm:p-6 mx-auto ">
        {/* Search Input */}
        <div className="mt-10 sm:mt-20">
          <input
            type="text"
            placeholder="Search submissions..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-3 rounded-md border border-gray-600 bg-gray-800 text-white w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 p-2  rounded-lg shadow-md">
          {/* Pass searchTerm as a prop to filter submissions */}
          <UserData searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
};

export default History;
