import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  const roles = Array.isArray(user?.["https://galeria.example.com/roles"])
    ? user["https://galeria.example.com/roles"]
    : [];

  if (isLoading) return <p>Cargando usuario...</p>;

  if (!isAuthenticated) return <Navigate to="/" />;

  if (adminOnly && !roles.includes("admin")) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
