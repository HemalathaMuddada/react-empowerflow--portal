import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getLeaveBalances, applyForLeave } from '../services/leaveService'; // Removed getLeaveHistory, cancelLeaveRequest as they moved
// import { getHolidays } from '../services/holidayService'; // Holidays will be on its own page
import LeaveBalanceCard from '../components/LeaveBalanceCard';

const LeavePage = () => {
  // State for the leave application form
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  // State for displaying data
  const [leaveBalances, setLeaveBalances] = useState([]);

  // State for messages and loading
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  // New state variables for the redesigned modal form (which is now inline)
  const [startDateSession, setStartDateSession] = useState('full');
  const [endDateSession, setEndDateSession] = useState('full');
  const [contactNumber, setContactNumber] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [calculatedDays, setCalculatedDays] = useState(0);

  const [availableLeaveTypes, setAvailableLeaveTypes] = useState([]);
  const [showLeaveFormModal, setShowLeaveFormModal] = useState(false); // This page IS the form, so modal state might be re-evaluated.
                                                                      // For now, keeping it as per plan to move form from modal to inline.

  useEffect(() => {
    getLeaveBalances().then(balances => {
      setLeaveBalances(balances);
      const typesForSelector = balances.map(b => ({
        code: b.code || b.type.match(/\b([A-Z])/g)?.join('') || b.type.substring(0,2).toUpperCase(),
        name: b.type,
      }));
      setAvailableLeaveTypes(typesForSelector.length > 0 ? typesForSelector : [
        { code: 'ANN', name: 'Annual Leave' },
        { code: 'SIC', name: 'Sick Leave' },
        { code: 'CAS', name: 'Casual Leave'}
      ]);
      if (!leaveType && typesForSelector.length > 0) {
        setLeaveType(typesForSelector[0].name);
      }
    }).catch(err => {
      console.error("Failed to fetch leave balances/types for LeavePage:", err);
      setAvailableLeaveTypes([
        { code: 'ANN', name: 'Annual Leave' },
        { code: 'SIC', name: 'Sick Leave' },
        { code: 'CAS', name: 'Casual Leave'}
      ]);
    });
  }, []);

  const calculateAppliedDaysLogic = (sDate, eDate, startSession, endSession) => {
    if (!sDate || !eDate) return 0;
    const start = new Date(sDate);
    const end = new Date(eDate);
    if (end < start) return 0;
    let dayDifference = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    let numberOfDays = dayDifference + 1;
    if (start.getTime() === end.getTime()) {
      if (startSession !== 'full' || endSession !== 'full') {
        if (startSession === endSession && (startSession === 'firstHalf' || startSession === 'secondHalf')) {
           numberOfDays = 0.5;
        } else if (startSession !== 'full' && endSession !== 'full' && startSession !== endSession) {
           numberOfDays = 1;
        } else {
           numberOfDays = 0.5;
        }
      }
    } else {
      if (startSession === 'secondHalf') numberOfDays -= 0.5;
      if (endSession === 'firstHalf') numberOfDays -= 0.5;
    }
    return Math.max(0, numberOfDays);
  };

  useEffect(() => {
    const days = calculateAppliedDaysLogic(startDate, endDate, startDateSession, endDateSession);
    setCalculatedDays(days);
  }, [startDate, endDate, startDateSession, endDateSession]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormMessage({ type: '', text: '' });
    setIsLoading(true);

    if (!leaveType || !startDate || !endDate || !reason) {
      setFormMessage({ type: 'error', text: 'All fields are required.' });
      setIsLoading(false); return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setFormMessage({ type: 'error', text: 'Start date cannot be after end date.' });
      setIsLoading(false); return;
    }
    if (calculatedDays <= 0) {
      setFormMessage({ type: 'error', text: 'Leave days must be greater than 0. Check dates/sessions.' });
      setIsLoading(false); return;
    }

    try {
      const applicationData = {
        leaveType, startDate, endDate, reason,
        days: calculatedDays,
        startDateSession, endDateSession, contactNumber,
        // attachedFileName: attachedFile ? attachedFile.name : null
      };
      const response = await applyForLeave(applicationData);
      setFormMessage({ type: 'success', text: response.message });
      setLeaveType(availableLeaveTypes.length > 0 ? availableLeaveTypes[0].name : '');
      setStartDate(''); setEndDate(''); setReason('');
      setStartDateSession('full'); setEndDateSession('full');
      setContactNumber(''); setAttachedFile(null); setCalculatedDays(0);
      setShowLeaveFormModal(false); // Close modal (or clear form if inline)
    } catch (error) {
      setFormMessage({ type: 'error', text: error.message || 'Failed to apply for leave.' });
    } finally {
      setIsLoading(false);
    }
  };

  const actualLeaveApplicationForm = (
    <form onSubmit={handleFormSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Leave Type:</label>
        <div style={styles.leaveTypeSelector}>
          {availableLeaveTypes.map(lt => (
            <button type="button" key={lt.code}
                    style={leaveType === lt.name ? {...styles.leaveTypeButton, ...styles.leaveTypeButtonActive} : styles.leaveTypeButton}
                    onClick={() => setLeaveType(lt.name)}>
              {lt.code}
            </button>
          ))}
        </div>
      </div>
      <div style={styles.formRow}>
        <div style={{...styles.formGroup, ...styles.formGroupHalf}}>
          <label htmlFor="startDate" style={styles.label}>From Date:</label>
          <div style={styles.dateInputContainer}>
            <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={styles.input} />
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
        <div style={{...styles.formGroup, ...styles.formGroupHalf}}>
          <label htmlFor="endDate" style={styles.label}>To Date:</label>
          <div style={styles.dateInputContainer}>
            <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required style={styles.input} />
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
      <div style={styles.formGroup}>
        <div style={styles.contextualInfo}>
          <span>Balance: <strong>{leaveBalances.find(b => b.type === leaveType)?.balance ?? 'N/A'} Days</strong></span>
          <span>Applying for: <strong>{calculatedDays} Days</strong></span>
        </div>
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="reason" style={styles.label}>Reason:</label>
        <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} required rows="3" style={{...styles.input, ...styles.textarea}}/>
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="contactNumber" style={styles.label}>Contact Number During Leave:</label>
        <input type="tel" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} style={styles.input} placeholder="Optional"/>
      </div>
      <div style={styles.formGroup}>
        <label htmlFor="attachment" style={styles.label}>Attach File (Optional):</label>
        <input type="file" id="attachment" onChange={(e) => setAttachedFile(e.target.files[0])} style={styles.input} />
        {attachedFile && <p style={styles.fileNameDisplay}>Selected: {attachedFile.name}</p>}
      </div>
      {formMessage.text && (<p style={{ ...styles.message, color: formMessage.type === 'error' ? 'red' : (formMessage.type === 'success' ? 'green' : 'blue') }}>{formMessage.text}</p>)}
      <div style={styles.modalActions}> {/* Using modalActions for consistency, can be renamed if form is not in modal */}
        <button type="button" onClick={() => { /* Logic to clear/reset form if not submitting */
            setLeaveType(availableLeaveTypes.length > 0 ? availableLeaveTypes[0].name : '');
            setStartDate(''); setEndDate(''); setReason('');
            setStartDateSession('full'); setEndDateSession('full');
            setContactNumber(''); setAttachedFile(null); setCalculatedDays(0);
            setFormMessage({type:'', text:''});
        }} style={{...styles.actionButton, ...styles.cancelModalButton}}>Reset</button>
        <button type="submit" style={{...styles.submitButton, ...styles.applyModalButton}} disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Apply'}
        </button>
      </div>
    </form>
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.topActionRow}>
        <h1 style={{...styles.pageTitle, marginBottom: '0', marginRight: 'auto' }}>Apply for Leave</h1>
        {/* No filter/download buttons on apply page as per new understanding */}
      </div>

      <section style={{...styles.section, ...styles.balanceSummaryContainerStyle, marginTop: '20px' }}>
        {leaveBalances.length > 0 ? (
          leaveBalances.map(balance => (
            <LeaveBalanceCard
              key={balance.type}
              type={balance.type}
              available={balance.balance !== undefined ? balance.balance : balance.value}
              total={balance.total}
              unit={balance.unit}
              icon={
                balance.type === 'Annual' ? '🏖️' :
                balance.type === 'Sick' ? '🤒' :
                balance.type === 'Casual' ? '🚶' :
                balance.type === 'Compensatory Off' ? '➕' :
                balance.type === 'Maternity' ? '🤰' :
                balance.type === 'Paternity' ? '👨‍🍼' :
                balance.type === 'LOP Taken' ? '📉' :
                balance.type === 'Bereavement' ? '🖤' : '📄'
              }
            />
          ))
        ) : (
          <p>Loading balances or no balances found...</p>
        )}
      </section>

      {/* Leave Application Form directly on page */}
      <section style={styles.section}>
        {/* Title for form section was in modal, can add one here if needed or remove if page title is enough */}
        {/* <h2 style={styles.sectionTitle}>Leave Application Details</h2> */}
        {actualLeaveApplicationForm}
      </section>
    </div>
  );
};

// Styles object (ensure all referenced styles are defined)
const styles = {
  pageContainer: {
    padding: '0px',
  },
  pageTitle: {
    fontSize: '1.8em',
    color: '#333',
    fontWeight: '600',
    // marginBottom: '25px', // Handled by topActionRow or direct placement
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '20px 25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '25px',
  },
  sectionTitle: { // For modal title or section titles if any
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
    gap: '20px',
  },
  formGroupHalf: {
    flex: 1,
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
    resize: 'vertical',
  },
  submitButton: { // Base submit button style
    padding: '10px 18px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
    // alignSelf: 'flex-start', // Not needed if actions are in a flex-end container
    transition: 'background-color 0.2s ease',
  },
  message: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '0.95em',
  },
  balanceSummaryContainerStyle: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '25px',
  },
  topActionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  filtersAndActions: { // Kept for potential future use on other pages, not used by ApplyLeave form directly
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  yearFilter: {
    padding: '8px 10px',
    height: 'auto',
    minWidth: '100px',
  },
  actionButton: { // Generic action button (like Download, or modal Cancel)
    padding: '8px 15px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: '500',
  },
  applyLeaveButton: { // Button that used to open modal, now might be removed or repurposed
    padding: '8px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
  },
  // Styles for new elements in Apply Leave Modal (now inline form)
  leaveTypeSelector: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '15px',
  },
  leaveTypeButton: {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '20px',
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
  dateInputContainer: {
    display: 'flex',
    alignItems: 'center',
  },
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
  modalActions: { // Now form actions container
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  applyModalButton: { // Specific style for Apply button in form
    padding: '10px 20px',
  },
  cancelModalButton: { // Specific style for Reset/Cancel button in form
    backgroundColor: '#6c757d',
    padding: '10px 20px',
  },
};

export default LeavePage;
