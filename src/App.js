import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link as RouterLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LeadDashboard from './pages/LeadDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import HRDashboard from './pages/HRDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

// Placeholder components for unimplemented pages
// const PlaceholderComponent = ({ pageName, additionalInfo = "" }) => { // No longer needed for these pages
    // const { logout } = useAuth();
//     return (
//       <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
//         <h1>{pageName}</h1>
//         {additionalInfo && <p>{additionalInfo}</p>}
//         <p>This page is under construction.</p>
//         <button onClick={logout} style={{padding: '10px 20px', marginTop: '20px', cursor: 'pointer'}}>Logout</button>
//         <br />
//         <RouterLink to="/">Go to Login (if not authenticated)</RouterLink>
//       </div>
//     );
// };
// PlaceholderComponent and specific placeholders are removed as actual components are now used.
// const SignupPagePlaceholder = () => <PlaceholderComponent pageName="Signup Page" />; // Replaced

// const LeadDashboardPlaceholder = () => {
//     const { user } = useAuth();
//     return <PlaceholderComponent pageName="Lead Dashboard" additionalInfo={`Welcome, ${user?.name} (Lead)!`} />;
// }; // Removed orphaned brace
// const ManagerDashboardPlaceholder = () => {
//     const { user } = useAuth();
//     return <PlaceholderComponent pageName="Manager Dashboard" additionalInfo={`Welcome, ${user?.name} (Manager)!`} />;
// }; // Removed orphaned brace
// const HRDashboardPlaceholder = () => {
//     const { user } = useAuth();
//     return <PlaceholderComponent pageName="HR Dashboard" additionalInfo={`Welcome, ${user?.name} (HR)!`} />;
// }; // Removed orphaned brace
// const SuperAdminDashboardPlaceholder = () => {
//     const { user } = useAuth();
//     return <PlaceholderComponent pageName="SuperAdmin Dashboard" additionalInfo={`Welcome, ${user?.name} (SuperAdmin)!`} />;
// }; // Removed orphaned brace
// const EmployeeDashboardPlaceholder = () => {
//     const { user } = useAuth();
//     return <PlaceholderComponent pageName="Employee Dashboard" additionalInfo={`Welcome, ${user?.name} (Employee)!`} />;
// }; // Removed orphaned brace


// ProtectedRoute component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div style={{textAlign: 'center', padding: '50px', fontSize: '1.2em'}}>Loading application state...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    console.warn(`Access Denied: User role ${user.role} not in allowed roles: ${allowedRoles.join(', ')}. Redirecting to default dashboard.`);
    // Fallback to a generic employee dashboard or a specific "access denied" page
    // For now, if a user somehow gets to a route their role doesn't permit, send them to their default.
    // This case should ideally be handled by UI not showing links to unauthorized areas.
     const roleDashboardMap = {
      lead: '/lead-dashboard',
      manager: '/manager-dashboard',
      hr: '/hr-dashboard',
      superadmin: '/superadmin-dashboard',
      employee: '/employee-dashboard',
    };
    return <Navigate to={roleDashboardMap[user.role] || '/'} replace />;
  }

  return children;
};


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/lead-dashboard"
            element={
              <ProtectedRoute allowedRoles={['lead', 'superadmin']}>
                <LeadDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute allowedRoles={['manager', 'superadmin']}>
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hr-dashboard"
            element={
              <ProtectedRoute allowedRoles={['hr', 'superadmin']}>
                <HRDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superadmin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute allowedRoles={['employee', 'lead', 'manager', 'hr', 'superadmin']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route for any unmatched paths - redirect to login or user's dashboard if logged in */}
          <Route path="*" element={<FallbackNavigate />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

const FallbackNavigate = () => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;

  if (isAuthenticated && user) {
    const roleDashboardMap = {
      lead: '/lead-dashboard',
      manager: '/manager-dashboard',
      hr: '/hr-dashboard',
      superadmin: '/superadmin-dashboard',
      employee: '/employee-dashboard',
    };
    return <Navigate to={roleDashboardMap[user.role] || '/employee-dashboard'} replace />;
  }
  return <Navigate to="/" replace />;
};

export default App;
