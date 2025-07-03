import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For potential links, if any
import { getLeaveHistory, cancelLeaveRequest } from '../services/leaveService';

const LeaveHistoryPage = () => {
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(false); // For cancel operation
  const [message, setMessage] = useState({ type: '', text: '' }); // For feedback messages

  // TODO: In a real app, getLeaveHistory might take 'selectedYear'
  const fetchHistory = (year) => {
    // For now, client-side filter if service doesn't support year.
    // Ideally, service takes year: getLeaveHistory(year).then(...)
    getLeaveHistory().then(history => {
      const filteredHistory = history.filter(item =>
        new Date(item.appliedOn || item.startDate).getFullYear() === year
      );
      setLeaveHistory(filteredHistory.sort((a, b) => new Date(b.appliedOn || b.startDate) - new Date(a.appliedOn || a.startDate)));
    }).catch(err => {
      console.error("Failed to fetch leave history:", err);
      setLeaveHistory([]);
      setMessage({ type: 'error', text: 'Could not load leave history.' });
    });
  };

  useEffect(() => {
    fetchHistory(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
  };

  const handleDownload = () => {
    console.log(`Download leave history for year ${selectedYear}`);
    // Actual download logic (e.g., CSV generation) would be here
    setMessage({ type: 'info', text: `Download initiated for ${selectedYear} history (mock).`});
  };

  const handleCancelLeave = async (leaveId) => {
    setMessage({ type: '', text: '' });
    setIsLoading(true);
    try {
      const response = await cancelLeaveRequest(leaveId);
      setMessage({ type: 'success', text: response.message });
      fetchHistory(selectedYear); // Refetch history for the current year
    } catch (error) {
      setMessage({ type: 'error', text: error.message || `Failed to cancel leave ${leaveId}.` });
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearsForFilter = [currentYear, currentYear - 1, currentYear - 2];

  return (
    <div style={styles.pageContainer}>
      <div style={styles.topActionRow}>
        <h1 style={styles.pageTitle}>My Leave History</h1>
        <div style={styles.filtersAndActions}>
          <select value={selectedYear} onChange={handleYearChange} style={{...styles.inputStyling, ...styles.yearFilter}}>
            {yearsForFilter.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button onClick={handleDownload} style={{...styles.actionButton, marginLeft: '10px'}}>Download History</button>
        </div>
      </div>

      {message.text && (
        <p style={{ ...styles.messageStyle,
                    color: message.type === 'error' ? 'red' : (message.type === 'success' ? 'green' : 'blue')
        }}>
          {message.text}
        </p>
      )}

      <section style={styles.section}>
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
                    <td style={styles.td}><span style={styles.reasonText} title={item.reason}>{item.reason}</span></td>
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
                          disabled={isLoading}
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
          <p>No leave history found for {selectedYear} or still loading...</p>
        )}
      </section>
    </div>
  );
};

// Styles (largely copied/adapted from LeavePage.js for consistency)
const styles = {
  pageContainer: {},
  topActionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '25px',
  },
  pageTitle: {
    fontSize: '1.8em',
    color: '#333',
    fontWeight: '600',
    margin: 0,
  },
  filtersAndActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  yearFilter: {
    padding: '8px 12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    height: '38px',
    minWidth: '100px',
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
    height: '38px',
  },
  messageStyle: {
    marginBottom: '15px',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '0.95em',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: '20px 25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '25px',
  },
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
    backgroundColor: '#f0f2f5',
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
  reasonText: {
    display: 'block',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '0.8em',
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
  },
  pending: { backgroundColor: '#ffc107', color: '#333' },
  approved: { backgroundColor: '#28a745' },
  rejected: { backgroundColor: '#dc3545' },
  cancelled: { backgroundColor: '#6c757d' },
  cancelButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85em',
  },
  inputStyling: { // Copied for select dropdown
    width: 'auto',
    boxSizing: 'border-box',
    fontSize: '1em',
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default LeaveHistoryPage;
