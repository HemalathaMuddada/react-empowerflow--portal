import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import KPICard from '../components/KPICard';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const kpiData = [
    { title: 'Pending Tasks', value: '3', color: '#17a2b8', description: 'Tasks requiring your attention', icon: '📋' },
    { title: 'Leave Balance', value: '12 Days', color: '#28a745', description: 'Annual paid leave remaining', icon: '✈️' },
    { title: 'Recent Payslips', value: 'View All', color: '#ffc107', description: 'Access your salary slips', icon: '💰' },
    { title: 'Company News', value: '2 New', color: '#6f42c1', description: 'Latest updates', icon: '📰' },
  ];

  return (
    <DashboardLayout>
      <div style={styles.headerContainer}>
        <h1 style={styles.dashboardTitle}>Employee Dashboard</h1>
        <p style={styles.welcomeMessage}>Hello, {user?.name}! Here's what's happening.</p>
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
          <h2 style={styles.widgetTitle}>Quick Actions</h2>
          <ul style={styles.quickLinksList}>
            <li style={styles.quickLinkItem}><a href="#/apply-leave">Apply for Leave</a></li>
            <li style={styles.quickLinkItem}><a href="#/submit-expense">Submit Expense</a></li>
            <li style={styles.quickLinkItem}><a href="#/view-policy">View Company Policies</a></li>
            <li style={styles.quickLinkItem}><a href="#/update-profile">Update Profile</a></li>
          </ul>
        </div>
        <div style={styles.widget}>
          <h2 style={styles.widgetTitle}>Upcoming Holidays</h2>
          <p>No upcoming holidays this week. (Placeholder)</p>
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
    gridTemplateColumns: '1fr', // Single column for now, can be 2fr 1fr for side-by-side widgets
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
    '&:last-child': { // This pseudo-selector won't work directly in inline styles
      borderBottom: 'none',
    }
  },
  // For the last-child, you'd typically use a CSS class or styled-components
  // As a workaround for inline styles, you can map and check index:
  // {kpiData.map((kpi, index, arr) => <li style={{...styles.quickLinkItem, borderBottom: index === arr.length - 1 ? 'none' : '1px dotted #eee' }}>...</li>)}
};

export default EmployeeDashboard;
