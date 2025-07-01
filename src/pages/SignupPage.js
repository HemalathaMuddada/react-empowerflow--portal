import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup as apiSignup } from '../services/authService';
import Logo from '../components/Logo';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('employee'); // Default role
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSigningUp(true);

    if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setIsSigningUp(false);
        return;
    }

    try {
      await apiSignup(name, email, password, role);
      setSuccessMessage('Signup successful! Redirecting to login...');
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setRole('employee');

      setTimeout(() => {
        navigate('/'); // Redirect to login page
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to sign up. User might already exist or server error.');
    } finally {
        setIsSigningUp(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.signupFormContainer}>
        <Logo />
        <form onSubmit={handleSubmit} style={styles.form}>
          <h2 style={styles.title}>Create EmpowerFlow Account</h2>
          {error && <p style={styles.error}>{error}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}

          <div style={styles.inputGroup}>
            <label htmlFor="name" style={styles.label}>Full Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
              aria-describedby="nameError"
            />
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              aria-describedby="emailError"
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
              aria-describedby="passwordError"
            />
             {password && password.length > 0 && password.length < 6 && <small id="passwordError" style={styles.inlineError}>Password must be at least 6 characters.</small>}
          </div>

          <div style={styles.inputGroup}>
            <label htmlFor="role" style={styles.label}>Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            >
              <option value="employee">Employee</option>
              <option value="lead">Lead</option>
              <option value="manager">Manager</option>
              {/* HR and SuperAdmin roles are typically assigned, not self-selected during public signup.
                  If needed, these could be enabled or handled by a separate admin interface.
              <option value="hr">HR</option>
              <option value="superadmin">SuperAdmin</option>
              */}
            </select>
          </div>

          <button type="submit" disabled={isSigningUp} style={styles.button}>
            {isSigningUp ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p style={styles.loginLink}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align to top to see form easily if page is long
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
    padding: '20px',
    overflowY: 'auto', // Ensure scrollability if content is too tall
  },
  signupFormContainer: {
    backgroundColor: '#fff',
    padding: '30px 40px', // Adjusted padding
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
    marginTop: '20px', // Add some margin from top
    marginBottom: '20px',
  },
  title: {
    marginBottom: '20px',
    color: '#333',
    fontSize: '1.8em', // Adjusted font size
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px', // Adjusted gap
  },
  inputGroup: {
    marginBottom: '5px',
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    color: '#555',
    fontWeight: '600', // Slightly bolder
    fontSize: '0.95em',
  },
  input: {
    width: '100%',
    padding: '12px', // Increased padding for better touch targets
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
    fontSize: '1em',
  },
  button: {
    padding: '12px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease',
    marginTop: '10px', // Add margin to button
  },
  // button:hover (handle with CSS file or library for pseudo-selectors)
  error: {
    color: '#D8000C', // Darker red for better contrast
    backgroundColor: '#FFD2D2', // Light red background
    marginBottom: '15px', // Increased margin
    padding: '10px',
    border: '1px solid #D8000C',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '0.9em',
  },
  success: {
    color: '#4F8A10', // Darker green
    backgroundColor: '#DFF2BF', // Light green background
    marginBottom: '15px',
    padding: '10px',
    border: '1px solid #4F8A10',
    borderRadius: '4px',
    textAlign: 'center',
    fontSize: '0.9em',
  },
  loginLink: {
    marginTop: '25px', // Increased margin
    fontSize: '0.95em',
  },
  inlineError: {
    color: '#D8000C',
    fontSize: '0.8em',
    display: 'block',
    marginTop: '3px',
  }
};

export default SignupPage;
