import React, { useState, useEffect } from 'react';
// import React from 'react'; // Duplicate import removed
import DashboardKPICard from '../components/DashboardKPICard';
import { useAuth } from '../contexts/AuthContext';

// Import services
import { getUpcomingHolidays } from '../services/holidayService';
import { getLeaveBalances } from '../services/leaveService';
import { getPendingTasksCount } from '../services/taskService';
import { getPendingRegularizationsCount } from '../services/attendanceService';
import { getPerformanceReviewStatus } from '../services/performanceService';
import { getRecentPayslipStatus } from '../services/payslipService';

const EmployeeDashboard = () => {
  const { user } = useAuth();

  // State for KPI data
  const [upcomingHolidayData, setUpcomingHolidayData] = useState({ value: 'Loading...', description: 'Loading...' });
  const [leaveBalanceData, setLeaveBalanceData] = useState({ value: 'Loading...', description: 'Loading...' });
  const [pendingTasksData, setPendingTasksData] = useState({ value: 'Loading...' });
  const [attendanceRegData, setAttendanceRegData] = useState({ value: 'Loading...' });
  const [performanceData, setPerformanceData] = useState({ value: 'Loading...' });
  const [payslipData, setPayslipData] = useState({ value: 'Loading...' });

  useEffect(() => {
    if (user?.email) {
      // Fetch Upcoming Holiday
      getUpcomingHolidays(1).then(holidays => {
        if (holidays.length > 0) {
          setUpcomingHolidayData({ value: holidays[0].name, description: `On ${new Date(holidays[0].date).toLocaleDateString()}` });
        } else {
          setUpcomingHolidayData({ value: 'None', description: 'No upcoming holidays' });
        }
      }).catch(() => setUpcomingHolidayData({ value: 'N/A', description: 'Error fetching' }));

      // Fetch Leave Balance (Annual)
      getLeaveBalances().then(balances => {
        const annual = balances.find(b => b.type === 'Annual');
        if (annual) {
          setLeaveBalanceData({ value: String(annual.balance), unit: 'days', description: 'Annual leave available' });
        } else {
          setLeaveBalanceData({ value: 'N/A', description: 'Error fetching' });
        }
      }).catch(() => setLeaveBalanceData({ value: 'N/A', description: 'Error fetching' }));

      // Fetch Pending Tasks Count
      getPendingTasksCount(user.email).then(count => {
        setPendingTasksData({ value: String(count), unit: count === 1 ? 'task' : 'tasks' });
      }).catch(() => setPendingTasksData({ value: 'N/A' }));

      // Fetch Pending Attendance Regularizations
      getPendingRegularizationsCount(user.email).then(count => {
        setAttendanceRegData({ value: String(count), unit: count === 1 ? 'request' : 'requests' });
      }).catch(() => setAttendanceRegData({ value: 'N/A' }));

      // Fetch Performance Review Status
      getPerformanceReviewStatus(user.email).then(status => {
        setPerformanceData({ value: status, description: 'Current cycle status' });
      }).catch(() => setPerformanceData({ value: 'N/A', description: 'Error fetching' }));

      // Fetch Recent Payslip Status
      getRecentPayslipStatus(user.email).then(status => {
        setPayslipData({ value: status, description: 'Latest available' });
      }).catch(() => setPayslipData({ value: 'N/A', description: 'Error fetching' }));
    }
  }, [user]);

  // Structure for KPI cards, now using state
  const kpiCardsConfig = [
    {
      title: 'Upcoming Holiday',
      data: upcomingHolidayData,
      icon: '🎉',
      linkTo: '/holidays'
    },
    {
      title: 'Leave Balance',
      data: leaveBalanceData,
      icon: '✈️',
      linkTo: '/leave'
    },
    {
      title: 'Pending Tasks',
      data: pendingTasksData,
      icon: '📋',
      linkTo: '/tasks'
    },
    {
      title: 'Attendance Regularizations',
      data: attendanceRegData,
      icon: '⏱️',
      linkTo: '/attendance' // Link to main attendance page or specific section
    },
    {
      title: 'Performance Review',
      data: performanceData,
      icon: '📈',
      linkTo: '/performance' // Placeholder for a potential performance page
    },
    {
      title: 'Recent Payslips',
      data: payslipData,
      icon: '💰',
      linkTo: '/payslips'
    },
  ];

  return (
    <div>
      <div style={styles.headerContainer}>
        <h1 style={styles.dashboardTitle}>My Dashboard</h1>
      </div>

      <h2 style={styles.sectionTitle}>Quick Overview</h2>
      <div style={styles.kpiGrid}>
        {kpiCardsConfig.map((kpi, index) => (
          <DashboardKPICard
            key={index}
            title={kpi.title}
            value={kpi.data.value}
            unit={kpi.data.unit}
            icon={kpi.icon}
            description={kpi.data.description || (kpi.data.value !== 'Loading...' && kpi.data.value !== 'N/A' ? `${kpi.data.value} ${kpi.data.unit || ''}` : 'View details')}
            linkTo={kpi.linkTo}
          />
        ))}
      </div>

      {/* Placeholder for other dashboard sections as per new design */}
      {/* Example: A section for recent announcements or team updates */}
      <div style={styles.additionalSection}>
        <h2 style={styles.sectionTitle}>Announcements</h2>
        <div style={styles.announcementCard}>
          <p><strong>System Maintenance:</strong> Scheduled for Dec 25th, 2 AM - 4 AM.</p>
          <small>Posted by Admin - Dec 20th</small>
        </div>
         <div style={styles.announcementCard}>
          <p><strong>Year-End Party:</strong> Join us on Dec 28th for the annual celebration!</p>
          <small>Posted by HR - Dec 18th</small>
        </div>
      </div>

    </div>
  );
};

const styles = {
  headerContainer: {
    marginBottom: '20px', // Reduced margin as welcome msg is in layout
  },
  dashboardTitle: {
    fontSize: '1.8em', // Slightly smaller as it's now a sub-page title
    color: '#333',
    fontWeight: '600',
    margin: '0 0 20px 0', // Add some bottom margin
  },
  // welcomeMessage: { // Removed as it's in DashboardLayout
  //   fontSize: '1.1em',
  //   color: '#555',
  // },
  sectionTitle: {
    fontSize: '1.4em',
    color: '#444',
    fontWeight: '600',
    margin: '30px 0 15px 0',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  kpiGrid: {
    display: 'grid',
    // The image suggests 3 cards per row for the main KPIs
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '10px', // Reduced from 30px
  },
  additionalSection: {
    marginTop: '30px',
  },
  announcementCard: {
    backgroundColor: '#fff',
    padding: '15px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    marginBottom: '15px',
  }
  // Styles for other sections like charts, tables, etc., would be added here
};

export default EmployeeDashboard;
