import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem("token");
  const storedCookies = localStorage.getItem("cookies");
  const cookies = storedCookies && JSON.parse(storedCookies);

  if (!token || cookies?.role !== role) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
