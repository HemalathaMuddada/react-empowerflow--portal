import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import { getLeaveBalances, getLeaveHistory, applyForLeave, cancelLeaveRequest } from '../services/leaveService';
import { getHolidays } from '../services/holidayService';
import LeaveBalanceCard from '../components/LeaveBalanceCard';

const LeavePage = () => {
  const location = useLocation(); // Get location object

  // State for the leave application form
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // State for displaying data
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]); // This state will be moved to LeaveHistoryPage.js
  // const [holidaysList, setHolidaysList] = useState([]); // This state will be moved to CompanyHolidayCalendarPage.js

  // State for messages and loading
  const [isLoading, setIsLoading] = useState(false); // For form submission primarily
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Tab state is removed as this page will no longer have tabs
  // const [activeTab, setActiveTab] = useState('history');

  // Will be populated from leaveBalances
  const [availableLeaveTypes, setAvailableLeaveTypes] = useState([]);

  // TODO: Modal state for leave application form
  const [showLeaveFormModal, setShowLeaveFormModal] = useState(false);

  // Tab related useEffect removed.

  useEffect(() => {
    // Fetch initial data - ONLY balances and types needed for this page (ApplyLeavePage)
    getLeaveBalances().then(balances => {
      setLeaveBalances(balances);
      const types = balances.map(b => b.type);
      setAvailableLeaveTypes(types.length > 0 ? types : ['Annual', 'Sick', 'Casual', 'Unpaid']);
      if (!leaveType && types.length > 0) {
        setLeaveType(types[0]);
      }
    }).catch(err => {
      console.error("Failed to fetch leave balances/types for ApplyLeavePage:", err);
      setAvailableLeaveTypes(['Annual', 'Sick', 'Casual', 'Unpaid']);
    });

    // History, Holidays fetching removed from here.
  }, []); // Note: leaveType was removed from dependency array as it might cause re-fetch loops if not handled carefully.
          // If default setting of leaveType is critical upon availableTypes change, more complex logic might be needed.
          // For now, setting it once if initially empty is fine.

  // fetchAndUpdateHistory and handleCancelLeave are removed as they belong to LeaveHistoryPage.

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });
    setIsLoading(true);

    if (!leaveType || !startDate || !endDate || !reason) {
      setFormMessage({ type: 'error', text: 'All fields are required.' });
      setIsLoading(false);
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormMessage({ type: 'error', text: 'Start date cannot be after end date.' });
      setIsLoading(false);
      return;
    }

    try {
      const applicationData = { leaveType, startDate, endDate, reason };
      const response = await applyForLeave(applicationData);
      setFormMessage({ type: 'success', text: response.message });
      setLeaveType(availableLeaveTypes.length > 0 ? availableLeaveTypes[0] : '');
      setStartDate('');
      setEndDate('');
      setReason('');
      // fetchAndUpdateHistory(); // This will be called on LeaveHistoryPage after navigation or event
      setShowLeaveFormModal(false);
    } catch (error) {
      setFormMessage({ type: 'error', text: error.message || 'Failed to apply for leave. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for Leave Application Form (to be moved to a modal)
  const renderLeaveApplicationForm = () => (
    <form onSubmit={handleFormSubmit} style={styles.form}>
      {/* ... (existing form JSX: leaveType select, date inputs, reason textarea, message, button) ... */}
      {/* This will be copied into the modal component later */}
      <div style={styles.formGroup}>
        <label htmlFor="leaveType" style={styles.label}>Leave Type:</label>
        <select id="leaveType" value={leaveType} onChange={(e) => setLeaveType(e.target.value)} required style={styles.input}>
          <option value="">-- Select Leave Type --</option>
          {availableLeaveTypes.map(type => (<option key={type} value={type}>{type}</option>))}
        </select>
      </div>
      <div style={styles.formRow}>
        <div style={{...styles.formGroup, ...styles.formGroupHalf}}><label htmlFor="startDate" style={styles.label}>Start Date:</label><input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={styles.input}/></div>
        <div style={{...styles.formGroup, ...styles.formGroupHalf}}><label htmlFor="endDate" style={styles.label}>End Date:</label><input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={styles.input}/></div>
      </div>
      <div style={styles.formGroup}><label htmlFor="reason" style={styles.label}>Reason:</label><textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required rows="4" style={{...styles.input, ...styles.textarea}}/></div>
      {formMessage.text && (<p style={{ ...styles.message, color: formMessage.type === 'error' ? 'red' : (formMessage.type === 'success' ? 'green' : 'blue') }}>{formMessage.text}</p>)}
      <button type="submit" style={styles.submitButton} disabled={isLoading}>{isLoading ? 'Submitting...' : 'Apply for Leave'}</button>
    </form>
  );


  return (
    <div style={styles.pageContainer}>
      <div style={styles.topActionRow}>
        <h1 style={{...styles.pageTitle, marginBottom: '0', marginRight: 'auto' }}>Leave Management</h1> {/* Title on left */}
        <div style={styles.filtersAndActions}>
          {/* Placeholder for Year Filter */}
          <select style={{...styles.input, ...styles.yearFilter}}>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          {/* Placeholder for Download Button */}
          <button style={{...styles.actionButton, marginLeft: '10px'}} onClick={() => console.log('Download clicked')}>Download</button>
          <button onClick={() => setShowLeaveFormModal(true)} style={{...styles.applyLeaveButton, marginLeft: '10px'}}>
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Top Section: Leave Balance Summary Cards */}
      <section style={{...styles.section, ...styles.balanceSummaryContainerStyle, marginTop: '20px' }}>
        {leaveBalances.length > 0 ? (
          leaveBalances.map(balance => (
            <LeaveBalanceCard
              key={balance.type}
              type={balance.type} // Pass raw type, card can append "Leave" if needed
              available={balance.balance !== undefined ? balance.balance : balance.value} // Handle LOP structure
              total={balance.total}
              unit={balance.unit} // For LOP
              icon={balance.type === 'Annual' ? '🏖️' : balance.type === 'Sick' ? '🤒' : balance.type === 'Casual' ? '🚶' :
                    balance.type === 'Compensatory Off' ? '➕': balance.type === 'Maternity' ? '🤰':
                    balance.type === 'Paternity' ? '👨‍🍼': balance.type === 'LOP Taken' ? '📉':
                    balance.type === 'Bereavement' ? '🖤' : '📄'}
            />
          ))
        ) : (
          <p>Loading balances or no balances found...</p>
        )}
      </section>

      {/* Modal for Leave Application Form */}
      {showLeaveFormModal && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalContent}>
            <button onClick={() => setShowLeaveFormModal(false)} style={styles.closeModalButton}>&times;</button>
            <h2 style={styles.sectionTitle}>Apply for Leave</h2>
            {renderLeaveApplicationForm()}
            {/* <button onClick={() => setShowLeaveFormModal(false)} style={styles.cancelFormButton}>Cancel</button> // Alternative to close button */}
          </div>
        </div>
      )}

      {/* Tabbed Interface Section - To be moved to respective pages */}
      {/*
      <section style={styles.section}>
        <div style={styles.tabsHeader}>
          <button
            style={activeTab === 'history' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton}
            onClick={() => setActiveTab('history')}>
            Leave History
          </button>
          <button
            style={activeTab === 'calendar' ? {...styles.tabButton, ...styles.activeTab} : styles.tabButton}
            onClick={() => setActiveTab('calendar')}>
            Holiday Calendar
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'history' && (
            <div>
              {leaveHistory.length > 0 ? (
                <div style={styles.historyTableContainer}>
                  <table style={styles.historyTable}>
                    <thead><tr><th style={styles.th}>ID</th><th style={styles.th}>Type</th><th style={styles.th}>Dates</th><th style={styles.th}>Days</th><th style={styles.th}>Reason</th><th style={styles.th}>Status</th><th style={styles.th}>Applied On</th><th style={styles.th}>Actions</th></tr></thead>
                    <tbody>
                      {leaveHistory.map(item => (
                        <tr key={item.id}><td style={styles.td}>{item.id}</td><td style={styles.td}>{item.type}</td><td style={styles.td}>{item.startDate} to {item.endDate}</td><td style={styles.td}>{item.days}</td><td style={styles.td}><span style={styles.reasonText}>{item.reason}</span></td><td style={styles.td}><span style={{...styles.statusBadge, ...styles[item.status?.toLowerCase()]}}>{item.status}</span></td><td style={styles.td}>{item.appliedOn || 'N/A'}</td><td style={styles.td}>{item.status === 'Pending' && (<button onClick={() => handleCancelLeave(item.id)} style={styles.cancelButton} disabled={isLoading}>Cancel</button>)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (<p>No leave history found or still loading...</p>)}
            </div>
          )}
          {activeTab === 'calendar' && (
            <div>
              {holidaysList.length > 0 ? (
                <ul style={styles.holidayList}>
                  {holidaysList.map(holiday => (
                    <li key={holiday.date} style={styles.holidayItem}>
                      <span style={styles.holidayDate}>{new Date(holiday.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}:</span>
                      <span style={styles.holidayName}>{holiday.name}</span>
                      <span style={styles.holidayTypeBadge}>{holiday.type}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading holidays or no holidays to display.</p>
              )}
            </div>
          )}
        </div>
      </section>
      */}
    </div>
  );
};

// Basic styles - can be expanded and moved to a CSS file or module
const styles = {
  pageContainer: {
    padding: '0px',
  },
  pageTitle: {
    fontSize: '1.8em',
    color: '#333',
    fontWeight: '600',
    marginBottom: '25px',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '20px 25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '25px',
  },
  sectionTitle: {
    fontSize: '1.4em',
    color: '#333',
    fontWeight: '600',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px', // Creates space between half-width items
  },
  formGroupHalf: {
    flex: 1, // Each takes half the space in a row
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    color: '#555',
    fontWeight: '500',
    fontSize: '0.9em',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    boxSizing: 'border-box',
    fontSize: '1em',
    fontFamily: "'Segoe UI', sans-serif",
  },
  textarea: {
    resize: 'vertical', // Allow vertical resize
  },
  submitButton: {
    padding: '10px 18px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s ease',
  },
  message: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '0.95em',
  },
  balancesContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Responsive grid
    gap: '15px',
  },
  balanceItem: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '6px',
    border: '1px solid #eef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceType: {
    fontWeight: '500',
    color: '#333',
  },
  balanceValue: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  // Styles for new layout
  balanceSummaryContainerStyle: {
    display: 'grid', // Changed to grid
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Responsive grid for cards
    // For a fixed number of columns, e.g., 4:
    // gridTemplateColumns: 'repeat(4, 1fr)',
    // To match image which seems to have 3 cards per row and then wraps:
    // gridTemplateColumns: 'repeat(3, 1fr)', // This might be too rigid if less than 3 cards.
    // auto-fit with minmax is generally more flexible for varying numbers of cards.
    // The image seems to have wider cards than 200px if only 3 are shown. Let's try minmax(240px, 1fr).
    // gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  topActionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  filtersAndActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  yearFilter: { // Style for the year filter select
    padding: '8px 10px', // Adjust padding to match buttons
    height: 'auto', // Ensure height consistency if needed
    minWidth: '100px',
    // Inherits other input styles which is good
  },
  actionButton: { // Generic style for buttons like Download
    padding: '8px 15px',
    backgroundColor: '#6c757d', // Secondary button color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em', // Slightly smaller than primary apply button
    fontWeight: '500',
  },
  // applyButtonContainer style removed as button is now in topActionRow
  applyLeaveButton: { // Style might need slight adjustment if it was too large before
    padding: '8px 15px', // Standardized padding with other action buttons
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
  },
  modalBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure modal is on top
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '25px 30px',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '500px', // Max width for the modal
    position: 'relative', // For close button positioning
  },
  closeModalButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5em',
    cursor: 'pointer',
    padding: '5px',
    lineHeight: '1',
  },
  tabsHeader: {
    display: 'flex',
    marginBottom: '0px', // Remove margin if border is on section
    borderBottom: '1px solid #dee2e6', // Bottom border for the tab header area
  },
  tabButton: {
    padding: '10px 15px',
    marginRight: '5px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1em',
    color: '#495057',
    borderBottom: '3px solid transparent', // For active indicator
    marginBottom: '-1px', // Align with the section's bottom border
  },
  activeTab: {
    color: '#007bff',
    fontWeight: '600',
    borderBottom: '3px solid #007bff',
  },
  tabContent: {
    paddingTop: '20px', // Space above tab content
  },
  // History table styles remain relevant
  historyTableContainer: {
    overflowX: 'auto',
  },
  historyTable: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '10px',
    fontSize: '0.9em',
  },
  th: {
    backgroundColor: '#f0f2f5', // Light grey header
    color: '#333',
    padding: '10px 12px',
    border: '1px solid #ddd',
    textAlign: 'left',
    fontWeight: '600',
  },
  td: {
    padding: '10px 12px',
    border: '1px solid #ddd',
    color: '#444',
    verticalAlign: 'middle',
  },
  reasonText: { // To potentially truncate long reasons with ellipsis
    display: 'block',
    maxWidth: '200px', // Adjust as needed
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px', // Pill shape
    fontSize: '0.8em',
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
  },
  pending: { // Style for status: Pending
    backgroundColor: '#ffc107', // Amber
    color: '#333', // Darker text for amber
  },
  approved: { // Style for status: Approved
    backgroundColor: '#28a745', // Green
  },
  rejected: { // Style for status: Rejected
    backgroundColor: '#dc3545', // Red
  },
  cancelled: { // Style for status: Cancelled
    backgroundColor: '#6c757d', // Grey
  },
  cancelButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85em',
  },
  // Styles for Holiday Calendar tab
  holidayList: {
    listStyle: 'none',
    padding: 0,
  },
  holidayItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #f0f0f0',
  },
  holidayDate: {
    fontWeight: '500',
    color: '#333',
    minWidth: '150px', // Ensure date alignment
  },
  holidayName: {
    flexGrow: 1,
    color: '#555',
    marginLeft: '15px',
  },
  holidayTypeBadge: {
    padding: '3px 7px',
    borderRadius: '10px',
    fontSize: '0.75em',
    fontWeight: '500',
    backgroundColor: '#e9ecef',
    color: '#495057',
    marginLeft: '15px',
    whiteSpace: 'nowrap',
  }
};

export default LeavePage;
