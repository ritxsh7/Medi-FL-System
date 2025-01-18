import React from "react";

const AuthForm = ({
  title,
  buttonLabel,
  onSubmit,
  linkText,
  linkAction,
  setFormData,
  formType,
  message,
}) => {
  const handleAccessId = (e) => {
    setFormData((prev) => {
      return { ...prev, accessId: e.target.value };
    });
  };

  const handlePassword = (e) => {
    setFormData((prev) => {
      return { ...prev, password: e.target.value };
    });
  };

  const handleRole = (e) => {
    setFormData((prev) => {
      return { ...prev, role: e.target.value };
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-96">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">{title}</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="type"
          placeholder="Acess Id"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
          onChange={handleAccessId}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          required
          onChange={handlePassword}
        />
        {formType === "signup" && (
          <select
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
            onChange={handleRole}
          >
            <option value="" disabled selected>
              Select Role
            </option>
            <option value="admin">Admin</option>
            <option value="client">Client</option>
          </select>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {buttonLabel}
        </button>
      </form>
      <p
        className="text-md text-blue-600 mt-4 cursor-pointer hover:underline"
        onClick={linkAction}
      >
        {linkText}
      </p>
      <p className="py-2">{message}</p>
    </div>
  );
};

export default AuthForm;
