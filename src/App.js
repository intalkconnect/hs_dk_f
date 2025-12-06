import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterCompanyPage from "./pages/RegisterCompanyPage";
import DashboardClient from "./pages/DashboardClient";
import DashboardAgent from "./pages/DashboardAgent";
import TicketDetailPage from "./pages/TicketDetailPage";
import { useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register-company" element={<RegisterCompanyPage />} />

      <Route
        path="/client"
        element={
          <PrivateRoute roles={["client", "admin"]}>
            <Layout>
              <DashboardClient />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/agent"
        element={
          <PrivateRoute roles={["agent", "admin"]}>
            <Layout>
              <DashboardAgent />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/tickets/:id"
        element={
          <PrivateRoute roles={["client", "agent", "admin"]}>
            <Layout>
              <TicketDetailPage />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
