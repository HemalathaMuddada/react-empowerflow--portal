import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import Logo from '../components/Logo'; // Will use custom styled logo text directly
// import Carousel from '../components/Carousel'; // Carousel is removed in the new design

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

  // Inline styles will be expanded in the styling step
  const styles = {
    pageContainer: {
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
    },
    leftColumn: {
      width: '50%',
      // CSS Gradient placeholder for the background image
      background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      padding: '40px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      textAlign: 'center', // Center text if logo needs more lines
    },
    rightColumn: {
      width: '50%',
      backgroundColor: '#ffffff',
      padding: '40px 60px', // Increased horizontal padding for form aesthetics
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    logoText: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Modern sans-serif
      fontSize: '3.5rem', // Large size as per design
      fontWeight: 'bold', // Bold
      color: '#ffffff', // White color
      letterSpacing: '1px',
      marginBottom: '20px', // Space if there's any text below it, or just for balance
      // textShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)', // Optional: subtle shadow for depth
    },
    // Optional: A tagline or descriptive text below the logo if needed
    // logoTagline: {
    //   fontSize: '1.1rem',
    //   fontWeight: '300',
    //   color: 'rgba(255, 255, 255, 0.85)',
    //   marginTop: '0px',
    // },
    formContainer: {
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
      borderRadius: '8px', // Rounded corners for inputs
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
      borderRadius: '8px', // Rounded corners for button
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

  return (
    <div style={styles.pageContainer}>
      {/* Left Column (Branding) */}
      <div style={styles.leftColumn}>
        <h1 style={styles.logoText}>EmpowerFlow</h1>
      </div>

      {/* Right Column (Form) */}
      <div style={styles.rightColumn}>
        <div style={styles.formContainer}>
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
