import React, { useState, useEffect } from 'react';
import { getLeaveBalances, getLeaveHistory, applyForLeave, cancelLeaveRequest } from '../services/leaveService'; // Added cancelLeaveRequest

const LeavePage = () => {
  // State for the leave application form
  const [leaveType, setLeaveType] = useState(''); // e.g., 'Annual', 'Sick'
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // State for displaying data
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  // No need for: const { cancelLeaveRequest } = leaveService; as it's directly imported

  // State for messages and loading
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' }); // type: 'success' or 'error'

  // Will be populated from leaveBalances
  const [availableLeaveTypes, setAvailableLeaveTypes] = useState([]);

  useEffect(() => {
    // Fetch initial data like balances which might also give us leave types
    getLeaveBalances().then(balances => {
      setLeaveBalances(balances); // For display later
      const types = balances.map(b => b.type);
      setAvailableLeaveTypes(types.length > 0 ? types : ['Annual', 'Sick', 'Casual', 'Unpaid']); // Fallback if no balances
      // Set a default leave type if not already set and types are available
      if (!leaveType && types.length > 0) {
        setLeaveType(types[0]);
      }
    }).catch(err => {
      console.error("Failed to fetch leave balances/types:", err);
      setAvailableLeaveTypes(['Annual', 'Sick', 'Casual', 'Unpaid']); // Fallback
    });

    getLeaveHistory().then(history => {
      setLeaveHistory(history.sort((a, b) => new Date(b.appliedOn || 0) - new Date(a.appliedOn || 0))); // Show newest first
    }).catch(err => {
      console.error("Failed to fetch leave history:", err);
      // Optionally set an error state for history display
    });
  }, []);

  const fetchAndUpdateHistory = () => {
    getLeaveHistory().then(history => {
      setLeaveHistory(history.sort((a, b) => new Date(b.appliedOn || 0) - new Date(a.appliedOn || 0)));
    }).catch(err => console.error("Failed to refetch leave history:", err));
  };

  const handleCancelLeave = async (leaveId) => {
    setFormMessage({ type: '', text: '' }); // Clear previous messages
    setIsLoading(true); // Potentially set a different loading state for cancellation if needed
    try {
      const response = await cancelLeaveRequest(leaveId);
      setFormMessage({ type: 'success', text: response.message });
      fetchAndUpdateHistory(); // Refetch history after cancellation
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

    // Basic client-side validation
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
      // Clear form
      setLeaveType(availableLeaveTypes.length > 0 ? availableLeaveTypes[0] : ''); // Reset to first available or empty
      setStartDate('');
      setEndDate('');
      setReason('');
      fetchAndUpdateHistory(); // Refetch history
      // TODO: Optionally refetch balances if they are affected immediately
    } catch (error) {
      setFormMessage({ type: 'error', text: error.message || 'Failed to apply for leave. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>Leave Management</h1>

      {/* Section for Leave Application Form */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Apply for Leave</h2>
        <form onSubmit={handleFormSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="leaveType" style={styles.label}>Leave Type:</label>
            <select
              id="leaveType"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              required
              style={styles.input}
            >
              <option value="">-- Select Leave Type --</option>
              {availableLeaveTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={styles.formRow}>
            <div style={{...styles.formGroup, ...styles.formGroupHalf}}>
              <label htmlFor="startDate" style={styles.label}>Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                style={styles.input}
              />
            </div>
            <div style={{...styles.formGroup, ...styles.formGroupHalf}}>
              <label htmlFor="endDate" style={styles.label}>End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="reason" style={styles.label}>Reason:</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows="4"
              style={{...styles.input, ...styles.textarea}}
            />
          </div>

          {formMessage.text && (
            <p style={{
              ...styles.message,
              color: formMessage.type === 'error' ? 'red' : (formMessage.type === 'success' ? 'green' : 'blue')
            }}>
              {formMessage.text}
            </p>
          )}

          <button type="submit" style={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Apply for Leave'}
          </button>
        </form>
      </section>

      {/* Section for Leave Balances */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>My Leave Balances</h2>
        {leaveBalances.length > 0 ? (
          <div style={styles.balancesContainer}>
            {leaveBalances.map(balance => (
              <div key={balance.type} style={styles.balanceItem}>
                <span style={styles.balanceType}>{balance.type}:</span>
                <span style={styles.balanceValue}>{balance.balance} / {balance.total} days</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No leave balances found or still loading...</p>
        )}
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>My Leave History</h2>
        {leaveHistory.length > 0 ? (
          <div style={styles.historyTableContainer}>
            <table style={styles.historyTable}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Dates</th>
                  <th style={styles.th}>Days</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Applied On</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {leaveHistory.map(item => (
                  <tr key={item.id}>
                    <td style={styles.td}>{item.id}</td>
                    <td style={styles.td}>{item.type}</td>
                    <td style={styles.td}>{item.startDate} to {item.endDate}</td>
                    <td style={styles.td}>{item.days}</td>
                    <td style={styles.td}><span style={styles.reasonText}>{item.reason}</span></td>
                    <td style={styles.td}>
                      <span style={{...styles.statusBadge, ...styles[item.status?.toLowerCase()]}}>
                        {item.status}
                      </span>
                    </td>
                    <td style={styles.td}>{item.appliedOn || 'N/A'}</td>
                    <td style={styles.td}>
                      {item.status === 'Pending' && (
                        <button
                          onClick={() => handleCancelLeave(item.id)}
                          style={styles.cancelButton}
                          disabled={isLoading} // Disable if another operation is in progress
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No leave history found or still loading...</p>
        )}
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
  historyTableContainer: {
    overflowX: 'auto', // For responsive table
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
  // cancelButtonHover: { backgroundColor: '#c82333' },
};

export default LeavePage;
