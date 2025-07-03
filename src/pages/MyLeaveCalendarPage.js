import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { getLeaveHistory } from '../services/leaveService';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// import './MyLeaveCalendarPage.css'; // We would create and use this for deeper styling

const localizer = momentLocalizer(moment);

const MyLeaveCalendarWidget = () => { // Renamed component for clarity if used as a widget
  const [myEventsList, setMyEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date()); // To control the displayed month

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        setError(null);
        const leaveHistory = await getLeaveHistory();
        const events = leaveHistory
          .filter(leave => leave.status === 'Approved' || leave.status === 'Pending')
          .map(leave => {
            const endDate = moment(leave.endDate).add(1, 'day').toDate();
            return {
              id: leave.id,
              title: leave.type, // Simpler title for the calendar view as per image
              start: new Date(leave.startDate),
              end: endDate,
              allDay: true,
              resource: leave,
            };
          });
        setMyEventsList(events);
      } catch (err) {
        console.error("Failed to fetch leave history for calendar:", err);
        setError('Failed to load leave data.');
      } finally {
        setLoading(false);
      }
    };
    fetchLeaves();
  }, []);

  const eventStyleGetter = (event, start, end, isSelected) => {
    let backgroundColor = '#3174ad'; // Default
    let borderColor = '#3174ad';

    if (event.resource) {
      switch (event.resource.status) {
        case 'Approved':
          backgroundColor = 'rgba(76, 175, 80, 0.1)'; // Light green background (image-like)
          borderColor = '#4CAF50'; // Green border
          break;
        case 'Pending':
          backgroundColor = 'rgba(255, 152, 0, 0.1)'; // Light orange background
          borderColor = '#FF9800'; // Orange border
          break;
        default:
          backgroundColor = 'rgba(158, 158, 158, 0.1)'; // Light grey
          borderColor = '#9E9E9E'; // Grey border
      }
    }
    const style = {
      backgroundColor,
      borderRadius: '4px', // Slightly rounded corners for events
      opacity: 1,
      color: borderColor, // Text color same as border for better visibility
      border: `1px solid ${borderColor}`,
      borderLeft: `3px solid ${borderColor}`, // Prominent left border
      display: 'block',
      padding: '3px 5px',
      fontSize: '0.75em', // Smaller font size for events in month view
      fontWeight: '500',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
    };
    return {
      style: style,
    };
  };

  // Custom Toolbar to match the image's look and feel for navigation
  const CustomToolbar = (toolbar) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };
    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };
    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };
    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span style={styles.toolbarLabel}>
          My Calendar <span style={styles.toolbarDateText}>{date.format('MMMM YYYY')}</span>
        </span>
      );
    };

    return (
      <div style={styles.toolbarContainer}>
        <div style={styles.toolbarLeft}>
          <button style={styles.todayButton} onClick={goToCurrent}>Today</button>
        </div>
        <div style={styles.toolbarCenter}>
          <button style={styles.arrowButton} onClick={goToBack}>{'<'}</button>
          {label()}
          <button style={styles.arrowButton} onClick={goToNext}>{'>'}</button>
        </div>
        <div style={styles.toolbarRight}>
          {/* View switcher can be added here if needed, image implies month view only for this widget */}
        </div>
      </div>
    );
  };


  if (loading) {
    return <div style={styles.loadingContainer}>Loading leave calendar...</div>;
  }

  if (error) {
    return <div style={styles.errorContainer}>{error}</div>;
  }

  return (
    <div style={styles.widgetContainer}>
      {/* <h3 style={styles.sectionTitle}>My Leave Calendar</h3> */}
      {/* The title "My Calendar" seems to be part of the Toolbar in the image */}
      <div style={styles.calendarWrapper} id="leaveCalendarWidget">
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }} // Make calendar fill wrapper height
          eventPropGetter={eventStyleGetter}
          views={['month']} // Only month view as per image
          defaultView="month"
          toolbar={CustomToolbar} // Use custom toolbar
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          popup // For handling overflow events nicely
          components={{
            // month: { header: CustomMonthHeader }, // For further styling day headers
            // dateCellWrapper: CustomDateCellWrapper, // For styling date cells
          }}
        />
      </div>
      <div style={styles.legendContainer}>
        <div style={styles.legendItem}>
          <span style={{...styles.legendColorBox, borderLeft: '3px solid #4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)'}}></span> Approved
        </div>
        <div style={styles.legendItem}>
          <span style={{...styles.legendColorBox, borderLeft: '3px solid #FF9800', backgroundColor: 'rgba(255, 152, 0, 0.1)'}}></span> Pending
        </div>
      </div>
    </div>
  );
};

// Styles need significant refinement to match the image.
// This would typically be done in a dedicated CSS file.
// For example: ./MyLeaveCalendarPage.css and then import it.
// #leaveCalendarWidget .rbc-header { ... }
// #leaveCalendarWidget .rbc-date-cell { ... }

const styles = {
  widgetContainer: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    height: '100%', // Important for the calendar to fill space
  },
  // sectionTitle: {
  //   fontSize: '1.1em',
  //   fontWeight: '600',
  //   color: '#333',
  //   marginBottom: '15px',
  // },
  calendarWrapper: {
    flexGrow: 1, // Allows calendar to take available vertical space
    minHeight: '450px', // Minimum height for the calendar
    // The following styles would ideally be in a CSS file targeting react-big-calendar classes
    // For example:
    // '.rbc-month-view': { border: 'none' },
    // '.rbc-header': { borderBottom: '1px solid #ddd', padding: '10px 0', textAlign: 'center', fontWeight: '500' },
    // '.rbc-date-cell': { textAlign: 'right', padding: '5px' },
    // '.rbc-off-range-bg': { backgroundColor: '#f9f9f9' },
    // '.rbc-today': { backgroundColor: '#eaf6ff' },
  },
  toolbarContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0px', // Padding adjusted to match image
    marginBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  toolbarLeft: {
    flex: 1,
  },
  toolbarCenter: {
    flex: 2,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toolbarRight: {
    flex: 1,
    textAlign: 'right',
  },
  toolbarLabel: {
    fontSize: '1.2em', // Slightly larger for "My Calendar October 2023"
    fontWeight: '500', // Medium weight
    color: '#4A4A4A', // Dark grey, not quite black
    margin: '0 10px',
  },
  toolbarDateText: { // Specific style for the "MMMM YYYY" part if needed
    fontWeight: '600', // Bolder for the date part
    color: '#333',
  },
  arrowButton: { // For < >
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#555', // Dark grey for arrows
    fontSize: '1.4em', // Larger for better visibility of arrows
    padding: '0 10px', // Minimal padding
    fontWeight: 'bold',
  },
  todayButton: { // For "Today"
    background: '#f0f0f0', // Light grey background
    border: '1px solid #dcdcdc', // Slightly darker grey border
    borderRadius: '4px',
    padding: '6px 12px',
    cursor: 'pointer',
    color: '#333',
    fontSize: '0.9em',
    fontWeight: '500',
  },
  loadingContainer: {
    padding: '20px',
    textAlign: 'center',
    color: '#555',
    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  errorContainer: {
    padding: '20px',
    textAlign: 'center',
    color: 'red',
    height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  legendContainer: {
    display: 'flex',
    justifyContent: 'flex-start', // Align left as per image
    gap: '20px',
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '0.85em',
    color: '#555',
  },
  legendColorBox: {
    width: '12px', // Smaller legend box
    height: '12px',
    borderRadius: '3px',
    marginRight: '6px',
    display: 'inline-block',
  },
};

export default MyLeaveCalendarWidget; // Exporting with new name
