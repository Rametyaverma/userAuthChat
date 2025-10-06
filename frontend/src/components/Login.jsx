import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import laptop from "../assets/other03.svg";
import shape from "../assets/rectangle5.svg";
import ForgotPassword from "./ForgotPassword";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgot, setShowForgot] = useState(false); // toggle forgot password

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Invalid login credentials");
        return;
      }

      if (res.ok) {
        const { token } = data;
        if (rememberMe) {
          localStorage.setItem("token", token); // Save token in localStorage
        }else {
          sessionStorage.setItem("token", token); // Save token in sessionStorage
        }
        
        
        navigate("/chat");
      }


     
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again.");
    }
  };


  return (
    <div className="flex h-screen bg-[#dbdef5] relative">
      {/* Left Section */}
      <div className="flex flex-col justify-center items-center w-2/2 relative">

        {!showForgot ? (
          <>
            <h2 className="text-xl font-semibold mb-6">Welcome Back!</h2>

            {/* Form */}
            <form className="flex flex-col w-2/3 max-w-sm" onSubmit={handleSubmit}>
              <label className="text-sm font-medium mb-1">Username or Email:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mb-4 px-4 py-2 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]"
                required
              />

              <label className="text-sm font-medium mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-2 px-4 py-2 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]"
                required
              />

              {/* Remember Me + Forgot Password */}
              <div className="flex justify-between items-center mb-4 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="w-4 h-4"
                  />
                  Remember Me
                </label>
                <span
                  className="text-[#6366f1] cursor-pointer hover:underline"
                  onClick={() => setShowForgot(true)}
                >
                  Forgot Password?
                </span>

              </div>

              <button
                type="submit"
                className="bg-[#7a7deb] text-white py-2 rounded-full hover:bg-[#6366f1] transition cursor-pointer"
              >
                Login
              </button>
            </form>

            {/* Register */}
            <p className="mt-6 text-sm">
              Don’t have an account?{" "}
              <span
                className="font-bold cursor-pointer hover:underline"
                onClick={() => navigate("/auth/register")}
              >
                Register
              </span>
            </p>
          </>
        ) : (
          // Show Forgot Password component
          <ForgotPassword onCancel={() => setShowForgot(false)} />
        )}
        {/* Social Icons */}
        <div className="flex gap-4 mt-4 text-[#7a7deb] text-xl">
          <a href="https://www.instagram.com/rametya/?">
            <i className="fab fa-instagram cursor-pointer"></i>
          </a>
          <a>
            <i className="fa-solid fa-phone cursor-pointer"></i>
          </a>
          <a href="https://www.linkedin.com/in/rametya-verma-021737310">
            <i className="fab fa-linkedin cursor-pointer"></i>
          </a>
        </div>

        {/* Decorative Shape */}
        <img
          src={shape}
          alt="shape"
          className="absolute bottom-4 left-4 w-32 opacity-80"
        />
      </div>

      {/* Right Section */}
      <div className="w-1/2 bg-[#bdb7f5] relative flex items-center justify-center"></div>

      <img
        src={laptop}
        alt="laptop"
        className="absolute left-8/10 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40%]"
      />
    </div>
  );
};

export default Login;
