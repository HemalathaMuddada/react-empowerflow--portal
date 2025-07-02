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
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [holidaysList, setHolidaysList] = useState([]); // State for holidays

  // State for messages and loading
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // State for active tab - determine initial tab based on path
  const determineInitialTab = () => {
    if (location.pathname === '/leave/calendar') {
      return 'calendar';
    }
    return 'history'; // Default
  };
  const [activeTab, setActiveTab] = useState(determineInitialTab);

  // Will be populated from leaveBalances
  const [availableLeaveTypes, setAvailableLeaveTypes] = useState([]);

  // TODO: Modal state for leave application form
  const [showLeaveFormModal, setShowLeaveFormModal] = useState(false);

  // Effect to set active tab based on URL path
  useEffect(() => {
    if (location.pathname === '/leave/calendar') {
      setActiveTab('calendar');
    } else {
      setActiveTab('history'); // Default to history for /leave or other sub-paths
    }
  }, [location.pathname]);


  useEffect(() => {
    // Fetch initial data like balances which might also give us leave types
    getLeaveBalances().then(balances => {
      setLeaveBalances(balances);
      const types = balances.map(b => b.type);
      setAvailableLeaveTypes(types.length > 0 ? types : ['Annual', 'Sick', 'Casual', 'Unpaid']);
      if (!leaveType && types.length > 0) {
        setLeaveType(types[0]);
      }
    }).catch(err => {
      console.error("Failed to fetch leave balances/types:", err);
      setAvailableLeaveTypes(['Annual', 'Sick', 'Casual', 'Unpaid']);
    });

    getLeaveHistory().then(history => {
      setLeaveHistory(history.sort((a, b) => new Date(b.appliedOn || 0) - new Date(a.appliedOn || 0)));
    }).catch(err => {
      console.error("Failed to fetch leave history:", err);
    });

    getHolidays().then(holidays => {
      setHolidaysList(holidays);
    }).catch(err => {
      console.error("Failed to fetch holidays:", err);
    });
  }, []); // Main data fetching effect runs once on mount

  const fetchAndUpdateHistory = () => {
    getLeaveHistory().then(history => {
      setLeaveHistory(history.sort((a, b) => new Date(b.appliedOn || 0) - new Date(a.appliedOn || 0)));
    }).catch(err => console.error("Failed to refetch leave history:", err));
  };

  const handleCancelLeave = async (leaveId) => {
    setFormMessage({ type: '', text: '' });
    setIsLoading(true);
    try {
      const response = await cancelLeaveRequest(leaveId);
      setFormMessage({ type: 'success', text: response.message });
      fetchAndUpdateHistory();
    } catch (error) {
      setFormMessage({ type: 'error', text: error.message || `Failed to cancel leave ${leaveId}.` });
    } finally {
      setIsLoading(false);
    }
  };

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
      fetchAndUpdateHistory();
      setShowLeaveFormModal(false); // Close modal on success
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
      <h1 style={styles.pageTitle}>Leave Management</h1>

      {/* Top Section: Leave Balance Summary Cards */}
      <section style={{...styles.section, ...styles.balanceSummaryContainerStyle}}>
        {leaveBalances.length > 0 ? (
          leaveBalances.map(balance => (
            <LeaveBalanceCard
              key={balance.type}
              type={balance.type + ' Leave'}
              available={balance.balance}
              total={balance.total}
              icon={balance.type === 'Annual' ? '🏖️' : balance.type === 'Sick' ? '🤒' : balance.type === 'Casual' ? '🚶' : '📄'} // Assign basic icons
            />
          ))
        ) : (
          <p>Loading balances or no balances found...</p>
        )}
      </section>

      {/* Action Button Section */}
      <section style={{...styles.section, ...styles.applyButtonContainer}}>
        <button onClick={() => setShowLeaveFormModal(true)} style={styles.applyLeaveButton}>
          Apply for Leave
        </button>
      </section>

      {/* TODO: Implement Modal for Leave Application Form */}
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

      {/* Tabbed Interface Section */}
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
              {/* Existing Leave History Table JSX */}
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
    display: 'flex',
    gap: '20px', // Space between cards
    justifyContent: 'space-around', // Or 'flex-start'
    flexWrap: 'wrap', // Allow cards to wrap on smaller screens
    marginBottom: '25px',
  },
  applyButtonContainer: {
    marginBottom: '25px',
    textAlign: 'right', // As per one common interpretation of such layouts
  },
  applyLeaveButton: {
    padding: '10px 20px',
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
