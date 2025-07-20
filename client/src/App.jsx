import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Layout from "./layout/Layout";
import PendingPage from "./pages/PendingPage";
import CompletedPage from "./pages/CompletedPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => {
    const token = localStorage.getItem("currentUser");
    return token ? JSON.parse(token) : null;
  });

  // Keyboard navigation handler
  const handleKeyboardShortcuts = (event) => {
    if (!currentUser) return; // Only work when user is logged in
    
    // Check if Alt key is pressed
    if (event.altKey) {
      switch (event.key.toLowerCase()) {
        case 'h': // Alt + H for Home
          event.preventDefault();
          navigate('/');
          break;
        case 'p': // Alt + P for Pending
          event.preventDefault();
          navigate('/pending');
          break;
        case 'c': // Alt + C for Completed
          event.preventDefault();
          navigate('/complete');
          break;
        case 'u': // Alt + U for User Profile
          event.preventDefault();
          navigate('/profile');
          break;
      }
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [currentUser, navigate]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
      navigate("/login");
    }
  }, [currentUser]);

  const handleAuthSubmit = (data) => {
    const user = {
      name: data.name || "User",
      email: data.email || "user@example.com",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        data.name || "User"
      )}&background=random`,
    };
    setCurrentUser(user);
    navigate("/", { replace: true });
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login", { replace: true });
  };

  const ProtectedLayout = () => {
    return (
      <Layout user={currentUser} onLogout={handleLogout}>
        <Outlet />
      </Layout>
    );
  };
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Login
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => {
                navigate("/signup");
              }}
            />
          </div>
        }
      />

      <Route
        path="/signup"
        element={
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <SignUp
              onSubmit={handleAuthSubmit}
              onSwitchMode={() => {
                navigate("/login");
              }}
            />
          </div>
        }
      />
      <Route
        element={
          currentUser ? <ProtectedLayout /> : <Navigate to="/login" replace />
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/pending" element={<PendingPage />} />
        <Route path="/complete" element={<CompletedPage />} />
        <Route path="/profile" element={<ProfilePage user={currentUser} setCurrentUser={setCurrentUser} onLogout={handleLogout}/>} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={currentUser ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;
