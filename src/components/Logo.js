import React from 'react';

const Logo = () => {
  return (
    <div style={styles.logoContainer}>
      <h1 style={styles.logoText}>EmpowerFlow</h1>
    </div>
  );
};

const styles = {
  logoContainer: {
    padding: '20px 0',
    textAlign: 'center',
  },
  logoText: {
    fontSize: '2.5em',
    fontWeight: 'bold',
    color: '#333', // Or your preferred logo color
    margin: 0,
  }
};

export default Logo;
