import React, { useState, useEffect } from "react";
import Header from "./Header";
import toast from "react-hot-toast";
import UserProfile from "./UserProfile";
import UserDetails from "./UserDetails";
import UserData from "./UserData"; // Import the new component
import axiosInstance from "../utils/axiosinstance";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    location: "",
    birthday: "",
    github: "",
    skills: "",
    education: "",
    linkedIn: "",
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // State for window width

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    
    // Clean up the event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("get-current-user");
        setUser(response.data.user);
        setFormData({
          fullName: response.data.user.fullName || "",
          gender: response.data.user.gender || "",
          location: response.data.user.location || "",
          birthday: response.data.user.birthday
            ? response.data.user.birthday.slice(0, 10)
            : "",
          github: response.data.user.github || "",
          skills: response.data.user.skills || "",
          education: response.data.user.education || "",
          linkedIn: response.data.user.linkedIn || "",
        });
      } catch (error) {
        toast.error("Error fetching user data");
      }
    };
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const githubURL = `https://github.com/${formData.github}`;
  const linkedInURL = `${formData.linkedIn}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.fullName) {
        toast.error("Name is required");
        return;
      }
      const response = await axiosInstance.put("update", formData);
      if (response.data.success) {
        toast.success("Profile updated successfully");
        setUser(response.data.user);
        setEditMode(false);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const toggleEditMode = () => setEditMode(!editMode);

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      <Header />
      {user && (
        <section className="pt-16 dark:bg-gray-900 pb-4">
          <div className="lg:w-[90%] mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-start gap-10 mt-4">
              {/* Left side: UserProfile */}
              <div className={`flex justify-center lg:w-1/4 ${windowWidth < 900 ? '' : 'sticky lg:top-[15%] '}`}>
                <UserProfile
                  user={user}
                  githubURL={githubURL}
                  linkedInURL={linkedInURL}
                  formData={formData}
                  toggleEditMode={toggleEditMode}
                  editMode={editMode}
                />
              </div>
              {/* Right side: UserDetails or Submission Data */}
              <div className={`lg:w-3/4 flex justify-center`}>
                {editMode ? (
                  <UserDetails
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    editMode={editMode}
                  />
                ) : (
                  <UserData limit={5} />
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Profile;
