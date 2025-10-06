import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4fc]">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-[#7a7deb]">ChatApp</h1>
        <nav className="flex gap-4">
          <button
            onClick={() => navigate("/auth/login")}
            className="px-4 py-2 rounded-full border cursor-pointer border-[#7a7deb] text-[#7a7deb] hover:bg-[#7a7deb] hover:text-white transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/auth/register")}
            className="px-4 py-2 rounded-full bg-[#7a7deb] text-white cursor-pointer hover:bg-[#6366f1] transition"
          >
            Register
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Connect. Chat. Collaborate.
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-6">
          A realtime chat app with modern design, built for speed and simplicity.
        </p>
        <button
          onClick={() => navigate("/auth/register")}
          className="px-6 py-3 cursor-pointer rounded-full bg-[#7a7deb] text-white text-lg font-semibold hover:bg-[#6366f1] transition"
        >
          Get Started
        </button>
      </main>

      {/* Features Section */}
      <section className="bg-white py-12 px-6 md:px-20 text-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Why ChatApp?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-[#f9f9ff] rounded-lg shadow">
            <h4 className="font-bold mb-2">⚡ Realtime Messaging</h4>
            <p>Send and receive messages instantly using WebSockets.</p>
          </div>
          <div className="p-6 bg-[#f9f9ff] rounded-lg shadow">
            <h4 className="font-bold mb-2">🔒 Secure Login</h4>
            <p>Protected with authentication and encrypted communication.</p>
          </div>
          <div className="p-6 bg-[#f9f9ff] rounded-lg shadow">
            <h4 className="font-bold mb-2">📱 Responsive UI</h4>
            <p>Enjoy seamless chatting on desktop, tablet, or mobile.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center bg-[#7a7deb] text-white">
        © {new Date().getFullYear()} ChatApp. All rights reserved.
      </footer>
    </div>
  );
}
