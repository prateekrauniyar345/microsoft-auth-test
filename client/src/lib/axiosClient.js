import axios from "axios";


const axiosClient  = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL, // Base URL for your backend API
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true, // Include cookies for authentication
});

export default axiosClient;