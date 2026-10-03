import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});

const refreshApi = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {

            originalRequest._retry = true;

            try {

                // Separate Axios instance
                await refreshApi.post("/auth/refresh-token");

                // Retry original request
                return api(originalRequest);

            } catch (refreshError) {

                window.location.href = "/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;