import React, { useEffect, useState } from "react";
import Body from "./components/Body";
import { Toaster } from "react-hot-toast";
import AuthService from "./Auth/auth";
import { useDispatch } from "react-redux";
import { setUser, logout } from "./redux/userSlice";

function App() {
  const dispatch = useDispatch();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authStatus = await AuthService.getCurrentUser();
        setIsAuthenticated(authStatus.authStatus);
        if (authStatus.authStatus) {
          dispatch(setUser(authStatus.data.user));
          // console.log("User is authenticated");
        } else {
          dispatch(logout());
          // console.log("User is not authenticated");
        }
      } catch (error) {
        // console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Body />
      <Toaster />
    </div>
  );
}

export default App;
