import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, component: Component }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token || userRole !== role) {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default ProtectedRoute;
