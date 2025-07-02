import React from 'react';

const LeaveBalanceCard = ({ type, available, total, icon, cardColor }) => {
  const cardStyle = {
    backgroundColor: cardColor || '#f8f9fa', // Light background, can be themed
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    textAlign: 'center',
    minWidth: '180px', // Ensure cards have a decent width
  };

  const iconStyle = {
    fontSize: '2.5em',
    color: '#007bff', // Primary color for icon, can be themed
    marginBottom: '10px',
  };

  const typeStyle = {
    fontSize: '1em',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '5px',
  };

  const availableStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    color: '#28a745', // Green for available, can be themed
    marginBottom: '2px',
  };

  const totalStyle = {
    fontSize: '0.85em',
    color: '#6c757d',
  };

  return (
    <div style={cardStyle}>
      {icon && <div style={iconStyle}>{icon}</div>}
      <div style={typeStyle}>{type}</div>
      <div style={availableStyle}>{available}</div>
      <div style={totalStyle}>of {total} Days</div>
    </div>
  );
};

export default LeaveBalanceCard;
