import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import KPICard from '../components/KPICard';
import { useAuth } from '../contexts/AuthContext';

const SuperAdminDashboard = () => {
  const { user } = useAuth();

  const kpiData = [
    { title: 'System Users', value: '250+', color: '#007bff', description: 'Total registered users', icon: '👤' },
    { title: 'Active Sessions', value: '75', color: '#17a2b8', description: 'Users currently online', icon: '💻' },
    { title: 'Platform Health', value: 'Optimal', color: '#28a745', description: 'System status: All Green', icon: '💚' },
    { title: 'Admin Actions Log', value: 'View Log', color: '#6c757d', description: 'Recent admin activities', icon: '🛡️' },
  ];

  return (
    <DashboardLayout>
      <div style={styles.headerContainer}>
        <h1 style={styles.dashboardTitle}>Super Admin Dashboard</h1>
        <p style={styles.welcomeMessage}>Welcome, {user?.name}! Manage and monitor the EmpowerFlow platform.</p>
      </div>

      <div style={styles.kpiGrid}>
        {kpiData.map((kpi, index) => (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            color={kpi.color}
            description={kpi.description}
            icon={kpi.icon}
          />
        ))}
      </div>

      <div style={styles.contentArea}>
        <div style={styles.widget}>
          <h2 style={styles.widgetTitle}>System Configuration</h2>
          <p>Placeholder for links to user management, role settings, system backups, etc.</p>
          {/* Example: <Link to="/superadmin/user-management">User Management</Link> */}
        </div>
        <div style={styles.widget}>
          <h2 style={styles.widgetTitle}>Audit Trails</h2>
          <p>Placeholder for viewing system logs and audit trails.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  headerContainer: {
    marginBottom: '25px',
  },
  dashboardTitle: {
    fontSize: '2em',
    color: '#333',
    fontWeight: '600',
    margin: '0 0 5px 0',
  },
  welcomeMessage: {
    fontSize: '1.1em',
    color: '#555',
  },
  kpiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  contentArea: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  widget: {
    backgroundColor: '#ffffff',
    padding: '20px 25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  widgetTitle: {
    fontSize: '1.3em',
    color: '#333',
    fontWeight: '600',
    marginBottom: '15px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
};

export default SuperAdminDashboard;
