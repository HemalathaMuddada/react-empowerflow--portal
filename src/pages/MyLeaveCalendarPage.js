import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getLeaveHistory } from '../services/leaveService';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const MyLeaveCalendarPage = () => {
  const [myEventsList, setMyEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        setError(null);
        const leaveHistory = await getLeaveHistory();
        const events = leaveHistory
          .filter(leave => leave.status === 'Approved' || leave.status === 'Pending') // Show approved and pending
          .map(leave => {
            // Adjust end date for full-day events to be inclusive in calendar display
            // BigCalendar's default for 'end' is exclusive.
            const endDate = moment(leave.endDate).add(1, 'day').toDate();
            return {
              id: leave.id,
              title: `${leave.type} (${leave.status})`,
              start: new Date(leave.startDate),
              end: endDate, // Use adjusted end date
              allDay: true, // Assuming all leaves are full day events for now
              resource: leave, // Store original leave object if needed
            };
          });
        setMyEventsList(events);
      } catch (err) {
        console.error("Failed to fetch leave history for calendar:", err);
        setError('Failed to load leave data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#3174ad'; // Default blue
    if (event.resource) {
      switch (event.resource.status) {
        case 'Approved':
          backgroundColor = '#5cb85c'; // Green
          break;
        case 'Pending':
          backgroundColor = '#f0ad4e'; // Orange
          break;
        default:
          backgroundColor = '#777'; // Grey for other statuses
      }
    }
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
      padding: '2px 5px',
      fontSize: '0.85em'
    };
    return {
      style: style
    };
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Loading leave calendar...</div>;
  }

  if (error) {
    return <div style={styles.errorContainer}>{error}</div>;
  }

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>My Leave Calendar</h1>
      <div style={styles.calendarWrapper}>
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }} // Adjust height as needed
          eventPropGetter={eventStyleGetter}
          views={['month', 'week', 'agenda']} // Add agenda view
          popup // Enable popup for overflowing events in month view
          selectable // Allows selecting dates/slots
          onSelectSlot={(slotInfo) => {
            // console.log('Selected slot:', slotInfo);
            // Potentially open leave application form pre-filled with dates
            // alert(`Selected slot: Start: ${slotInfo.start} End: ${slotInfo.end}`);
          }}
          onSelectEvent={(event) => {
            // console.log('Selected event:', event);
            // Potentially show event details or link to leave history
            // alert(`Leave Type: ${event.title}\nStatus: ${event.resource?.status}\nReason: ${event.resource?.reason}`);
          }}
        />
      </div>
      <div style={styles.legendContainer}>
        <h3 style={styles.legendTitle}>Legend</h3>
        <div style={styles.legendItem}>
          <span style={{...styles.legendColorBox, backgroundColor: '#5cb85c'}}></span> Approved
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendColorBox, backgroundColor: '#f0ad4e'}}></span> Pending
        </div>
        {/* Add other statuses if needed */}
      </div>
    </div>
  );
};

// Basic styles - can be expanded and moved to a CSS file if preferred
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

export default MyLeaveCalendarPage;
