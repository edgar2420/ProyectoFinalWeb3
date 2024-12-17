import axios from "axios";

// Obtener el token desde localStorage
const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

// Crear una instancia de Axios
const api = axios.create({
  baseURL: "http://localhost:8000/api/", // URL base de la API
  withCredentials: true, // Permitir cookies si se usan
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("Token enviado:", token); // Depuración
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

// Manejo de errores en las respuestas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token inválido o expirado. Redirigiendo al login.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_roles");
      window.location.href = "/login"; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export default api;