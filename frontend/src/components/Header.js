import React, { useState, useEffect } from "react";
import { IoIosArrowDropdown } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { setToggle } from "../redux/movieSlice";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Menu icons for toggle
import { logout, setUser } from "../redux/userSlice";
import axiosInstance from "../utils/axiosinstance";

const Header = () => {
  const user = useSelector((store) => store.app.user);
  const authStatus = useSelector((store) => store.app.authStatus);
  const toggle = useSelector((store) => store.movie.toggle);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to toggle menu visibility
  const [isScreenSmall, setIsScreenSmall] = useState(false); // State for screen size
  console.log("status -->" + authStatus)
  useEffect(() => {
    if (!authStatus) {
      navigate("/");
    }
  }, [authStatus, navigate]); // Added navigate to the dependency array

  useEffect(() => {
    const handleResize = () => {
      setIsScreenSmall(window.innerWidth <= 900);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize); // Update on resize

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      await axiosInstance.get(`logout`, {
        withCredentials: true,
      });

      dispatch(setUser(null));
      localStorage.removeItem("authToken"); // or any key you use to store the token
      dispatch(logout());

      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      // console.log(error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const toggleHandler = () => {
    dispatch(setToggle());
    navigate(toggle ? "/browse" : "/make-quiz");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="z-10 w-full flex items-center justify-between px-4 md:px-6 bg-gradient-to-b bg-black bg-opacity-50 backdrop-blur-md py-2 fixed">
      {/* Logo with CR (Chauhan Rutvik) */}
      <div className="flex cursor-pointer" onClick={()=> navigate("/")}>
        <span
          className="text-sm md:text-lg font-bold text-yellow-400 uppercase tracking-wider"
          style={{
            textShadow: "1px 1px 6px rgba(0, 0, 0, 0.8)",
            fontStyle: "italic",
          }}
        >
          CR
        </span>
        <h1
          className="text-3xl md:text-5xl font-bold text-white"
          style={{
            textShadow: "2px 2px 8px rgba(0, 0, 0, 0.9)",
          }}
        >
          Quizify
        </h1>
      </div>

      {/* Menu Button for Small Screens (<= 900px) */}
      {isScreenSmall && user && authStatus ? (
        <div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <AiOutlineClose size={30} className="text-white" />
            ) : (
              <AiOutlineMenu size={30} className="text-white" />
            )}
          </button>
        </div>
      ) : (
        <div className="hidden md:flex items-center space-x-4 flex-wrap">
          {user && (
            <>
              <Link
                to="/browse"
                className={`text-lg font-semibold transition duration-300 ${
                  isActive("/browse")
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
              >
                Home
              </Link>
              <Link
                to="/profile"
                className={`text-lg font-semibold transition duration-300 ${
                  isActive("/profile")
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
              >
                Profile
              </Link>
              <Link
                to="/history"
                className={`text-lg font-semibold transition duration-300 ${
                  isActive("/history")
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
              >
                History
              </Link>
              <Link
                to="/support"
                className={`text-lg font-semibold transition duration-300 ${
                  isActive("/support")
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
              >
                Support
              </Link>
              <div className="flex items-center space-x-2">
                <IoIosArrowDropdown size="24px" color="white" />
                <h1 className="text-lg font-medium text-white">
                  {user?.fullName}
                </h1>
              </div>
              <button
                onClick={logoutHandler}
                className="bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 hover:shadow-2xl transition duration-300 ease-in-out px-4 py-2"
              >
                Logout
              </button>
              <button
                onClick={toggleHandler}
                className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-2xl transition duration-300 ease-in-out px-4 py-2"
              >
                {toggle ? "Home" : "Make Quiz"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Dropdown Menu for Small Screens */}
      {isScreenSmall && isMenuOpen && (
        <div className="absolute top-12 right-4 w-48 bg-gray-800 text-white rounded-lg shadow-lg p-4">
          {user && authStatus && (
            <>
              <Link
                to="/browse"
                className={`block mb-2 font-semibold transition duration-300 ${
                  isActive("/browse")
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/profile"
                className={`block mb-2 font-semibold transition duration-300 ${
                  isActive("/profile")
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/history"
                className={`block mb-2 font-semibold transition duration-300 ${
                  isActive("/history")
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </Link>
              <Link
                to="/support"
                className={`block mb-2 font-semibold transition duration-300 ${
                  isActive("/support")
                    ? "text-blue-400"
                    : "text-white hover:text-blue-300"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Support
              </Link>
              <button
                onClick={logoutHandler}
                className="block w-full bg-gradient-to-r from-red-500 to-red-700 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 hover:shadow-2xl transition duration-300 ease-in-out px-4 py-2 mt-4"
              >
                Logout
              </button>
              <button
                onClick={toggleHandler}
                className="block w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-2xl transition duration-300 ease-in-out px-4 py-2 mt-2"
              >
                {toggle ? "Home" : "Make Quiz"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
