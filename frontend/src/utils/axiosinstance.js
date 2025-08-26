import axios from 'axios';


const axiosInstance = axios.create({
  // baseURL: `https://quiz-web-ef2i.onrender.com/api/v1/user`, // Set the base URL",
  baseURL: `http://localhost:8080/api/v1/user`, // Set the base URL
  withCredentials: true,  // To send cookies if needed (depending on your setup)
  headers: {
    'Content-Type': 'application/json'
  }
});


export default axiosInstance;
