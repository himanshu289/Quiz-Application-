import axiosInstance from "../utils/axiosinstance";

class Auth {
  getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get(
        "get-current-user",
      );

      const data = response.data;
      console.log(data)
      if (data.success) {
        console.log(data)
        return { data, authStatus: true };
      } else {
        return { authStatus: false };
      }
    } catch (err) {
      console.error("An error occurred: -->", err);
      return { authStatus: false };
    }
  };
}

const AuthService = new Auth();
export default AuthService;
