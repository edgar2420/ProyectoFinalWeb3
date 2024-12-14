import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Incluimos Bootstrap para estilos
import { RouterProvider } from "react-router-dom"; // Para manejar rutas
import { ThemeProvider } from "styled-components"; // Si usas styled-components para temas
import { router } from "./pages/navigation/RouterConfig"; // Importar el archivo de configuración de rutas


const theme = {
  colors: {
    primary: "#007bff",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    background: "#f8f9fa",
    text: "#212529",
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} /> {/* Proveer el router */}
    </ThemeProvider>
  </StrictMode>
);
