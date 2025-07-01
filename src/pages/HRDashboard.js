import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import KPICard from '../components/KPICard';
import { useAuth } from '../contexts/AuthContext';

const HRDashboard = () => {
  const { user } = useAuth();

  const kpiData = [
    { title: 'Total Employees', value: '152', color: '#6f42c1', description: 'Current headcount', icon: '🏢' },
    { title: 'Open Positions', value: '5', color: '#dc3545', description: 'Active recruitment drives', icon: '🔍' },
    { title: 'New Hires (Month)', value: '7', color: '#20c997', description: 'Onboarded this month', icon: '🎉' },
    { title: 'Pending Onboarding', value: '3', color: '#fd7e14', description: 'Awaiting completion', icon: '📝' },
  ];

  return (
    <DashboardLayout>
      <div style={styles.headerContainer}>
        <h1 style={styles.dashboardTitle}>HR Dashboard</h1>
        <p style={styles.welcomeMessage}>Hello, {user?.name}! Oversee HR operations and employee management.</p>
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
          <h2 style={styles.widgetTitle}>Recruitment Pipeline</h2>
          <p>Placeholder for recruitment tracking and candidate management.</p>
        </div>
        <div style={styles.widget}>
          <h2 style={styles.widgetTitle}>Employee Relations</h2>
          <p>Placeholder for employee feedback, grievances, or engagement metrics.</p>
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

export default HRDashboard;
