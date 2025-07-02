import React, { useState } from 'react'; // Added useState
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo'; // Re-use logo if desired

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredPath, setHoveredPath] = useState(null);
  const [openSubmenuKey, setOpenSubmenuKey] = useState(null); // State for open submenu

  const handleParentItemClick = (itemId) => {
    setOpenSubmenuKey(openSubmenuKey === itemId ? null : itemId);
  };

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
    { name: 'Dashboard', path: '/employee-dashboard', icon: '🏠' },
    {
      name: 'Leave',
      icon: '✈️',
      // path: '/leave', // Parent path can still lead to a default view or be non-clickable if it only expands
      // For simplicity, let's make the parent itself navigate to the first sub-item or an overview page.
      // Or, the parent path is just a key and doesn't navigate directly if it only serves to toggle.
      // Let's assume '/leave' is the path for the first sub-item for now or an overview.
      // The main functionality will be in sub-items.
      id: 'leave', // Unique ID for managing open state
      subItems: [
        { name: 'Apply / My Status', path: '/leave', icon: '📝' }, // Default /leave route for main leave page
        { name: 'Holiday Calendar', path: '/leave/calendar', icon: '📅' }, // This could link to a section/tab
        // { name: 'Leave Policy', path: '/leave/policy', icon: '📜' }, // Example for future
        // { name: 'Comp Off', path: '/leave/compoff', icon: '➕' }, // Example for future
      ]
    },
    { name: 'Payslips', path: '/payslips', icon: '💰' },
    { name: 'Attendance', path: '/attendance', icon: '⏰' },
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
          <ul style={styles.sidebarNav_ul}>
            {navItems.map(item => {
              if (item.subItems) {
                // Parent item with submenu
                const isSubmenuOpen = openSubmenuKey === item.id;
                // Check if any sub-item is active to make parent active
                const isParentActive = item.subItems.some(subItem => location.pathname === subItem.path || (subItem.path !== '/' && location.pathname.startsWith(subItem.path)));
                const parentLinkStyle = {
                  ...styles.navLink, // Use navLink for parent styling
                  ...(isParentActive && styles.navLinkActive), // Highlight parent if a child is active
                  ...(hoveredPath === item.id && styles.navLinkHover), // Hover for parent
                  cursor: 'pointer', // Indicate it's clickable
                };

                return (
                  <li key={item.id || item.name} style={styles.navItemParent}>
                    <div
                      style={parentLinkStyle}
                      onClick={() => handleParentItemClick(item.id)}
                      onMouseEnter={() => setHoveredPath(item.id)}
                      onMouseLeave={() => setHoveredPath(null)}
                    >
                      <span style={styles.navIcon}>{item.icon}</span>
                      {item.name}
                      <span style={isSubmenuOpen ? styles.submenuArrowOpen : styles.submenuArrow}>▼</span> {/* Arrow indicator */}
                    </div>
                    {isSubmenuOpen && (
                      <ul style={styles.submenu}>
                        {item.subItems.map(subItem => {
                          const isSubActive = location.pathname === subItem.path || (subItem.path !== '/' && location.pathname.startsWith(subItem.path));
                          const subLinkStyle = {
                            ...styles.navLink, // Base style for sub-items
                            ...styles.subNavLink, // Specific styles for sub-items (e.g., padding)
                            ...(isSubActive && styles.navLinkActive), // Active style for sub-items
                            ...(hoveredPath === subItem.path && styles.navLinkHover), // Hover for sub-items
                          };
                          return (
                            <li key={subItem.name} style={styles.subNavItem}>
                              <Link
                                to={subItem.path}
                                style={subLinkStyle}
                                onMouseEnter={() => setHoveredPath(subItem.path)}
                                onMouseLeave={() => setHoveredPath(null)}
                              >
                                <span style={styles.navIcon}>{subItem.icon || '•'}</span> {/* Sub-item icon or default */}
                                {subItem.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              } else {
                // Regular item without submenu
                const isActive = location.pathname === item.path || (item.path !== '/employee-dashboard' && location.pathname.startsWith(item.path) && item.path !== '/');
                const linkStyle = {
                  ...styles.navLink,
                  ...(isActive && styles.navLinkActive),
                  ...(hoveredPath === item.path && styles.navLinkHover),
                };
                return (
                  <li key={item.name} style={styles.navItem}>
                    <Link
                      to={item.path}
                      style={linkStyle}
                      onMouseEnter={() => setHoveredPath(item.path)}
                      onMouseLeave={() => setHoveredPath(null)}
                    >
                      <span style={styles.navIcon}>{item.icon}</span>
                      {item.name}
                    </Link>
                  </li>
                );
              }
            })}
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
    borderLeft: '3px solid transparent', // For active indicator
  },
  navLinkActive: {
    color: '#ffffff', // White text for active link
    backgroundColor: '#34495e', // Slightly darker background for active link
    fontWeight: '600',
    borderLeft: '3px solid #1abc9c', // Accent color border for active link
  },
  navLinkHover: {
    backgroundColor: '#34495e', // Same as active for this theme, or slightly different
    color: '#ffffff',
  },
  navIcon: {
    marginRight: '12px',
    fontSize: '1.2em',
    flexShrink: 0, // Ensure icon doesn't shrink if text is long
  },
  navItemParent: { // Style for the <li> containing a parent item + submenu
    // No specific styles needed for li itself unless for spacing, which navLink padding handles
  },
  submenuArrow: {
    marginLeft: 'auto', // Push arrow to the right
    fontSize: '0.8em',
    transition: 'transform 0.2s ease-in-out',
  },
  submenuArrowOpen: {
    marginLeft: 'auto',
    fontSize: '0.8em',
    transform: 'rotate(180deg)', // Rotate arrow when open
  },
  submenu: {
    listStyle: 'none',
    padding: '0',
    margin: '0 0 0 20px', // Indent submenu
    backgroundColor: '#23313f', // Slightly different background for submenu section
    overflow: 'hidden', // For potential slide-down animation (not implemented yet)
  },
  subNavItem: {
    // No specific styles needed for li itself
  },
  subNavLink: {
    // Inherits from navLink, specific overrides here
    paddingLeft: '25px', // Further indent sub-item text (icon already has margin)
    fontSize: '0.95em', // Slightly smaller font for sub-items
    color: '#aab8c2', // Slightly dimmer color for sub-items
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
