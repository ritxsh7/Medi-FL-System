import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  document.title = "Login";

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    accessId: "",
    password: "",
    role: "",
  });
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/auth/login`,
        formData
      );
      const { role, token, message, id, accessId } = response.data;
      // console.log(role, token, message);
      setMessage(message);
      localStorage.setItem("token", token);
      localStorage.setItem("cookies", JSON.stringify({ role, id, accessId }));
      role === "admin" ? navigate("/admin") : navigate(`/client/${id}`);
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <AuthForm
        title="Login"
        buttonLabel="Login"
        onSubmit={handleLogin}
        setFormData={setFormData}
        message={message}
        formType="login"
        linkText="Don't have an account? Sign up"
        linkAction={() => navigate("/signup")}
      />
    </div>
  );
};

export default LoginPage;
