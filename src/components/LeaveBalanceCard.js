import React from 'react';

const LeaveBalanceCard = ({ type, available, total, icon, unit }) => { // Added unit to props
  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)', // Slightly more pronounced shadow
    // textAlign: 'left', // Align text to left as per common card UIs
    minWidth: '220px', // Adjusted minWidth
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Helps if there's a link/action at bottom
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
  };

  const iconStyle = {
    fontSize: '1.8em', // Icon can be smaller, or part of the type text line
    color: '#007bff',
    marginRight: '10px',
  };

  const typeStyle = { // Leave Type Name
    fontSize: '1.1em', // Slightly larger
    fontWeight: '600',
    color: '#343a40', // Darker text
    margin: 0,
  };

  const balanceDetailsStyle = {
    textAlign: 'center', // Center the numbers
    marginBottom: '10px',
  };

  const availableValueStyle = { // The "10" in "10 Available"
    fontSize: '2.8em', // Very prominent
    fontWeight: 'bold',
    color: '#007bff', // Primary theme color for emphasis
    lineHeight: '1.1',
  };

  const availableTextStyle = { // The "Available" text
    fontSize: '0.9em',
    color: '#6c757d',
    display: 'block', // Make it appear below the number
    marginTop: '2px',
  };

  const totalTextStyle = { // "Total: X Days"
    fontSize: '0.9em',
    color: '#6c757d',
    textAlign: 'center', // Center this text
    marginTop: '10px',
  };


  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        <h4 style={typeStyle}>{type}</h4>
      </div>
      <div style={balanceDetailsStyle}>
        <div style={availableValueStyle}>{available}</div>
        {/* Conditionally show "Available" or the unit for LOP */}
        <div style={availableTextStyle}>{unit ? unit : 'Available'}</div>
      </div>
      {/* Conditionally show "Total" if it exists, otherwise it's handled by unit */}
      {total !== undefined && !unit && <div style={totalTextStyle}>Total: {total} Days</div>}
    </div>
  );
};

export default LeaveBalanceCard;
