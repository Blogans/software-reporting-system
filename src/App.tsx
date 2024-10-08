import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "./context/auth.context";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import VenueList from "./components/venue/VenueList";
import ContactList from "./components/contact/ContactList";
import OffenderList from "./components/offender/OffenderList";
import UserList from "./components/user/UserList";
import Register from "./components/Register";
import Account from "./components/account/Account";
import AppNavbar from "./components/Navbar";
import { usePermissions, PermissionType } from "./util/usePermissions";
import Reporting from "./components/reporting/Reporting";
import BanManagement from "./components/ban/BanReporting";
import WarningManagement from "./components/warning/WarningReporting";
import IncidentReporting from "./components/incident/IncidentReporting.tsx";
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: PermissionType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { user, isLoading } = useAuth();
  const { hasPermission } = usePermissions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/venues"
          element={
            <ProtectedRoute requiredPermission="VIEW_VENUES">
              <VenueList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/contacts"
          element={
            <ProtectedRoute requiredPermission="VIEW_CONTACTS">
              <ContactList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offenders"
          element={
            <ProtectedRoute requiredPermission="MANAGE_OFFENDERS">
              <OffenderList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute requiredPermission="MANAGE_USERS">
              <UserList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/incidents"
          element={
            <ProtectedRoute requiredPermission="VIEW_INCIDENTS">
              <IncidentReporting />
            </ProtectedRoute>
          }
        />
        <Route
          path="/warnings"
          element={
            <ProtectedRoute requiredPermission="VIEW_WARNINGS">
              <WarningManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bans"
          element={
            <ProtectedRoute requiredPermission="VIEW_BANS">
              <BanManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/register" 
        element={
        <Register />} 
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reporting"
          element={
            <ProtectedRoute>
              <Reporting />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
