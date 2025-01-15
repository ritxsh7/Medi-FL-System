import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import axios from "axios";

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accessId: "",
    password: "",
    role: "",
  });

  const [message, setMessage] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_SERVER_URL}/auth/signup`,
        formData
      );
      setMessage(response.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <AuthForm
        title="Sign Up"
        buttonLabel="Sign Up"
        formType="signup"
        onSubmit={handleSignup}
        formData={formData}
        setFormData={setFormData}
        linkText="Already have an account? Log in"
        message={message}
        linkAction={() => navigate("/")}
      />
    </div>
  );
};

export default SignupPage;
