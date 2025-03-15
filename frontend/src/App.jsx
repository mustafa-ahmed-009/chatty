import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingsPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "react-hot-toast";
import { useAuthStore as useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

const App = () => {
 const {theme} =  useThemeStore();
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (

      <div data-theme={theme}>
      <Navbar />

<Routes>
  <Route
    path="/"
    element={authUser ? <HomePage /> : <Navigate to="/login" />}
  />
  <Route
    path="/signup"
    element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
  />
  <Route
    path="/login"
    element={!authUser ? <LoginPage /> : <Navigate to="/" />}
  />
  <Route path="/settings" element={<SettingPage />} />
  <Route
    path="/profile"
    element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
  />
</Routes>
<Toaster />
      </div>

  );
};

export default App;
