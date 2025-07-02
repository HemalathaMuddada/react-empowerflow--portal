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
  // const [leaveHistory, setLeaveHistory] = useState([]); // Moved to LeaveHistoryPage.js
  // const [holidaysList, setHolidaysList] = useState([]); // Moved to CompanyHolidayCalendarPage.js

  // State for messages and loading
  const [isLoading, setIsLoading] = useState(false); // For form submission primarily
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // Tab state and related logic (activeTab, determineInitialTab) are fully removed.
  // const [activeTab, setActiveTab] = useState(determineInitialTab); // REMOVED

  // Form state - existing
  // const [leaveType, setLeaveType] = useState(''); // Will be adjusted for new selector
  // const [startDate, setStartDate] = useState('');
  // const [endDate, setEndDate] = useState('');
  // const [reason, setReason] = useState('');

  // New state variables for the redesigned modal
  const [startDateSession, setStartDateSession] = useState('full'); // 'full', 'firstHalf', 'secondHalf'
  const [endDateSession, setEndDateSession] = useState('full');   // 'full', 'firstHalf', 'secondHalf'
  const [contactNumber, setContactNumber] = useState('');
  const [attachedFile, setAttachedFile] = useState(null); // Store File object or file name
  const [calculatedDays, setCalculatedDays] = useState(0); // For "Applying for: X Days"

  // Available leave types - now an array of objects
  // Will be populated from leaveBalances, which also needs to be an array of objects with codes
  const [availableLeaveTypes, setAvailableLeaveTypes] = useState([
    // Example structure, will be derived from leaveBalances
    // { code: 'CL', name: 'Casual Leave', balance: 5, total: 5 },
    // { code: 'SL', name: 'Sick Leave', balance: 8, total: 10 },
  ]);

  // TODO: Modal state for leave application form
  const [showLeaveFormModal, setShowLeaveFormModal] = useState(false);

  // Tab related useEffect removed.

  useEffect(() => {
    // Fetch initial data - balances and derive leave types for selector
    getLeaveBalances().then(balances => {
      setLeaveBalances(balances);
      const typesForSelector = balances.map(b => ({
        // Assuming leaveService now provides 'code', or we derive it.
        // For now, let's assume service provides 'type' (full name) and we might need a mapping for short codes.
        // Or, the button UI will just use the full name for now if codes aren't in service.
        // Let's use full name for state `leaveType` and buttons can display a derived short code or full name.
        code: b.code || b.type.match(/\b([A-Z])/g)?.join('') || b.type.substring(0,2).toUpperCase(), // e.g., CL, SL, ANNL
        name: b.type,
      }));
      setAvailableLeaveTypes(typesForSelector.length > 0 ? typesForSelector : [
        { code: 'ANN', name: 'Annual Leave' },
        { code: 'SIC', name: 'Sick Leave' },
        { code: 'CAS', name: 'Casual Leave'}
      ]);
      // Set default selected leave type using its name (or code if state stores code)
      if (!leaveType && typesForSelector.length > 0) {
        setLeaveType(typesForSelector[0].name); // Default to the full name of the first type
      }
    }).catch(err => {
      console.error("Failed to fetch leave balances/types for ApplyLeavePage:", err);
      setAvailableLeaveTypes([
        { code: 'ANN', name: 'Annual Leave' },
        { code: 'SIC', name: 'Sick Leave' },
        { code: 'CAS', name: 'Casual Leave'}
      ]);
    });
    // Note: leaveType was removed from dependency array from the useEffect that sets activeTab, which is now removed.
    // The current useEffect for fetching balances runs once on mount and is correct.
  }, []);

  // fetchAndUpdateHistory and handleCancelLeave functions were previously here and are now correctly removed
  // as their functionality belongs to LeaveHistoryPage.js (or would be invoked differently if still relevant here).

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

    if (calculatedDays <= 0) {
      setFormMessage({ type: 'error', text: 'The selected dates and sessions result in zero or negative leave days. Please check your selection.' });
      setIsLoading(false);
      return;
    }

    try {
      const applicationData = {
        leaveType,
        startDate,
        endDate,
        reason,
        days: calculatedDays, // Pass the calculated days
        startDateSession,
        endDateSession,
        contactNumber,
        // attachedFileName: attachedFile ? attachedFile.name : null // Example of passing file info
      };
      const response = await applyForLeave(applicationData); // Service will need to accept these
      setFormMessage({ type: 'success', text: response.message });

      // Clear form - including new fields
      setLeaveType(availableLeaveTypes.length > 0 ? availableLeaveTypes[0].name : '');
      setStartDate('');
      setEndDate('');
      setReason('');
      setStartDateSession('full');
      setEndDateSession('full');
      setContactNumber('');
      setAttachedFile(null);
      setCalculatedDays(0);

      setShowLeaveFormModal(false);
    } catch (error) {
      setFormMessage({ type: 'error', text: error.message || 'Failed to apply for leave. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Placeholder for Leave Application Form (to be moved to a modal)
  // Moved and improved calculateAppliedDays function
  const calculateAppliedDaysLogic = (sDate, eDate, startSession, endSession) => {
    if (!sDate || !eDate) return 0;

    const start = new Date(sDate);
    const end = new Date(eDate);

    if (end < start) return 0; // Invalid date range

    // Calculate difference in days
    let dayDifference = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    let numberOfDays = dayDifference + 1; // Inclusive of start and end date

    // Adjust for half days
    if (start.getTime() === end.getTime()) { // Single day leave
      if (startSession !== 'full' && endSession !== 'full' && startSession !== endSession) {
        // e.g. start is firstHalf, end is secondHalf - this is an invalid selection for a single day or should be 1 day.
        // For simplicity, if both are half days on the same day, it's 1 day unless they are the SAME half.
        // If start=firstHalf, end=firstHalf -> 0.5 day. If start=firstHalf, end=secondHalf -> 1 day.
        // This logic can get complex. A common rule: if single day, only one session choice matters or it's 0.5.
        // Let's assume single day half-day selection means 0.5 days.
        if (startSession !== 'full' || endSession !== 'full') { // If either is a half day
             if (startSession === endSession && (startSession === 'firstHalf' || startSession === 'secondHalf')) {
                numberOfDays = 0.5; // Both start and end are the same half day
             } else if (startSession !== 'full' && endSession !== 'full' && startSession !== endSession) {
                numberOfDays = 1; // e.g. First half of Day1 to Second half of Day1
             } else { // One is full, other is half - this implies the single half day is taken.
                numberOfDays = 0.5;
             }
        }
      } else if (startSession !== 'full' || endSession !== 'full') { // If one is half day on a single day leave
        numberOfDays = 0.5;
      }
    } else { // Multi-day leave
      if (startSession === 'secondHalf') {
        numberOfDays -= 0.5;
      }
      if (endSession === 'firstHalf') {
        numberOfDays -= 0.5;
      }
      // If start is firstHalf, it's still a full day counted for start.
      // If end is secondHalf, it's still a full day counted for end.
    }
    return Math.max(0, numberOfDays); // Ensure non-negative
  };

  useEffect(() => {
    const days = calculateAppliedDaysLogic(startDate, endDate, startDateSession, endDateSession);
    setCalculatedDays(days);
  }, [startDate, endDate, startDateSession, endDateSession]);


  const renderLeaveApplicationForm = () => {
    // Find current balance for selected leave type
    const currentBalanceDetails = leaveBalances.find(b => b.type === leaveType);
    const currentBalanceValue = currentBalanceDetails ? currentBalanceDetails.balance : 'N/A';

    // const daysApplied = calculatedDays; // Use state here

    return (
      <form onSubmit={handleFormSubmit} style={styles.form}>
        {/* Leave Type Button Selector */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Leave Type:</label>
          <div style={styles.leaveTypeSelector}>
            {availableLeaveTypes.map(lt => (
              <button
                type="button"
                key={lt.code}
                style={leaveType === lt.name ? {...styles.leaveTypeButton, ...styles.leaveTypeButtonActive} : styles.leaveTypeButton}
                onClick={() => setLeaveType(lt.name)} // Sets full name as leaveType state
              >
                {lt.code} {/* Display short code */}
              </button>
            ))}
          </div>
        </div>

        {/* Date Inputs with Session Selectors */}
        <div style={styles.formRow}>
          {/* From Date */}
          <div style={{...styles.formGroup, ...styles.formGroupHalf}}>
            <label htmlFor="startDate" style={styles.label}>From Date:</label>
            <div style={styles.dateInputContainer}>
              <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={styles.input} />
              {/* <span style={styles.calendarIcon}>📅</span> Placeholder */}
            </div>
            <div style={styles.sessionSelector}>
              {['full', 'firstHalf', 'secondHalf'].map(session => (
                <label key={`start-${session}`} style={styles.sessionLabel}>
                  <input type="radio" name="startDateSession" value={session} checked={startDateSession === session} onChange={(e) => setStartDateSession(e.target.value)} />
                  {session.replace('Half', ' Half')}
                </label>
              ))}
            </div>
          </div>
          {/* To Date */}
          <div style={{...styles.formGroup, ...styles.formGroupHalf}}>
            <label htmlFor="endDate" style={styles.label}>To Date:</label>
            <div style={styles.dateInputContainer}>
              <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={styles.input} />
              {/* <span style={styles.calendarIcon}>📅</span> Placeholder */}
            </div>
            <div style={styles.sessionSelector}>
              {['full', 'firstHalf', 'secondHalf'].map(session => (
                <label key={`end-${session}`} style={styles.sessionLabel}>
                  <input type="radio" name="endDateSession" value={session} checked={endDateSession === session} onChange={(e) => setEndDateSession(e.target.value)} />
                  {session.replace('Half', ' Half')}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Contextual Balance and Applying For Display */}
        <div style={styles.formGroup}>
          <div style={styles.contextualInfo}>
            <span>Balance: <strong>{currentBalanceValue} Days</strong></span>
            <span>Applying for: <strong>{calculatedDays} Days</strong></span> {/* Now uses state */}
          </div>
        </div>

        {/* Reason */}
        <div style={styles.formGroup}>
          <label htmlFor="reason" style={styles.label}>Reason:</label>
          <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required rows="3" style={{...styles.input, ...styles.textarea}}/>
        </div>

        {/* Contact Number */}
        <div style={styles.formGroup}>
          <label htmlFor="contactNumber" style={styles.label}>Contact Number During Leave:</label>
          <input type="tel" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} style={styles.input} placeholder="Optional"/>
        </div>

        {/* File Attachment (Mock) */}
        <div style={styles.formGroup}>
          <label htmlFor="attachment" style={styles.label}>Attach File (Optional):</label>
          <input type="file" id="attachment" onChange={(e) => setAttachedFile(e.target.files[0])} style={styles.input} />
          {attachedFile && <p style={styles.fileNameDisplay}>Selected: {attachedFile.name}</p>}
        </div>

        {formMessage.text && (<p style={{ ...styles.message, color: formMessage.type === 'error' ? 'red' : (formMessage.type === 'success' ? 'green' : 'blue') }}>{formMessage.text}</p>)}

        {/* Modal Action Buttons */}
        <div style={styles.modalActions}>
          <button type="button" onClick={() => setShowLeaveFormModal(false)} style={{...styles.actionButton, ...styles.cancelModalButton}}>Cancel</button>
          <button type="submit" style={{...styles.submitButton, ...styles.applyModalButton}} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Apply'}
          </button>
        </div>
      </form>
    );
  };


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
    paddingTop: '20px',
  },
  // Styles for new elements in Apply Leave Modal
  leaveTypeSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '15px',
  },
  leaveTypeButton: {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '20px', // Pill shape
    backgroundColor: '#f8f9fa',
    color: '#495057',
    cursor: 'pointer',
    fontSize: '0.9em',
    transition: 'all 0.2s ease',
  },
  leaveTypeButtonActive: {
    backgroundColor: '#007bff',
    color: '#fff',
    borderColor: '#007bff',
    fontWeight: '500',
  },
  dateInputContainer: { // If we add a calendar icon
    display: 'flex',
    alignItems: 'center',
    // input[type="date"] would need styling to remove default icon if we add our own
  },
  // calendarIcon: { marginLeft: '-25px', color: '#ccc' }, // Example if icon is overlaid
  sessionSelector: {
    display: 'flex',
    gap: '10px',
    marginTop: '8px',
    fontSize: '0.85em',
  },
  sessionLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
  },
  contextualInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    fontSize: '0.9em',
    color: '#555',
    borderTop: '1px dashed #eee',
    borderBottom: '1px dashed #eee',
    marginBottom: '15px',
  },
  fileNameDisplay: {
    fontSize: '0.85em',
    color: '#555',
    marginTop: '5px',
    fontStyle: 'italic',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  applyModalButton: { // Specific style for Apply button in modal if different from general submit
    // Inherits from styles.submitButton, can add overrides
    padding: '10px 20px', // Make it more prominent
  },
  cancelModalButton: { // Specific style for Cancel button in modal
     // Inherits from styles.actionButton, can add overrides
    backgroundColor: '#6c757d', // Grey cancel button
    padding: '10px 20px',
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
