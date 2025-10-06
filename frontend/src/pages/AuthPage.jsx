import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";

export default function AuthPage() {
  // const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-5xl h-[calc(100vh-1rem)]  rounded-2xl shadow-lg overflow-hidden">
        {/* Toggle Components */}
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* Redirect unknown /auth routes back to login */}
          <Route path="*" element={<Navigate to="login" />} />
          <Route path="forgot-password" element={<ForgotPassword />} />

        </Routes>
      </div>
    </div>
  );
}
