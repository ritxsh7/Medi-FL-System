import React from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();

    // Navigate to client dashboard
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-50">
      <AuthForm
        title="Sign Up"
        buttonLabel="Sign Up"
        onSubmit={handleSignup}
        linkText="Already have an account? Log in"
        linkAction={() => navigate("/")}
      />
    </div>
  );
};

export default SignupPage;
