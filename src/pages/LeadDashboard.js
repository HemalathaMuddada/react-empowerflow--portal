import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import KPICard from '../components/KPICard';
import { useAuth } from '../contexts/AuthContext';

const LeadDashboard = () => {
  const { user } = useAuth();

  const kpiData = [
    { title: 'Project Progress', value: '75%', color: '#17a2b8', description: 'Current lead project status', icon: '🚀' },
    { title: 'Team Tasks Due', value: '6', color: '#ffc107', description: 'Tasks for your team this week', icon: '🎯' },
    { title: 'Mentorship Hours', value: '4 Hrs', color: '#28a745', description: 'Logged this month', icon: '🧑‍🏫' },
    { title: 'Code Reviews Pending', value: '2', color: '#dc3545', description: 'Awaiting your review', icon: '🔍' },
  ];

  return (
    <DashboardLayout>
      <div style={styles.headerContainer}>
        <h1 style={styles.dashboardTitle}>Lead Dashboard</h1>
        <p style={styles.welcomeMessage}>Hi {user?.name}! Lead your team and projects to success.</p>
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
          <h2 style={styles.widgetTitle}>Project Milestones</h2>
          <p>Placeholder for upcoming project milestones and deadlines.</p>
        </div>
        <div style={styles.widget}>
          <h2 style={styles.widgetTitle}>Team Collaboration</h2>
          <p>Placeholder for team communication or shared document links.</p>
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

export default LeadDashboard;
