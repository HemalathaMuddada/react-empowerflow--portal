import React, { useState, useEffect } from 'react';
// Removed useLocation as tab logic is gone from this page
import { getLeaveBalances, applyForLeave } from '../services/leaveService';
import LeaveBalanceCard from '../components/LeaveBalanceCard';

const LeavePage = () => {
  // State for the leave application form
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [leaveBalances, setLeaveBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });

  const [startDateSession, setStartDateSession] = useState('full');
  const [endDateSession, setEndDateSession] = useState('full');
  const [contactNumber, setContactNumber] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [calculatedDays, setCalculatedDays] = useState(0);
  const [availableLeaveTypes, setAvailableLeaveTypes] = useState([]);
  // showLeaveFormModal is removed as form is now inline.

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
  }, []); // Runs once on mount

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
      // No modal to close: setShowLeaveFormModal(false);
    } catch (error) {
      setFormMessage({ type: 'error', text: error.message || 'Failed to apply for leave.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Form is now rendered directly, not via a function like renderLeaveApplicationForm

  return (
    <div style={styles.pageContainer}>
      <div style={styles.topActionRow}>
        <h1 style={{...styles.pageTitle, marginBottom: '0', marginRight: 'auto' }}>Apply for Leave</h1>
      </div>

      {/* Leave Application Form directly on page */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Submit Your Leave Request</h2>

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
              {availableLeaveTypes.map(lt => (
                <option key={lt.code || lt.name} value={lt.name}>{lt.name} (Code: {lt.code})</option>
              ))}
            </select>
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
          <div style={styles.formActions}> {/* Renamed from modalActions */}
            <button type="button" onClick={() => {
                setLeaveType(availableLeaveTypes.length > 0 ? availableLeaveTypes[0].name : '');
                setStartDate(''); setEndDate(''); setReason('');
                setStartDateSession('full'); setEndDateSession('full');
                setContactNumber(''); setAttachedFile(null); setCalculatedDays(0);
                setFormMessage({type:'', text:''});
            }} style={{...styles.actionButton, ...styles.cancelFormButton}}>Reset</button> {/* Changed from cancelModalButton */}
            <button type="submit" style={{...styles.submitButton, ...styles.applyFormButton}} disabled={isLoading}> {/* Changed from applyModalButton */}
              {isLoading ? 'Submitting...' : 'Apply'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

// Styles object
const styles = {
  pageContainer: {
    padding: '0px',
  },
  pageTitle: {
    fontSize: '1.8em',
    color: '#333',
    fontWeight: '600',
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
  submitButton: {
    padding: '10px 18px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1em',
    fontWeight: '500',
    transition: 'background-color 0.2s ease',
  },
  message: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '0.95em',
  },
  topActionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  actionButton: {
    padding: '8px 15px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: '500',
  },
  // Removed leaveTypeSelector, leaveTypeButton, leaveTypeButtonActive styles
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
  formActions: { // Renamed from modalActions
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  applyFormButton: { // Renamed from applyModalButton
    padding: '10px 20px',
  },
  cancelFormButton: { // Renamed from cancelModalButton
    backgroundColor: '#6c757d',
    padding: '10px 20px',
  },
};

export default LeavePage;
