import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getHolidays } from '../services/holidayService';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Standard Big Calendar CSS

const localizer = momentLocalizer(moment);

const CompanyHolidayCalendarPage = () => {
  const [holidayEvents, setHolidayEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoading(true);
        setError(null);
        const holidaysData = await getHolidays();
        const events = holidaysData.map(holiday => {
          // Adjust end date for full-day events to be inclusive in calendar display
          const eventDate = moment(holiday.date);
          return {
            id: holiday.name + holiday.date, // Simple unique ID
            title: `${holiday.name} (${holiday.type})`,
            start: eventDate.toDate(),
            end: eventDate.add(1, 'day').toDate(), // Make it inclusive for display
            allDay: true,
            resource: holiday, // Store original holiday object
          };
        });
        setHolidayEvents(events);
      } catch (err) {
        console.error("Failed to fetch holidays for calendar:", err);
        setError('Failed to load holiday data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#2a9d8f'; // Default holiday color (teal-ish)
    // Example: Differentiate by holiday type if needed
    if (event.resource && event.resource.type === 'Optional Holiday') {
      backgroundColor = '#e9c46a'; // Lighter color for optional
    } else if (event.resource && event.resource.type === 'National Holiday') {
      backgroundColor = '#d9534f'; // Reddish for National
    }

    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.9,
      color: 'white',
      border: '0px',
      display: 'block',
      padding: '2px 5px',
      fontSize: '0.85em',
      cursor: 'default', // Holidays are usually not interactive like leaves
    };
    return {
      style: style
    };
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Loading company holidays...</div>;
  }

  if (error) {
    return <div style={styles.errorContainer}>{error}</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Company Holiday Calendar</h1>
      <div style={styles.calendarWrapper}>
        <Calendar
          localizer={localizer}
          events={holidayEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }} // Adjust height as needed
          eventPropGetter={eventStyleGetter}
          views={['month', 'agenda']} // Month and agenda view seem most relevant
          popup
          tooltipAccessor={(event) => `${event.title}\nType: ${event.resource.type}`}
        />
      </div>
      <div style={styles.legendContainer}>
        <h3 style={styles.legendTitle}>Legend</h3>
        <div style={styles.legendItem}>
          <span style={{...styles.legendColorBox, backgroundColor: '#d9534f'}}></span> National Holiday
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendColorBox, backgroundColor: '#e9c46a'}}></span> Optional Holiday
        </div>
         {/* Add a general holiday color if not all are National/Optional */}
        <div style={styles.legendItem}>
          <span style={{...styles.legendColorBox, backgroundColor: '#2a9d8f'}}></span> Other Holiday
        </div>
      </div>
    </div>
  );
};

// Reusing and adapting styles from MyLeaveCalendarPage for consistency
const styles = {
  pageContainer: {
    padding: '20px',
    fontFamily: "'Segoe UI', sans-serif",
  },
  pageTitle: {
    fontSize: '1.8em',
    color: '#333',
    fontWeight: '600',
    marginBottom: '25px',
  },
  calendarWrapper: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
  },
  loadingContainer: {
    padding: '20px',
    fontSize: '1.2em',
    textAlign: 'center',
  },
  errorContainer: {
    padding: '20px',
    fontSize: '1.2em',
    textAlign: 'center',
    color: 'red',
  },
  legendContainer: {
    marginTop: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
  },
  legendTitle: {
    fontSize: '1.1em',
    color: '#333',
    fontWeight: '600',
    marginBottom: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    fontSize: '0.9em',
  },
  legendColorBox: {
    width: '15px',
    height: '15px',
    borderRadius: '3px',
    marginRight: '8px',
    display: 'inline-block',
  },
};

export default CompanyHolidayCalendarPage;
