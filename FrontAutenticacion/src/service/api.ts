import axios from "axios";

// Función para obtener el token (cookies o localStorage)
const getToken = (): string | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));
  return cookie ? cookie.split("=")[1] : localStorage.getItem("access_token");
};

// Crear instancia de Axios
const api = axios.create({
  baseURL: "http://localhost:8000/api/",
  withCredentials: true, // Asegura que las cookies se envíen automáticamente si usas cookies
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar respuestas (opcional)
api.interceptors.response.use(
  (response) => response, // Pasa la respuesta si no hay errores
  (error) => {
    // Manejar errores específicos
    if (error.response && error.response.status === 401) {
      console.error("No autorizado. Redirigiendo al login...");
      // Redirige al login o muestra un mensaje
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
