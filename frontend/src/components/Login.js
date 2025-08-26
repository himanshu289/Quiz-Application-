import React, { useState, useEffect } from "react";
import Header from "./Header";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "../redux/userSlice";
import axiosInstance from "../utils/axiosinstance";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const authStatus = useSelector((store) => store.app.authStatus);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((store) => store.app.isLoading);
  const user = useSelector((store) => store.app.user);

  const toggleLogin = () => {
    setIsLogin(!isLogin);
  };

  useEffect(() => {
    if (authStatus) {
      if (user) {
        navigate("/browse");
      }
    } else {
      navigate("/");
    }
  }, [authStatus, user, navigate]); // Added user and navigate to the dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    const userData = isLogin ? { email, password } : { fullName, email, password };
    try {
      const url = isLogin
        ? `login`
        : `register`;
      const res = await axiosInstance.post(url, userData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        if (isLogin) {
          // console.log("this is login data: ", res.data.user);

          localStorage.setItem("UserToken", res.data.token);
          // console.log("this is token: ", res.data.token);
          dispatch(setUser(res.data.user));
          navigate("/browse");
        } else {
          setIsLogin(true);
        }
      }
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
    setFullName("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <div style={{ backgroundColor: "#0d1117", minHeight: "100vh" }}>
      
        <Header />
        <div className="relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8  min-h-screen ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-md p-8 space-y-6 bg-gray-900 bg-opacity-90 rounded-lg shadow-lg"
            style={{boxShadow: "0 0 15px 0 rgba(255, 255, 255, 0.1)" }}
          >
            <h1 className="text-4xl text-white font-bold text-center">
              {isLogin ? "Login" : "Signup"}
            </h1>
            {!isLogin && (
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                type="text"
                placeholder="Full Name"
                className="p-4 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            )}
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="p-4 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="p-4 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              className={`w-full py-4 bg-blue-600 text-white font-bold rounded-md transition-transform transform hover:scale-105 focus:scale-95`}
            >
              {isLoading ? "Loading..." : isLogin ? "Login" : "Signup"}
            </button>
            <p className="text-white text-center">
              {isLogin ? "New to Quiz App?" : "Already have an account?"}
              <span
                onClick={toggleLogin}
                className="ml-2 text-blue-500 cursor-pointer hover:underline"
              >
                {isLogin ? "Signup" : "Login"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
