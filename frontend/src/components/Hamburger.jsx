import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

export default function Hamburger() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setEmail(decoded.email || decoded.username || decoded.name || "User");
      } catch (err) {
        console.error("Invalid token:", err);
        setEmail("User");
      }
    }
  }, []);


    
    const handleLogout = () => {
        // 🗑 Remove token from localStorage
        localStorage.removeItem("token");
        sessionStorage.removeItem("token");

        navigate("/auth/login", { replace: true });
        // Redirect to login
        // window.location.href = "/auth/login";
    };



    return (
        <div className="w-55  h-auto absolute left-14 bg-white top-[25%]   shadow-lg rounded-2xl ">
            <div className="flex-col  ">
                <span className="flex justify-center px-2.5" >
                    <p className="text-[#495ef7] py-2">{email}</p>
                </span>
                <hr />
                <span className="flex gap-4 items-center text-l font-sm pl-2 py-3  hover:bg-[#e6e8f7]">
                    <i className="fa-solid fa-gear font-light"></i>
                    <h2>Settings</h2>
                </span>
                <span className="flex gap-4 items-center  text-l pl-2 font-sm py-3  hover:bg-[#e6e8f7]">
                    <i className="fa-solid fa-chart-line"></i>
                    <h2>Your Activity</h2>
                </span>
                <span className="flex gap-4 items-center text-l pl-2 font-sm py-3  hover:bg-[#e6e8f7]">
                    <i className="fa-regular fa-bookmark"></i>
                    <h2>Saved</h2>                        
                </span>                                        
                <span className="flex gap-4 items-center pl-2 py-3  hover:bg-[#e6e8f7]">
                    <i className="fa-regular fa-star"></i>
                    <h2>Switch Appearance</h2>
                </span>                               
                <span className="flex gap-4 items-center pl-2 py-3  hover:bg-[#e6e8f7]">
                    <i className="fa-solid fa-bug"></i>
                    <h2>Report a Problem</h2>
                </span>              
            </div>

            <div className="border-t-gray-200 border-t">
                <button className="w-full py-2 text-red-700 font-medium hover:bg-[#e6e8f7]" onClick={handleLogout}>Log Out</button>

            </div>
        </div>
    )
}