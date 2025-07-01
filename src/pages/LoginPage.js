import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Carousel from '../components/Carousel';

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
        console.log("Remember Me:", rememberMe);
        speakGreeting(loggedInUser.name);
      }
    } catch (err) { // Added missing opening brace
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const styles = {
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
      borderRadius: '4px',
      boxSizing: 'border-box',
      fontSize: '1em',
      fontFamily: "'Segoe UI', sans-serif",
      transition: 'border-color 0.3s ease',
    },
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
    loginButton: {
      width: '100%',
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '1.1em',
      fontWeight: '500',
      fontFamily: "'Segoe UI', sans-serif",
      transition: 'background-color 0.3s ease',
    },
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
  };

  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    fontFamily: "'Segoe UI', sans-serif",
  };

  const loginBoxStyle = {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  };

  const carouselColumnStyle = {
    width: '50%',
    padding: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const formColumnStyle = {
    width: '50%',
    padding: '40px 50px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  };

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

  return (
    <div style={pageStyle}>
      <div style={loginBoxStyle}>
        <div style={carouselColumnStyle}>
          <Carousel />
        </div>
        <div style={formColumnStyle}>
          <div style={styles.formContainer}>
            <div style={logoWithIconStyle}>
              <span style={hrIconStyle}>👥</span>
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
    </div>
  );
};

export default LoginPage;
