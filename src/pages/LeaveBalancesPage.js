import React, { useState, useEffect } from 'react';
import { getLeaveBalances } from '../services/leaveService';
import LeaveBalanceCard from '../components/LeaveBalanceCard';

const LeaveBalancesPage = () => {
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // For year filter

  // TODO: In a real app, getLeaveBalances might take 'selectedYear' if balances are year-specific
  useEffect(() => {
    getLeaveBalances().then(balances => {
      setLeaveBalances(balances);
    }).catch(err => {
      console.error("Failed to fetch leave balances:", err);
      setLeaveBalances([]); // Set to empty array on error
    });
  }, [selectedYear]); // Refetch if year changes - assuming service could use it

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
    // Data fetching will re-run due to useEffect dependency
  };

  const handleDownload = () => {
    console.log(`Download report for year ${selectedYear}`);
    // Actual download logic would be here
  };

  // Define current year and a few previous years for the filter
  const currentYear = new Date().getFullYear();
  const yearsForFilter = [currentYear, currentYear - 1, currentYear - 2];


  return (
    <div style={styles.pageContainer}>
      <div style={styles.topActionRow}>
        <h1 style={styles.pageTitle}>My Leave Balances</h1>
        <div style={styles.filtersAndActions}>
          <select value={selectedYear} onChange={handleYearChange} style={{...styles.inputStyling, ...styles.yearFilter}}>
            {yearsForFilter.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button onClick={handleDownload} style={{...styles.actionButton, marginLeft: '10px'}}>Download Report</button>
        </div>
      </div>

      <section style={{...styles.section, ...styles.balanceSummaryContainerStyle}}>
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
          <p>Loading balances or no balances found for {selectedYear}...</p>
        )}
      </section>
    </div>
  );
};

// Styles (can be shared or refined from LeavePage.js styles if needed)
const styles = {
  pageContainer: {
    // padding: '0px', // DashboardLayout provides padding
  },
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
    margin: 0, // Adjusted for flex alignment
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
    height: '38px', // Match button height
    minWidth: '100px',
  },
  actionButton: {
    padding: '8px 15px',
    backgroundColor: '#6c757d', // Secondary button color
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9em',
    fontWeight: '500',
    height: '38px',
  },
  section: { // Re-used from LeavePage for consistency
    backgroundColor: '#ffffff',
    padding: '20px 25px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '25px',
  },
  balanceSummaryContainerStyle: { // Re-used from LeavePage
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
  },
  // Copied from LeavePage for consistency for the select dropdown, can be centralized
  inputStyling: {
    width: 'auto', // Override width: '100%' if it was part of a global input style
    // padding: '10px 12px', // Defined in yearFilter
    // border: '1px solid #ccc', // Defined in yearFilter
    // borderRadius: '5px', // Defined in yearFilter
    boxSizing: 'border-box',
    fontSize: '1em',
    fontFamily: "'Segoe UI', sans-serif",
  },
};

export default LeaveBalancesPage;
