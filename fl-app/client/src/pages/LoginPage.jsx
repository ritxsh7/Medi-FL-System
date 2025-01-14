import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const role = Math.random() > 0.5 ? "admin" : "client"; // Replace with real logic
    const token = "dummy-token"; // Replace with real authentication logic

    // Store role and token in local storage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    // Navigate to respective dashboard
    navigate(role === "admin" ? "/admin" : "/client");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <AuthForm
        title="Login"
        buttonLabel="Login"
        onSubmit={handleLogin}
        linkText="Don't have an account? Sign up"
        linkAction={() => navigate("/signup")}
      />
    </div>
  );
};

export default LoginPage;
