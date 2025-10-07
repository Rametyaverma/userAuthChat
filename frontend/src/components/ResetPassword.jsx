import React, { useState } from "react";

const ResetPassword = ({ email, onCancel }) => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword.trim() !== confirmPassword.trim()) {
            setMessage("Passwords do not match!");
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`https://userauthchat-6.onrender.com/api/auth/forgot-password/reset, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), newPassword: newPassword.trim() }),
            });
            const data = await res.json();
            setLoading(false);
            if (res.ok) {
                setMessage("Password reset successfully! You can login now.");
                setTimeout(onCancel, 2000); // Back to login
            } else {
                setMessage(data?.message || "Failed to reset password.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error, try again later.");
        }
    };

    return (
        <form className="flex flex-col w-full" onSubmit={handleResetPassword}>
            <h2 className="text-xl font-semibold mb-6 text-center">Reset Password</h2>
            <p className="text-sm text-gray-500 mb-4 text-center">
                Enter your new password
            </p>
            <label className="text-sm font-medium mb-1">New Password:</label>
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mb-2 px-4 py-2 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]"
            />
            <label className="text-sm font-medium mb-1">Confirm Password:</label>
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mb-4 px-4 py-2 border border-[#7a7deb] rounded-full focus:outline-none focus:ring-2 focus:ring-[#7a7deb]"
            />
            <button
  type="submit"
  disabled={loading}
  className={`bg-[#7a7deb] text-white py-2 rounded-full hover:bg-[#6366f1] transition ${
    loading ? "opacity-50 cursor-not-allowed" : ""
  }`}
>
  {loading ? "Sending..." : "Send"}
</button>

                {loading ? "Resetting..." : "Reset Password"}
            </button>
            <button
                type="button"
                onClick={onCancel}
                className="text-[#6366f1] hover:underline transition text-sm mt-4"
            >
                Back to Login
            </button>
            {message && (
                <p
                    className={`text-center text-sm mt-4 ${message.includes("successfully") ? "text-green-600" : "text-red-600"
                        }`}
                >
                    {message}
                </p>
            )}
        </form>
    );
};

export default ResetPassword;

