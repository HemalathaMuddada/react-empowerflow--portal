import React from 'react';

const KPICard = ({ title, value, icon, color = '#007bff', description }) => {
  const cardStyle = {
    backgroundColor: color,
    color: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    minWidth: '200px', // Ensure cards have a decent width
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between', // Pushes description to bottom if available
    height: '150px', // Fixed height for uniformity
  };

  const titleStyle = {
    fontSize: '1.1em',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
  };

  const valueStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    margin: '0 0 10px 0',
  };

  const iconStyle = {
    fontSize: '1.5em', // If using font icons or SVGs
    position: 'absolute',
    top: '15px',
    right: '15px',
    opacity: '0.7',
  };

  const descriptionStyle = {
    fontSize: '0.85em',
    opacity: '0.9',
    marginTop: 'auto', // Pushes to bottom if card is flex column
  };


  return (
    <div style={{...cardStyle, position: 'relative'}}> {/* Added position relative for icon */}
      {icon && <span style={iconStyle}>{icon}</span>} {/* Placeholder for icon */}
      <div>
        <h3 style={titleStyle}>{title}</h3>
        <p style={valueStyle}>{value}</p>
      </div>
      {description && <p style={descriptionStyle}>{description}</p>}
    </div>
  );
};

export default KPICard;
