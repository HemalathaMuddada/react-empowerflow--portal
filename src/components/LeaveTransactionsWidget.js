import React, { useState, useEffect } from 'react';
import { getLeaveHistory, getLeaveBalances } from '../services/leaveService'; // Assuming getLeaveBalances might provide leave types

const LeaveTransactionsWidget = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const history = await getLeaveHistory();
        // Sort by most recent first (assuming 'appliedOn' or 'startDate' can be used)
        const sortedHistory = history.sort((a, b) => {
            const dateA = new Date(a.appliedOn || a.startDate);
            const dateB = new Date(b.appliedOn || b.startDate);
            return dateB - dateA;
        });
        setAllTransactions(sortedHistory);
        setFilteredTransactions(sortedHistory);

        // Fetch available leave types for the filter dropdown
        const balances = await getLeaveBalances();
        const types = balances.map(b => b.type).filter(t => t !== 'LOP Taken'); // Exclude LOP
        setLeaveTypes(['All Types', ...new Set(types)]); // Add 'All Types' and ensure unique
        setSelectedType('All Types');

      } catch (err) {
        console.error("Failed to fetch data for Leave Transactions widget:", err);
        setError('Could not load leave transactions.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedType === '' || selectedType === 'All Types') {
      setFilteredTransactions(allTransactions);
    } else {
      setFilteredTransactions(allTransactions.filter(t => t.type === selectedType));
    }
  }, [selectedType, allTransactions]);

  const handleFilterChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleDownload = () => {
    // Placeholder for download functionality
    console.log('Download transactions:', filteredTransactions);
    alert('Download functionality is not implemented yet.');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA'); // YYYY-MM-DD for consistency
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading transactions...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.widgetContainer}>
      <div style={styles.header}>
        <h3 style={styles.sectionTitle}>Leave Transactions</h3>
        <div style={styles.controls}>
          <select value={selectedType} onChange={handleFilterChange} style={styles.filterSelect}>
            {leaveTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button onClick={handleDownload} style={styles.downloadButton}>Download</button>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Applied On</th>
              <th style={styles.th}>From</th>
              <th style={styles.th}>To</th>
              <th style={styles.th}>Days</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(item => (
                <tr key={item.id}>
                  <td style={styles.td}>{item.type}</td>
                  <td style={styles.td}>{formatDate(item.appliedOn)}</td>
                  <td style={styles.td}>{formatDate(item.startDate)}</td>
                  <td style={styles.td}>{formatDate(item.endDate)}</td>
                  <td style={styles.td}>{item.days}</td>
                  <td style={styles.td}>
                    <span style={{...styles.statusBadge, ...styles[item.status?.toLowerCase()]}}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={styles.noDataCell}>No transactions match your filter.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  widgetContainer: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  sectionTitle: {
    fontSize: '1.1em',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  filterSelect: {
    padding: '6px 10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '0.9em',
    backgroundColor: '#fff',
  },
  downloadButton: {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    fontSize: '0.9em',
    cursor: 'pointer',
    fontWeight: '500',
  },
  tableContainer: {
    overflowX: 'auto', // For responsiveness on small screens
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9em',
  },
  th: {
    backgroundColor: '#f8f9fa', // Light grey header
    color: '#495057', // Darker text for header
    padding: '8px 10px',
    border: '1px solid #dee2e6',
    textAlign: 'left',
    fontWeight: '600', // Bolder header text
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '8px 10px',
    border: '1px solid #e9ecef', // Lighter border for cells
    color: '#333',
    whiteSpace: 'nowrap',
  },
  statusBadge: {
    padding: '3px 7px',
    borderRadius: '10px', // More rounded badge
    fontSize: '0.8em',
    fontWeight: '500',
    color: '#fff',
    textTransform: 'capitalize',
    display: 'inline-block', // Ensure badge displays correctly
  },
  pending: { backgroundColor: '#ffc107', color: '#333' }, // Bootstrap warning
  approved: { backgroundColor: '#28a745' }, // Bootstrap success
  rejected: { backgroundColor: '#dc3545' }, // Bootstrap danger
  cancelled: { backgroundColor: '#6c757d' }, // Bootstrap secondary
  loading: { padding: '20px', textAlign: 'center', color: '#555' },
  error: { padding: '20px', textAlign: 'center', color: 'red' },
  noDataCell: {
    textAlign: 'center',
    padding: '20px',
    color: '#777',
    fontStyle: 'italic',
  },
};

export default LeaveTransactionsWidget;
