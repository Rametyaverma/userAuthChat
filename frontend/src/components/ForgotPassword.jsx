import React, { useState } from "react";
import ResetOTPVerification from "./ResetOTPVerification";
import ResetPassword from "./ResetPassword";

const ForgotPassword = ({ onCancel }) => {
    const [step, setStep] = useState("email"); // "email" | "otp" | "reset"
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false); // loading state

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/api/auth/forgot-password/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim() }),
            });
            const data = await res.json();
            setLoading(false);
            if (res.ok) {
                setMessage(data?.message || "OTP sent to your email!");
                setStep("otp");
            } else {
                setMessage(data?.message || "Email not found Something went wrong, try again..");
            }
        } catch (err) {
            setLoading(false);
            console.error(err);
            setMessage("Server error, try again later.");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center w-2/3 max-w-sm relative">
            {step === "email" && (
                <>
                    <h2 className="text-xl font-semibold mb-6 text-center">Forgot Password?</h2>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                        Enter your registered email to receive a reset OTP
                    </p>
                    <form className="flex flex-col w-full" onSubmit={handleSendOtp}>
                        <label className="text-sm font-medium mb-1">Enter your email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mb-4 px-4 py-2 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-[#7a7deb] text-white py-2 rounded-full hover:bg-[#6366f1] transition ${loading ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                        >
                           {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                </>
            )}

            {step === "otp" && (
                <ResetOTPVerification
                    email={email}
                    onVerified={() => setStep("reset")}
                    onCancel={onCancel}
                />
            )}

            {step === "reset" && <ResetPassword email={email} onCancel={onCancel} />}

            {message && <p className="text-center text-sm mt-4 text-green-600">{message}</p>}

            <h1 className="mt-3">Go Back to Login <a href="/auth/login" className="text-l text-cyan-950 underline">Click Here!</a></h1>
        </div>
    );
};

export default ForgotPassword;
