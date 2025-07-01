import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Carousel from '../components/Carousel'; // Re-introducing Carousel

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      redirectToDashboard(user.role);
    }
  }, [isAuthenticated, user, navigate]);

  const redirectToDashboard = (role) => {
    const roleDashboardMap = {
      lead: '/lead-dashboard',
      manager: '/manager-dashboard',
      hr: '/hr-dashboard',
      superadmin: '/superadmin-dashboard',
      employee: '/employee-dashboard',
    };
    navigate(roleDashboardMap[role] || '/employee-dashboard');
  };

  const speakGreeting = (name) => {
    if ('speechSynthesis' in window) {
      const greeting = `Good ${getGreetingTime()}, ${name}, you have successfully logged into the portal.`;
      const utterance = new SpeechSynthesisUtterance(greeting);
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn('Speech synthesis not supported in this browser.');
    }
  };

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      const loggedInUser = await login(email, password);
      if (loggedInUser) {
        // In a real app, "Remember Me" would influence token expiry or session type
        console.log("Remember Me:", rememberMe);
        speakGreeting(loggedInUser.name);
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Styles object now primarily for form elements and specific UI components within the form column
  const styles = {
    // pageContainer, leftColumn, rightColumn, logoText are removed as they are superseded by
    // pageStyle, carouselColumnStyle, formColumnStyle, and mainLogoTextStyle respectively.

    formContainer: { // This is used by the JSX: <div style={styles.formContainer}>
      maxWidth: '400px',
      width: '100%',
      margin: '0 auto',
    },
    welcomeHeader: {
      fontSize: '2.2em',
      fontWeight: '600',
      color: '#333',
      marginBottom: '10px',
      fontFamily: "'Segoe UI', sans-serif",
    },
    welcomeSubHeader: {
      fontSize: '1em',
      color: '#666',
      marginBottom: '30px',
      fontFamily: "'Segoe UI', sans-serif",
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#555',
      fontWeight: '500',
      fontSize: '0.95em',
      fontFamily: "'Segoe UI', sans-serif",
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      marginBottom: '20px',
      border: '1px solid #ddd',
      borderRadius: '4px', // Slightly rounded corners for inputs
      boxSizing: 'border-box',
      fontSize: '1em',
      fontFamily: "'Segoe UI', sans-serif",
      transition: 'border-color 0.3s ease',
    },
    // inputFocus: { borderColor: '#007bff' }, // Would need event handlers to toggle class/style
    formOptions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      fontSize: '0.9em',
      fontFamily: "'Segoe UI', sans-serif",
    },
    rememberMeLabel: {
      marginLeft: '5px',
      color: '#555',
    },
    forgotPasswordLink: {
      color: '#007bff',
      textDecoration: 'none',
    },
    // forgotPasswordLinkHover: { textDecoration: 'underline' },
    loginButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff', // Blue button matching theme
      color: 'white',
      border: 'none',
      borderRadius: '4px', // Slightly rounded corners for button
      cursor: 'pointer',
      fontSize: '1.1em',
      fontWeight: '500',
      fontFamily: "'Segoe UI', sans-serif",
      transition: 'background-color 0.3s ease',
    },
    // loginButtonHover: { backgroundColor: '#0056b3' },
    errorText: {
      color: 'red',
      marginBottom: '15px',
      textAlign: 'center',
      fontFamily: "'Segoe UI', sans-serif",
    },
    signUpLinkContainer: {
      textAlign: 'center',
      marginTop: '30px',
      fontSize: '0.95em',
      fontFamily: "'Segoe UI', sans-serif",
      color: '#555',
    },
    signUpLink: {
      color: '#007bff',
      fontWeight: 'bold',
      textDecoration: 'none',
    },
    // signUpLinkHover: { textDecoration: 'underline' },
  };

  // Function to handle input focus for dynamic border styling (optional enhancement)
  // const handleInputFocus = (e) => e.target.style.borderColor = '#007bff';
  // const handleInputBlur = (e) => e.target.style.borderColor = '#ddd';

  // Styles for the new layout
  const pageStyle = { // Renamed from old styles.pageContainer
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5', // Light grey page background
    padding: '20px',
    fontFamily: "'Segoe UI', sans-serif", // Apply base font family
  };

  const loginBoxStyle = { // New style for the main white box
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  };

  const carouselColumnStyle = { // Renamed from old styles.leftColumn
    width: '50%',
    padding: '30px', // Adjusted padding
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)', // Keep if carousel needs dark bg
    // color: 'white', // If text needs to be white on dark bg
  };

  const formColumnStyle = { // Renamed from old styles.rightColumn
    width: '50%',
    padding: '40px 50px', // Adjusted padding
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff', // Ensure this side is white
  };

  // const formContainerStyle = { // This was consolidated into styles.formContainer
  //   maxWidth: '400px',
  //   width: '100%',
  //   margin: '0 auto',
  // };

  // Logo and Icon styles remain specific to their use
  const logoWithIconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  const hrIconStyle = {
    fontSize: '2.5rem',
    marginRight: '10px',
    color: '#007bff',
  };

  const mainLogoTextStyle = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#333',
  };

  // Overall page container to center the login box
  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5', // Light grey page background
    padding: '20px',
  };

  // The main login box holding carousel and form
  const loginBoxStyle = {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px', // Max width of the login box
    backgroundColor: '#ffffff', // White background for the box
    borderRadius: '10px', // Rounded corners for the box
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', // Important for keeping children within rounded corners
  };

  // Column for the carousel
  const carouselColumnStyle = {
    width: '50%', // Carousel takes half the width of loginBoxStyle
    // backgroundColor: '#e9ecef', // Optional: Slight off-white if needed
    padding: '20px', // Padding around carousel
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  // Column for the form
  const formColumnStyle = {
    width: '50%',
    padding: '40px', // More padding for the form area
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  // Remove the old pageContainer and direct column styles if they conflict
  // styles.pageContainer, styles.leftColumn, styles.rightColumn might need to be removed or merged

  return (
    <div style={pageStyle}> {/* Outer container for centering */}
      <div style={loginBoxStyle}> {/* The main white box */}
        {/* Carousel Column */}
        <div style={carouselColumnStyle}>
          <Carousel />
        </div>

        {/* Form Column */}
        <div style={formColumnStyle}>
          <div style={styles.formContainer}> {/* existing formContainer centers the content */}
            {/* Logo and HR Icon */}
            <div style={logoWithIconStyle}>
              <span style={hrIconStyle}>👥</span> {/* HR Icon Placeholder */}
              <h1 style={mainLogoTextStyle}>EmpowerFlow</h1>
            </div>

            <h2 style={styles.welcomeHeader}>Welcome Back!</h2>
          <p style={styles.welcomeSubHeader}>Login to your account</p>
          {error && <p style={styles.errorText}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" style={styles.label}>Email address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your email"
                // onFocus={handleInputFocus} onBlur={handleInputBlur}
              />
            </div>
            <div>
              <label htmlFor="password" style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your password"
                // onFocus={handleInputFocus} onBlur={handleInputBlur}
              />
            </div>
            <div style={styles.formOptions}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type="checkbox" id="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <label htmlFor="rememberMe" style={styles.rememberMeLabel}>Remember Me</label>
              </div>
              <Link to="/forgot-password" style={styles.forgotPasswordLink}>Forgot Password?</Link>
            </div>
            <button type="submit" disabled={isLoggingIn} style={styles.loginButton}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p style={styles.signUpLinkContainer}>
            Don't have an account? <Link to="/signup" style={styles.signUpLink}>Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
