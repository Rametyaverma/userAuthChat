import React, { useState, useRef } from "react";

const ResetOTPVerification = ({ email, onVerified, onCancel }) => {
  const OTP_LENGTH = 6; // number of boxes
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if a digit is entered
      if (value && index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== OTP_LENGTH) {
      setMessage("Please enter the complete OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim(), otp: otpValue }),
        }
      );
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setMessage("OTP verified!");
        onVerified();
      } else {
        setMessage(data?.message || "Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error, try again later.");
      setLoading(false);
    }
  };

  return (
    <form className="flex flex-col w-full" onSubmit={handleVerifyOtp}>
      <h2 className="text-xl font-semibold mb-6 text-center">Verify OTP</h2>
      <p className="text-sm text-gray-500 mb-4 text-center">
        Enter the OTP sent to {email}
      </p>

      <div className="flex justify-center gap-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputsRef.current[index] = el)}
            className="w-10 h-12 text-center text-lg border border-[#7a7deb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a7deb]"
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`bg-[#7a7deb] text-white py-2 rounded-full hover:bg-[#6366f1] transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="text-[#6366f1] hover:underline transition text-sm mt-4"
      >
        Back to Login
      </button>

      {message && (
        <p className="text-center text-sm mt-4 text-red-600">{message}</p>
      )}
    </form>
  );
};

export default ResetOTPVerification;
