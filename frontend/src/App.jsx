import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/Login";
import DashboardUser from "./pages/User/Dashboard";
import DashboardAdmin from "./pages/Admin/Dashboard";
import Members from "./pages/Members";
import Settings from "./pages/Settings";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Register from "./pages/Auth/Register";
import VerifyEmail from "./pages/Auth/VerifyEmail";
import useAuthStore from "./store/authStore";
import PardewalaStore from "./pages/PardewalaStore";

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Pardewala Customer Discovery Prototype Store & Dedicated Dashboards */}
      <Route path="/" element={<PardewalaStore />} />
      <Route path="/store" element={<PardewalaStore />} />
      <Route path="/user/dashboard" element={<DashboardUser />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />

      {/* Existing Auth & Protected Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email/:token" element={<VerifyEmail />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/members" element={<Members />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;