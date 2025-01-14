import React from "react";

const AuthForm = ({ title, buttonLabel, onSubmit, linkText, linkAction }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="type"
          placeholder="Acess Id"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {buttonLabel}
        </button>
      </form>
      <p
        className="text-sm text-blue-600 mt-4 cursor-pointer hover:underline"
        onClick={linkAction}
      >
        {linkText}
      </p>
    </div>
  );
};

export default AuthForm;
