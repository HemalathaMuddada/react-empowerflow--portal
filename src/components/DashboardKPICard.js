import React, { useState, useEffect } from 'react'; // Import useState and useEffect
import { Link } from 'react-router-dom'; // Optional: if cards link to other pages

const DashboardKPICard = ({ title, value, unit, icon, description, linkTo, cardColor, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  // Local visibility state for staggering if needed, but parent control is simpler for now
  // const [hasBecomeVisible, setHasBecomeVisible] = useState(false);

  // useEffect(() => {
  //   if (isVisible) {
  //     setHasBecomeVisible(true);
  //   }
  // }, [isVisible]);

  const baseCardStyle = {
    backgroundColor: cardColor || '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    color: cardColor ? '#ffffff' : '#333333',
    position: 'relative',
    opacity: isVisible ? 1 : 0, // Initial state for load-in
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)', // Initial state for load-in
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, opacity 0.4s ease-in-out', // Added opacity and transform
  };

  const hoverCardStyle = {
    transform: 'scale(1.03)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.12)',
  };

  const cardStyle = isHovered ? { ...baseCardStyle, ...hoverCardStyle } : baseCardStyle;

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  };

  const iconStyle = {
    fontSize: '1.8em', // Larger icon
    marginRight: '15px',
    color: cardColor ? 'rgba(255,255,255,0.8)' : '#007bff', // Icon color
  };

  const titleStyle = {
    fontSize: '1em',
    fontWeight: '600',
    margin: 0,
    color: cardColor ? '#ffffff' : '#555555',
  };

  const valueContainerStyle = {
    fontSize: '2em',
    fontWeight: 'bold',
    margin: '5px 0 10px 0', // Space around the value
    color: cardColor ? '#ffffff' : '#007bff', // Value color stands out
  };

  const unitStyle = {
    fontSize: '0.7em',
    marginLeft: '5px',
    fontWeight: 'normal',
  };

  const descriptionStyle = {
    fontSize: '0.85em',
    color: cardColor ? 'rgba(255,255,255,0.9)' : '#777777',
    flexGrow: 1, // Pushes link to bottom if present
    marginBottom: linkTo ? '10px' : '0',
  };

  const linkStyle = {
    marginTop: 'auto', // Pushes link to the bottom
    fontSize: '0.9em',
    fontWeight: '500',
    color: cardColor ? 'rgba(255,255,255,0.95)' : '#007bff',
    textDecoration: 'none',
  };

  // linkStyleHover: { textDecoration: 'underline' }

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={headerStyle}>
        {icon && <span style={iconStyle}>{icon}</span>}
        <h3 style={titleStyle}>{title}</h3>
      </div>
      <div style={valueContainerStyle}>
        {value}
        {unit && <span style={unitStyle}>{unit}</span>}
      </div>
      {description && <p style={descriptionStyle}>{description}</p>}
      {linkTo && (
        <Link to={linkTo} style={linkStyle}>
          View Details &rarr;
        </Link>
      )}
    </div>
  );
};

export default DashboardKPICard;
