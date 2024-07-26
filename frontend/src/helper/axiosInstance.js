import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.baseURL = "http://localhost:8000/api/v1";
export default axiosInstance;
