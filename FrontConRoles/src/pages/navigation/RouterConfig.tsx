import { createBrowserRouter } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../user/Dashboard";
import ClienteDashboard from "../user/ClienteDashboard";
import RecargaDashboard from "../user/RecargaDashboard";
import PartidosDashboard from "../user/PartidosDashboard";
import Page404 from "../Page404";
import ProtectedRoute from "../components/ProtectedRoute";
import UserList from "../user/UserList";
import UserForm from "../user/UserFrom";


export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute requiredRole="admin_usuarios">
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cliente-dashboard",
    element: (
      <ProtectedRoute requiredRole="cliente">
        <ClienteDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recarga-dashboard",
    element: (
      <ProtectedRoute requiredRole="recarga">
        <RecargaDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/partidos-dashboard",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <PartidosDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute requiredRole="admin_usuarios">
        <UserList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/create",
    element: (
      <ProtectedRoute requiredRole="admin_usuarios">
        <UserForm />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users/:id/edit",
    element: (
      <ProtectedRoute requiredRole="admin_usuarios">
        <UserForm />
      </ProtectedRoute>
    ),
  },
  
  {
    path: "*",
    element: <Page404 />,
  },
]);
