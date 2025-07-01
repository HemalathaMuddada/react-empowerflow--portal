import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import KPICard from '../components/KPICard';
import { useAuth } from '../contexts/AuthContext';

const ManagerDashboard = () => {
  const { user } = useAuth();

  const kpiData = [
    { title: 'Team Members', value: '8', color: '#007bff', description: 'Active members in your team', icon: '👥' },
    { title: 'Pending Approvals', value: '4', color: '#ffc107', description: 'Leave/expense requests', icon: '⏳' },
    { title: 'Projects Overview', value: '3 Active', color: '#17a2b8', description: 'Current team projects', icon: '📊' },
    { title: 'Team Performance', value: 'Good', color: '#28a745', description: 'Overall team morale & output', icon: '📈' },
  ];

  return (
    <DashboardLayout>
      <div style={styles.headerContainer}>
        <h1 style={styles.dashboardTitle}>Manager Dashboard</h1>
        <p style={styles.welcomeMessage}>Welcome, {user?.name}! Manage your team and projects effectively.</p>
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
          <h2 style={styles.widgetTitle}>Team Tasks</h2>
          <p>Placeholder for team task management or overview.</p>
          {/* Example: List of high-priority team tasks */}
        </div>
        <div style={styles.widget}>
          <h2 style={styles.widgetTitle}>Quick Links</h2>
           <ul style={styles.quickLinksList}>
            <li style={styles.quickLinkItem}><a href="#/approve-requests">Approve Requests</a></li>
            <li style={styles.quickLinkItem}><a href="#/team-calendar">Team Calendar</a></li>
            <li style={styles.quickLinkItem}><a href="#/assign-task">Assign New Task</a></li>
            <li style={styles.quickLinkItem}><a href="#/reports">Generate Reports</a></li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Re-using similar styles from EmployeeDashboard for consistency, with minor adjustments if needed.
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // Can have multiple columns for widgets
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
   quickLinksList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  quickLinkItem: {
    padding: '10px 0',
    borderBottom: '1px dotted #eee',
  },
};

export default ManagerDashboard;
