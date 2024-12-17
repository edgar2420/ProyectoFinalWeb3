import axios from "axios";


const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};


const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("Token enviado:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en el interceptor de solicitud:", error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token inválido o expirado. Redirigiendo al login.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_roles");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
