import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import LandingPage from "./pages/LandingPage";
import ChatPage from "./pages/ChatPage";
import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to LandingPage */}
        <Route path="/" element={<LandingPage />} />

        {/* Authentication */}
        <Route path="/auth/*" element={<AuthPage />} />



        {/* Protected Chat Route */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
