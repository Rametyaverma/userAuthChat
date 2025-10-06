import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function OtpVerification({ onVerify, onCancel, onResend }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(30);


  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    onVerify(otpCode);
  };
  const handleResend = () => {
    onResend(); // 🔥 Call backend to resend OTP
    setTimer(30); // reset timer
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-[400px] bg-white shadow-lg rounded-2xl p-8 text-center relative z-50"
    >
      {/* Cancel (X) Button */}
      <button
        onClick={onCancel}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ×
      </button>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">OTP Verification</h2>
      <p className="text-gray-600 mb-6">Enter the 6-digit code sent to your email</p>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            value={digit}
            maxLength="1"
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="w-12 h-12 border border-gray-300 rounded-lg text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={handleVerify}
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
      >
        Verify OTP
      </button>

      {/* Resend OTP Section */}
      <div className="mt-4 text-sm text-gray-600">
        {timer > 0 ? (
          <p>Resend OTP in {timer}s</p>
        ) : (
          <button
            onClick={handleResend}
            className="text-blue-600 hover:underline font-medium"
          >
            Resend OTP
          </button>
        )}
      </div>
    </motion.div>
  );
}
