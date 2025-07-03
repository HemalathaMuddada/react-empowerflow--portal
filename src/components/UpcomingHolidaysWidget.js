import React, { useState, useEffect } from 'react';
import { getUpcomingHolidays, getHolidays } from '../services/holidayService'; // Assuming getUpcomingHolidays exists

const UpcomingHolidaysWidget = ({ count = 3 }) => { // Default to showing 3 upcoming holidays
  const [upcomingHolidays, setUpcomingHolidays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let holidays;
        // Check if getUpcomingHolidays function is available and use it
        if (typeof getUpcomingHolidays === 'function') {
          holidays = await getUpcomingHolidays(count);
        } else {
          // Fallback: get all holidays and filter/slice manually
          console.warn("getUpcomingHolidays function not found in holidayService, fetching all and filtering.");
          const allHolidays = await getHolidays();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          holidays = allHolidays
            .filter(holiday => new Date(holiday.date) >= today)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, count);
        }
        setUpcomingHolidays(holidays);
      } catch (err) {
        console.error("Failed to fetch upcoming holidays for Widget:", err);
        setError('Could not load upcoming holidays.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchUpcoming();
  }, [count]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Format: "Mon, Jan 1"
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading upcoming holidays...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (upcomingHolidays.length === 0) {
    return (
      <div style={styles.widgetContainer}>
        <h3 style={styles.sectionTitle}>Upcoming Holidays</h3>
        <div style={styles.noData}>No upcoming holidays found.</div>
      </div>
    );
  }

  return (
    <div style={styles.widgetContainer}>
      <h3 style={styles.sectionTitle}>Upcoming Holidays</h3>
      <ul style={styles.holidayList}>
        {upcomingHolidays.map(holiday => (
          <li key={holiday.date + holiday.name} style={styles.holidayItem}>
            <div style={styles.dateBadge}>
              <span style={styles.day}>{new Date(holiday.date).getDate()}</span>
              <span style={styles.month}>{new Date(holiday.date).toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div style={styles.holidayDetails}>
              <span style={styles.holidayName}>{holiday.name}</span>
              <span style={styles.holidayType}>{holiday.type} - {formatDate(holiday.date)}</span>
            </div>
          </li>
        ))}
      </ul>
      {/* Optionally, add a "View All" link if there's a full holiday calendar page */}
      {/* <div style={styles.viewAllLinkContainer}>
        <a href="/leave/holidays" style={styles.viewAllLink}>View Calendar</a>
      </div> */}
    </div>
  );
};

const styles = {
  widgetContainer: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    height: '100%', // To match height of other components in a grid
  },
  sectionTitle: {
    fontSize: '1.1em',
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  holidayList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  holidayItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f5f5f5',
  },
  dateBadge: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eef2f5', // Light background for date badge
    color: '#333',
    borderRadius: '6px',
    padding: '5px 8px',
    marginRight: '12px',
    minWidth: '45px', // Ensure consistent width
    textAlign: 'center',
  },
  day: {
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  month: {
    fontSize: '0.75em',
    textTransform: 'uppercase',
  },
  holidayDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  holidayName: {
    fontSize: '0.95em',
    fontWeight: '500',
    color: '#455a64', // Darker blue-grey for name
  },
  holidayType: {
    fontSize: '0.8em',
    color: '#78909c', // Lighter grey for type/date
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#555',
  },
  error: {
    padding: '20px',
    textAlign: 'center',
    color: 'red',
  },
  noData: {
    padding: '20px 0',
    textAlign: 'center',
    color: '#777',
    fontSize: '0.9em',
  },
  // viewAllLinkContainer: {
  //   marginTop: '15px',
  //   textAlign: 'right',
  // },
  // viewAllLink: {
  //   color: '#007bff',
  //   textDecoration: 'none',
  //   fontSize: '0.9em',
  //   fontWeight: '500',
  // }
};

export default UpcomingHolidaysWidget;
