import React from "react";
import { Navigate } from "react-router-dom";

const RedirectPage = ({ children }) => {
  const token = localStorage.getItem("token");
  const cookies = JSON.parse(localStorage.getItem("cookies"));

  if (token && cookies) {
    return (
      <Navigate
        to={cookies.role === "admin" ? "/admin" : `/client/${cookies.id}`}
      />
    );
  }
  return children;
};

export default RedirectPage;
