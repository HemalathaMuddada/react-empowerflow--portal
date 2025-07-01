import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Assuming react-router-dom is used
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import Carousel from '../components/Carousel';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role if already authenticated
      // This also handles redirection after successful login if user state updates
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
    navigate(roleDashboardMap[role] || '/employee-dashboard'); // Default to employee dashboard
  };

  const speakGreeting = (name) => {
    if ('speechSynthesis' in window) {
      const greeting = `Good ${getGreetingTime()}, ${name}, you have successfully logged into the portal.`;
      const utterance = new SpeechSynthesisUtterance(greeting);
      // Optional: configure voice, pitch, rate
      // const voices = window.speechSynthesis.getVoices();
      // utterance.voice = voices.find(v => v.lang === 'en-US'); // Example: select an English voice
      // utterance.pitch = 1;
      // utterance.rate = 1;
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
        speakGreeting(loggedInUser.name);
        // Redirection is handled by the useEffect hook watching isAuthenticated and user
      }
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
      setIsLoggingIn(false);
    }
    // setIsLoggingIn(false) will be handled by redirection or error display
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.loginFormContainer}>
        <Logo />
        <Carousel />
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Login to EmpowerFlow</h2>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" disabled={isLoggingIn} style={styles.button}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.signupLink}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

// Basic styles - consider moving to a CSS file or using a styling library
const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
  },
  loginFormContainer: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '700px', // Adjusted to accommodate carousel
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputGroup: {
    marginBottom: '5px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  },
  button: {
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s ease',
  },
  // button:hover (pseudo-selector, handle with CSS file or library)
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  signupLink: {
    marginTop: '20px',
  }
};

export default LoginPage;
