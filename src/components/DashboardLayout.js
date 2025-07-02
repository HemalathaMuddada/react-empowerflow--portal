import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo'; // Re-use logo if desired

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Voice synthesis for logout (can be kept or removed based on preference for this layout)
  const speakLogoutMessage = (gender) => {
    // ... (implementation retained from previous step but can be condensed if not a focus)
    if ('speechSynthesis' in window) {
      const message = "You have logged out successfully.";
      const utterance = new SpeechSynthesisUtterance(message);
      // Basic voice selection for brevity, can be expanded as before
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(v => v.lang.startsWith('en') && (gender === 'female' ? /female/i.test(v.name) : /male/i.test(v.name)));
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang.startsWith('en'));
      if (selectedVoice) utterance.voice = selectedVoice;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleLogout = async () => {
    const userGender = user?.gender || 'neutral';
    await logout();
    speakLogoutMessage(userGender);
    navigate('/');
  };

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Sidebar navigation items
  const navItems = [
    { name: 'Dashboard', path: '/employee-dashboard', icon: '🏠' }, // Simple emoji icons for now
    { name: 'Leave', path: '/leave', icon: '✈️' },
    { name: 'Payslips', path: '/payslips', icon: '💰' },
    { name: 'Attendance', path: '/attendance', icon: ' clocked_face' }, // clock emoji might not render well, use text or better icon
    { name: 'Tasks', path: '/tasks', icon: '📋' },
    { name: 'Documents', path: '/documents', icon: '📄' },
    { name: 'Helpdesk', path: '/helpdesk', icon: '❓' },
  ];

  return (
    <div style={styles.layoutContainer}> {/* Renamed from dashboardContainer */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarAppName}>EmpowerFlow</h2>
          {/* Or <Logo /> component if you have a smaller version */}
        </div>
        <nav style={styles.sidebarNav}>
          <ul>
            {navItems.map(item => (
              <li key={item.name} style={styles.navItem}>
                <Link to={item.path} style={styles.navLink}>
                  <span style={styles.navIcon}>{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div style={styles.sidebarFooter}>
          {/* Could have a compact user profile or settings link here */}
          <button onClick={handleLogout} style={styles.sidebarLogoutButton}>
            Logout
          </button>
        </div>
      </aside>

      <div style={styles.mainContentWrapper}>
        <header style={styles.contentHeader}>
          {/* This header is now part of the main content area, to the right of the sidebar */}
          {/* It can contain breadcrumbs, page titles, or quick actions */}
          <div style={styles.headerWelcome}>
            {user && (
              <span>
                {getGreetingTime()}, {user.name} ({user.role})
              </span>
            )}
          </div>
          {/* Add other header content here if needed, e.g., search bar, notifications icon */}
        </header>
        <main style={styles.contentArea}>{children}</main> {/* Renamed from content to contentArea */}
        <footer style={styles.contentFooter}> {/* Renamed from footer to contentFooter */}
          <p>&copy; {new Date().getFullYear()} EmpowerFlow. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

const styles = {
  layoutContainer: { // Overall container for sidebar + main content
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '260px', // Standard sidebar width
    backgroundColor: '#2c3e50', // Dark sidebar background
    color: '#ecf0f1', // Light text color for sidebar
    display: 'flex',
    flexDirection: 'column',
    padding: '0px', // No padding, header/nav/footer will manage
    boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  },
  sidebarHeader: {
    padding: '20px 15px',
    textAlign: 'center',
    borderBottom: '1px solid #34495e',
  },
  sidebarAppName: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#ffffff', // White app name
    margin: 0,
  },
  sidebarNav: {
    flexGrow: 1, // Takes available vertical space
    paddingTop: '15px',
  },
  sidebarNav_ul: { // Style for ul if needed, but direct li styling is fine
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    // marginBottom: '5px', // Spacing between items
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#bdc3c7', // Lighter grey for nav links
    textDecoration: 'none',
    fontSize: '1em',
    transition: 'background-color 0.2s ease, color 0.2s ease',
  },
  // navLinkHover: { backgroundColor: '#34495e', color: '#ffffff' }, // Handle with CSS or onMouseEnter/Leave
  navIcon: {
    marginRight: '12px',
    fontSize: '1.2em', // Icon size
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #34495e',
    textAlign: 'center',
  },
  sidebarLogoutButton: {
    backgroundColor: '#e74c3c', // Red for logout
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    fontSize: '1em',
  },
  mainContentWrapper: { // Wrapper for header, main content, and footer to the right of sidebar
    flex: 1, // Takes remaining horizontal space
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f4f6f8', // Light background for content area
  },
  contentHeader: { // Header within the main content area
    backgroundColor: '#ffffff',
    padding: '15px 30px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    justifyContent: 'flex-end', // Align items to the right, like user greeting
    alignItems: 'center',
    // borderBottom: '1px solid #e0e0e0',
  },
  headerWelcome: {
    fontSize: '0.95em',
    color: '#555',
  },
  contentArea: { // Main area for page content
    flex: 1, // Takes available vertical space within mainContentWrapper
    padding: '20px 30px',
    overflowY: 'auto', // Scroll content if it overflows
  },
  contentFooter: { // Footer within the main content area
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e7e7e7',
    fontSize: '0.85em',
    color: '#777',
  },
  // Old styles that might conflict or are superseded:
  // header, headerLeft, headerRight, welcomeMessage, logoutButton, mainArea, content, footer
  // appName (now sidebarAppName)
};

export default DashboardLayout;
