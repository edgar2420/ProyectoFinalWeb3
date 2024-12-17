import { createBrowserRouter } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Dashboard from "../user/Dashboard";
import ClienteDashboard from "../../cliente/ClienteDashboard";
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
import LigasPorDeporte from "../../cliente/LigasPorDeporte.tsx";
import PartidosPorLiga from "../../cliente/PartidosPorLiga.tsx";
import DetallePartido from "../../cliente/PartidoDetalle.tsx";
import PartidosList from "../../cliente/PartidosList.tsx";

import DeportesList from "../../cliente/EquiposList.tsx";
import EquiposList from "../../cliente/EquiposList.tsx";
import PartidosEquipo from "../../cliente/PartidosEquipo.tsx";





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
    path: "/cliente-dashboard/Equipos",
    element: (
      <ProtectedRoute requiredRole="cliente">
        <EquiposList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cliente-dashboard/equipos/:equipoId/partidos",
    element: (
      <ProtectedRoute requiredRole="cliente">
        <PartidosEquipo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cliente-dashboard/deportes",
    element: (
      <ProtectedRoute requiredRole="cliente">
        <DeportesList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cliente-dashboard/partidos",
    element: (
      <ProtectedRoute requiredRole="cliente">
        <PartidosList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cliente-dashboard/deportes/:deporte_id/ligas",
    element: (
      <ProtectedRoute requiredRole="cliente">
        <LigasPorDeporte />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cliente-dashboard/ligas/:liga_id/partidos",
    element: (
      <ProtectedRoute requiredRole="cliente">
        <PartidosPorLiga />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cliente-dashboard/partidos/:partido_id/detalle",
    element: (
      <ProtectedRoute requiredRole="cliente">
        <DetallePartido />
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
