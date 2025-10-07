import { useNavigate } from "react-router-dom";
import React, { useState, useCallback } from "react";
import rectangle6 from "../assets/Rectangle6.svg";
import rectangle1 from "../assets/Rectangle1.svg";
import laptop2 from "../assets/Other07reg.svg";
import OtpVerification from "./OtpVerification";

import { debounce } from "lodash";



const Register = ({ onSwitch }) => {
    const navigate = useNavigate();
    const [dob, setDob] = useState("");
    const [age, setAge] = useState(null);
    const [isUnderage, setIsUnderage] = useState(false);

    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [emailAvailable, setEmailAvailable] = useState(null);
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [emailLoading, setEmailLoading] = useState(false);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");


    const [step, setStep] = useState("form"); // "form" or "otp"
    const [userEmail, setUserEmail] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        dob: "",
        otp: "",
        otpExpiry: null,
        isVerified: false
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ✅ Live username check
    const checkUsername = async (value) => {
        setUsername(value);
        if (!value) {
            setUsernameAvailable(null);
            return;
        }
        setUsernameLoading(true);
        try {
            const res = await fetch(`https://userauthchat-6.onrender.com/api/check-username/${value}`);
            const data = await res.json();
            setUsernameAvailable(data.available);
        } catch (error) {
            console.error(error);
            setUsernameAvailable(null);
        }
        setUsernameLoading(false);

    };


    // ✅ Live email check
    const checkEmail = async (value) => {
        setEmail(value);
        if (!value) {
            setEmailAvailable(null);
            return;
        }
        setEmailLoading(true);
        try {
            const res = await fetch(`https://userauthchat-6.onrender.com/api/check-email/${value}`);
            const data = await res.json();
            setEmailAvailable(data.available);
        } catch (error) {
            console.error(error);
            setEmailAvailable(null);
        }
        setEmailLoading(false);
    };

    // ✅ Debounced versions (added just after checkUsername & checkEmail)
    const debouncedCheckUsername = useCallback(debounce(checkUsername, 500), []);
    const debouncedCheckEmail = useCallback(debounce(checkEmail, 500), []);


    const calculateAge = (dobValue) => {
        const today = new Date();
        const birthDate = new Date(dobValue);
        let ageNow = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            ageNow--;
        }
        return ageNow;
    };

    const handleDobChange = (e) => {
        const value = e.target.value;
        setDob(value);

        if (value) {
            const userAge = calculateAge(value);
            setAge(userAge);
            setIsUnderage(userAge < 18);
        } else {
            setAge(null);
            setIsUnderage(false);
        }
    };
    // Function to check password strength
    const checkPasswordStrength = (password) => {
        const minLength = password.length >= 8;
        const hasUppercase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return {
            minLength,
            hasUppercase,
            hasNumber,
            hasSpecialChar,
            isValid: minLength && hasUppercase && hasNumber && hasSpecialChar,
        };
    };
    // Function to check password rules
    const getPasswordErrors = (password) => {
        const errors = [];

        if (password.length < 8) {
            errors.push("At least 8 characters");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("At least 1 uppercase letter");
        }
        if (!/\d/.test(password)) {
            errors.push("At least 1 number");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("At least 1 special character");
        }

        return errors;
    };

    const handleRegister = async (e) => {
        e.preventDefault();


        // Construct formData from local states
        const finalFormData = {
            fullName,
            username,
            email,
            password,
            dob,
            otp: "",
            otpExpiry: null,
            isVerified: false
        };
        // 👉 Send data to backend to create user & send OTP
        try {
            const res = await fetch(`https://userauthchat-6.onrender.com/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalFormData),
            });


            const data = await res.json();
            if (!res.ok) {
                alert(data.message);
                return;
            }

            // ✅ Success
            setUserEmail(finalFormData.email);
            setStep("otp");
        } catch (error) {
            console.error("Error registering:", error);
            alert("Server error, try again later.");
        }



        // setUserEmail(email);
        // setStep("otp");
    };

    const handleOtpVerify = async (otpCode) => {
        const res = await fetch(`https://userauthchat-6.onrender.com/api/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: userEmail, otp: otpCode }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Account verified! You can now log in.");
            navigate("/auth/login");
        } else {
            alert(data.message || "Invalid OTP");
        }

    };
    const handleOtpCancel = () => {
        setStep("form"); // go back to form if cancel clicked
    };

    return (

        <div className="flex h-full rounded-2xl bg-[#dbdef5] relative">

            {/* Left Section */}

            <div className="hidden sm:flex w-10/14 p-2 sm:p-10 md:p-10 lg:ml-40 relative items-center justify-center">

                <img src={laptop2} alt="laptop" className="absolute left-18 lg:left-14 top-100 lg:top-100 transform -translate-y-1/2 -translate-x-1 lg:w-[105%] w-[95%] z-50" />
                <img src={rectangle6} alt="rectangle6" className="block xs:hidden absolute top-0 left-12 lg:left-1  w-70  rounded-t-0 z-10" />
                <img
                    src={rectangle1}
                    alt="rectangle1"
                    className="absolute top-0 left-18 lg:left-14 lg:w-70 w-65 rounded-b-full lg:rounded-b-full z-30"
                />
            </div>


            {/* Right Section */}
            <div className="flex flex-col justify-center items-center w-2/2  relative">
                <h1 className="text-xl font-bold text-center mb-6">Create an Account to Chat <br />  With Friends!</h1>

                {/* Form */}
                {step === "form" ? (
                    <form className="flex flex-col w-2/3 max-w-sm" onSubmit={handleRegister}>
                        <label className="text-sm font-medium  mb-1">Full Name:</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="mb-2 px-4 py-1 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]" required
                        />
                        <label className="text-sm font-medium mb-1">Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                debouncedCheckUsername(e.target.value)
                            }}
                            className="mb-2 px-4 py-1 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]" required
                        />
                        {/* Username Validation */}
                        {usernameLoading && <p className="text-blue-600 text-sm">⏳ Checking...</p>}
                        {usernameAvailable === false && (
                            <p className="text-sm text-red-600">❌ Username is already taken</p>
                        )}
                        {usernameAvailable === true && (
                            <p className="text-green-600 text-sm">✅ Username available</p>
                        )}
                        {usernameAvailable === true && (
                            <p className="text-green-600 text-sm">✅ Username available</p>
                        )}

                        <label className="text-sm font-medium mb-1">Date of Birth:</label>
                        <input
                            type="date"
                            value={dob}
                            onChange={handleDobChange}
                            className="mb-2 px-4 py-1 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]" required
                        />
                        {age !== null && (
                            <p className={`text-sm mb-2 ${isUnderage ? "text-red-600" : "text-green-600"}`}>
                                Your age: {age} {isUnderage ? "(You must be 18+ to register)" : ""}
                            </p>
                        )}

                        <label className="text-sm font-medium mb-1">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value); debouncedCheckEmail(e.target.value)
                            }}
                            className="mb-2 px-4 py-1 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]" required
                        />
                        {/* Email Validation */}
                        {emailLoading && <p className="text-blue-600 text-sm">⏳ Checking...</p>}
                        {emailAvailable === false && (
                            <p className="text-red-600 text-sm">❌ Email already in use</p>
                        )}
                        {emailAvailable === true && (
                            <p className="text-green-600 text-sm">✅ Email available</p>
                        )}

                        <label className="text-sm font-medium mb-1">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mb-2 px-4 py-1 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]" required
                        />
                        {/* Password strength messages */}
                        {/* Show only unsatisfied rules */}
                        {password && getPasswordErrors(password).length > 0 && (
                            <div className="text-sm mb-2 text-red-600">
                                {getPasswordErrors(password).map((err, idx) => (
                                    <p key={idx}>✘ {err}</p>
                                ))}
                            </div>
                        )}



                        <label className="text-sm font-medium mb-1">Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mb-2 px-4 py-1 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]" required
                        />

                        <button
                            type="submit"
                            disabled={isUnderage ||
                                usernameAvailable === false ||
                                emailAvailable === false ||
                                !checkPasswordStrength(password).isValid ||
                                password !== confirmPassword
                            }

                            className={`bg-[#7a7deb] text-white py-2 mt-4 rounded-full  transition ${isUnderage || usernameAvailable === false || emailAvailable === false ||
                                !checkPasswordStrength(password).isValid ||
                                password !== confirmPassword
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-[#7a7deb] text-white hover:bg-[#6366f1] cursor-pointer"
                                }`}
                        >
                            Register
                        </button>
                    </form>
                ) : (
                    <OtpVerification onVerify={handleOtpVerify} onCancel={handleOtpCancel} onResend={() => {
                        fetch("http://localhost:5000/api/auth/resend-otp", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: userEmail }),
                        })
                            .then(res => res.json())
                            .then(data => alert(data.message))
                            .catch(err => console.error(err));
                    }} />
                )}

                {/* Register */}
                <p className="mt-6 text-sm">
                    Already have an account?{" "}
                    <span className="font-bold cursor-pointer hover:underline" onClick={() => navigate("/auth/login")}>
                        Login
                    </span>
                </p>

                {/* Social Icons */}
                <div className="flex gap-4 mt-4 text-[#7a7deb] text-xl">
                    <a href="https://www.instagram.com/rametya/?"><i className="fab fa-instagram cursor-pointer"></i></a>

                    <a><i class="fa-solid fa-phone cursor-pointer"></i></a>
                    <a href="https://www.linkedin.com/in/rametya-verma-021737310"><i className="fab fa-linkedin cursor-pointer"></i></a>
                </div>


            </div>


        </div>
    );
};

export default Register;
