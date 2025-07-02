import React, { useState, useEffect } from 'react';
import { getHolidays } from '../services/holidayService';

const CompanyHolidayCalendarPage = () => {
  const [holidaysList, setHolidaysList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    getHolidays()
      .then(holidays => {
        setHolidaysList(holidays.sort((a, b) => new Date(a.date) - new Date(b.date))); // Sort by date
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch holidays:", err);
        setError('Could not load company holidays. Please try again later.');
        setIsLoading(false);
        setHolidaysList([]);
      });
  }, []);

  const styles = {
    pageContainer: {},
    pageTitle: {
      fontSize: '1.8em',
      color: '#333',
      fontWeight: '600',
      marginBottom: '25px',
    },
    holidayList: {
      listStyle: 'none',
      padding: 0,
    },
    holidayItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 15px', // Increased padding for better visual separation
      borderBottom: '1px solid #f0f0f0',
      backgroundColor: '#fff', // White background for items
      borderRadius: '6px', // Slightly rounded corners for list items
      marginBottom: '8px', // Space between items
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    },
    holidayDate: {
      fontWeight: '500',
      color: '#333',
      minWidth: '150px',
    },
    holidayName: {
      flexGrow: 1,
      color: '#555',
      marginLeft: '15px',
      fontWeight: '500',
    },
    holidayTypeBadge: {
      padding: '4px 10px', // Slightly larger badge
      borderRadius: '12px',
      fontSize: '0.8em',
      fontWeight: '600', // Bolder type
      backgroundColor: '#6c757d', // Neutral grey for holiday type
      color: '#fff', // White text
      marginLeft: '15px',
      whiteSpace: 'nowrap',
    },
    loadingText: {
      fontSize: '1.1em',
      color: '#777',
      textAlign: 'center',
      padding: '40px 0',
    },
    errorText: {
      fontSize: '1.1em',
      color: 'red',
      textAlign: 'center',
      padding: '40px 0',
    }
  };

  if (isLoading) {
    return <div style={styles.loadingText}>Loading Company Holidays...</div>;
  }

  if (error) {
    return <div style={styles.errorText}>{error}</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Company Holiday Calendar</h1>
      {holidaysList.length > 0 ? (
        <ul style={styles.holidayList}>
          {holidaysList.map(holiday => (
            <li key={holiday.date} style={styles.holidayItem}>
              <span style={styles.holidayDate}>
                {new Date(holiday.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={styles.holidayName}>{holiday.name}</span>
              <span style={styles.holidayTypeBadge}>{holiday.type}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.loadingText}>No company holidays found for the current period.</p>
      )}
      {/* TODO: Future enhancement - display as a visual calendar grid */}
    </div>
  );
};

export default CompanyHolidayCalendarPage;
