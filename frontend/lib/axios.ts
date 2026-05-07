import axios from "axios"

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const Token = localStorage.getItem("accessToken");

    if (Token) {
      config.headers.Authorization = `Bearer ${Token}`;
    }
  }

  return config;
});


// RESPONSE INTERCEPTOR (AUTO REFRESH)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // call refresh API (cookie used automatically)
        const res = await api.post("/auth/refresh", {});

        const newAccessToken = res.data.accessToken;

        //  store new token
        localStorage.setItem("accessToken", newAccessToken);

        //  retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        //  refresh failed → logout
        localStorage.removeItem("accessToken");

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

