import React from 'react';
import LeaveQuotaSummary from '../components/LeaveQuotaSummary';
import MyLeaveCalendarWidget from './MyLeaveCalendarPage'; // Assuming the adapted calendar is exported as default or MyLeaveCalendarWidget
import UpcomingHolidaysWidget from '../components/UpcomingHolidaysWidget';

const LeaveOverviewPage = () => {
  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContent}>
        {/* Calendar takes the main space */}
        <div style={styles.calendarSection}>
          <MyLeaveCalendarWidget />
        </div>

        {/* Sidebar/Right column for Quotas and Upcoming Holidays */}
        <div style={styles.sidebarSection}>
          <div style={styles.quotaSection}>
            <LeaveQuotaSummary />
          </div>
          <div style={styles.holidaysSection}>
            <UpcomingHolidaysWidget count={3} /> {/* Show 3 upcoming holidays */}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px', // Standard padding, adjust if DashboardLayout handles it
    backgroundColor: '#f4f7f9', // Light background for the page area, matching image
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    minHeight: 'calc(100vh - 60px)', // Assuming a common header height of 60px
  },
  // Optional: If there's a title for the whole "Leave" section above this layout
  // pageTitle: {
  //   fontSize: '1.8em',
  //   color: '#333',
  //   fontWeight: '600',
  //   marginBottom: '20px',
  // },
  mainContent: {
    display: 'flex',
    flexDirection: 'row', // Main axis is row for calendar and sidebar
    gap: '20px', // Space between calendar and sidebar
    flexWrap: 'wrap', // Allow sidebar to wrap on smaller screens
  },
  calendarSection: {
    flex: '2 1 600px', // Calendar takes more space, base width 600px
    minWidth: '300px', // Minimum width before it tries to shrink too much
    display: 'flex', // To allow MyLeaveCalendarWidget to grow
    flexDirection: 'column',
  },
  sidebarSection: {
    flex: '1 1 300px', // Sidebar takes less space, base width 300px
    minWidth: '280px', // Minimum width for sidebar
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // Space between quota and holidays widgets
  },
  quotaSection: {
    // backgroundColor: '#fff', // Background is handled by component
    // borderRadius: '8px',
    // boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  holidaysSection: {
    // backgroundColor: '#fff', // Background is handled by component
    // borderRadius: '8px',
    // boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
};

// Replace YOUR_HEADER_HEIGHT with actual header height if known, e.g., '60px'
// This helps in making the page take up full viewport height below a fixed header.
// If DashboardLayout handles height, this might not be needed.

export default LeaveOverviewPage;
