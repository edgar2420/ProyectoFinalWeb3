import axios from "axios";


const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};


const apuestasApi = axios.create({
  baseURL: "http://localhost:8002/apuestas/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});


apuestasApi.interceptors.request.use(
  (config) => {
    const token = getToken();
    console.log("Token enviado a API de Apuestas:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error en el interceptor de solicitud (apuestas):", error);
    return Promise.reject(error);
  }
);


apuestasApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Token inválido o expirado en API de Apuestas. Redirigiendo al login.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user_roles");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apuestasApi;
