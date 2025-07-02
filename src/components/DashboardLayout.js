import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo'; // Re-use logo if desired

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const speakLogoutMessage = (gender) => {
    if ('speechSynthesis' in window) {
      const message = "You have logged out successfully.";
      const utterance = new SpeechSynthesisUtterance(message);
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;
      const lang = 'en-US';

      if (gender === 'female') {
        selectedVoice = voices.find(voice => voice.lang === lang && (voice.name.toLowerCase().includes('female') || /zira|susan|linda|heather|joanna/i.test(voice.name)));
      } else if (gender === 'male') {
        selectedVoice = voices.find(voice => voice.lang === lang && (voice.name.toLowerCase().includes('male') || /david|mark|tom|george/i.test(voice.name)));
      }

      if (!selectedVoice) selectedVoice = voices.find(voice => voice.lang === lang);
      if (!selectedVoice) selectedVoice = voices.find(voice => voice.lang.startsWith('en')) || (voices.length > 0 ? voices[0] : null);

      if (selectedVoice) utterance.voice = selectedVoice;

      if (speechSynthesis.onvoiceschanged !== undefined && voices.length === 0) {
        speechSynthesis.onvoiceschanged = () => {
          const updatedVoices = window.speechSynthesis.getVoices();
          if (gender === 'female') {
            selectedVoice = updatedVoices.find(voice => voice.lang === lang && (voice.name.toLowerCase().includes('female') || /zira|susan|linda|heather|joanna/i.test(voice.name)));
          } else if (gender === 'male') {
            selectedVoice = updatedVoices.find(voice => voice.lang === lang && (voice.name.toLowerCase().includes('male') || /david|mark|tom|george/i.test(voice.name)));
          }
          if (!selectedVoice) selectedVoice = updatedVoices.find(voice => voice.lang === lang);
          if (!selectedVoice) selectedVoice = updatedVoices.find(voice => voice.lang.startsWith('en')) || (updatedVoices.length > 0 ? updatedVoices[0] : null);
          if (selectedVoice) utterance.voice = selectedVoice;
          window.speechSynthesis.speak(utterance);
        };
      } else {
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.warn('Speech synthesis not supported for logout message.');
    }
  };

  const handleLogout = async () => {
    const userGender = user?.gender || 'neutral'; // Get gender before user object is cleared
    await logout();
    speakLogoutMessage(userGender); // Speak message after logout action
    navigate('/'); // Redirect to login page
  };

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          {/* <Logo /> // Optional: Smaller logo here */}
          <h2 style={styles.appName}>EmpowerFlow</h2>
        </div>
        <div style={styles.headerRight}>
          {user && (
            <span style={styles.welcomeMessage}>
              {getGreetingTime()}, {user.name} ({user.role})
            </span>
          )}
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>
      </header>

      <div style={styles.mainArea}>
        {/* Optional Sidebar - for now, content takes full width below header */}
        {/* <nav style={styles.sidebar}>
          <p>Sidebar</p>
          <ul>
            <li><Link to="/employee-dashboard">My Dashboard</Link></li>
            {user?.role === 'manager' && <li><Link to="/manager-dashboard/team">My Team</Link></li>}
            {user?.role === 'admin' && <li><Link to="/admin/settings">Settings</Link></li>}
          </ul>
        </nav> */}
        <main style={styles.content}>{children}</main>
      </div>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} EmpowerFlow. All rights reserved.</p>
      </footer>
    </div>
  );
};

const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8', // Light grey background for the dashboard area
  },
  header: {
    backgroundColor: '#ffffff', // White header
    color: '#333',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1000, // Ensure header is on top
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  appName: {
    fontSize: '1.8em',
    fontWeight: 'bold',
    color: '#007bff', // Primary color for app name
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  welcomeMessage: {
    marginRight: '20px',
    fontSize: '0.95em',
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Red for logout
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9em',
  },
  // logoutButtonHover: { backgroundColor: '#c82333' },
  mainArea: {
    display: 'flex',
    flex: 1, // Takes remaining vertical space
    // paddingTop: '60px', // Adjust if header is fixed and has a fixed height
  },
  // sidebar: {
  //   width: '240px',
  //   backgroundColor: '#343a40', // Dark sidebar
  //   color: 'white',
  //   padding: '20px',
  //   // height: 'calc(100vh - 60px)', // Full height minus header
  //   // position: 'fixed', // If sidebar is fixed
  //   // top: '60px', // Below header
  //   // left: 0,
  // },
  content: {
    flex: 1,
    padding: '20px 30px', // Add padding around content area
    overflowY: 'auto', // Scroll content if it overflows
  },
  footer: {
    textAlign: 'center',
    padding: '15px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e7e7e7',
    fontSize: '0.85em',
    color: '#777',
  }
};

export default DashboardLayout;
