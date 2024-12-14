import { createBrowserRouter } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../user/Dashboard";
import ClienteDashboard from "../user/ClienteDashboard";
import RecargaDashboard from "../user/RecargaDashboard";
import PartidosDashboard from "../partidos/PartidosDashboard";
import Page404 from "../Page404";
import ProtectedRoute from "../components/ProtectedRoute";
import UserList from "../user/UserList";
import UserForm from "../user/UserFrom";
import CreateEvento from "../partidos/CreateEvento";

import CreateLiga from "../partidos/CreateLiga";
import CreateDeporte from "../partidos/CreateDeporte";
import CreateEquipo from "../partidos/CreateEquipo";

import DeportesDashboard from "../partidos/DeportesDashboard";
import EquiposDashboard from "../partidos/EquiposDashboard";
import LigasDashboard from "../partidos/LigasDashboard";
import EventosDashboard from "../partidos/EventosDashboard";



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
    path: "/evento-dashboard",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <EventosDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/deportes-dashboard",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <DeportesDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/equipos-dashboard",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <EquiposDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/liga-dashboard",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <LigasDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/partidos/create-evento",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <CreateEvento />
      </ProtectedRoute>
    ),
  },
  {
    path: "/partidos/create-equipo",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <CreateEquipo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/partidos/create-deporte",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <CreateDeporte />
      </ProtectedRoute>
    ),
  },
  {
    path: "/partidos/create-liga",
    element: (
      <ProtectedRoute requiredRole="admin_partidos">
        <CreateLiga />
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
