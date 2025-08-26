import React from "react";

const UserDetails = ({
  formData,
  handleInputChange,
  handleSubmit,
  editMode,
}) => {
  return (
    <div className="flex flex-col space-y-4 w-full max-w-3xl mx-auto p-4"> {/* Added margin and max-width */}
      <div
        className="bg-white dark:bg-gray-900 shadow-lg rounded-lg p-6"
        style={{ boxShadow: "1px 1px 4px white" }}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3 shadow-sm rounded-md border border-gray-700 bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              readOnly={!editMode} // Only editable in edit mode
            />
          </div>

          {/* Other fields: GitHub, LinkedIn, Gender, Birthday, Location, Skills, Education */}

          <div className="col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Github
            </label>
            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleInputChange}
              className="w-full p-3 shadow-sm rounded-md border border-gray-700 bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your Github username"
              readOnly={!editMode}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleInputChange}
              className="w-full p-3 shadow-sm rounded-md border border-gray-700 bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your LinkedIn profile"
              readOnly={!editMode}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full p-3 shadow-sm rounded-md border border-gray-700 bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!editMode} // Disable when not in edit mode
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Birthday
            </label>
            <input
              type="date"
              name="birthday"
              value={formData.birthday}
              onChange={handleInputChange}
              className="w-full p-3 shadow-sm rounded-md border border-gray-700 bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              readOnly={!editMode}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <textarea
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-3 shadow-sm rounded-md border border-gray-700 bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your location"
              rows={3}
              readOnly={!editMode}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Skills
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              className="w-full p-3 shadow-sm rounded-md border border-gray-700 bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your skills"
              readOnly={!editMode}
            />
          </div>

          <div className="col-span-2">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Education
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              className="w-full p-3 shadow-sm rounded-md border border-gray-700 bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your education"
              readOnly={!editMode}
            />
          </div>

          {editMode ? (
            <div className="col-span-2 text-center mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="col-span-2 text-center mt-4">
              <p></p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
