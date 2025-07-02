import React, { useState, useEffect } from 'react';
import { getLeaveBalances } from '../services/leaveService';
import LeaveBalanceCard from '../components/LeaveBalanceCard';

const LeaveBalancesPage = () => {
  const [leaveBalances, setLeaveBalances] = useState([]);
  // selectedYear, handleYearChange, handleDownload, yearsForFilter removed as controls are removed

  useEffect(() => {
    // getLeaveBalances service does not currently use year, so selectedYear dependency removed.
    getLeaveBalances().then(balances => {
      setLeaveBalances(balances);
    }).catch(err => {
      console.error("Failed to fetch leave balances:", err);
      setLeaveBalances([]);
    });
  }, []); // Fetch once on mount

  return (
    <div style={styles.pageContainer}>
      <h1 style={styles.pageTitle}>My Leave Balances</h1>

      <section style={{...styles.section, ...styles.balanceSummaryContainerStyle, marginTop: '20px' /* Ensure some margin if title is directly above */ }}>
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
    // padding: '0px',
  },
  // topActionRow style removed
  pageTitle: {
    fontSize: '1.8em',
    color: '#333',
    fontWeight: '600',
    marginBottom: '20px', // Add margin below title if topActionRow is gone
  },
  // filtersAndActions style removed
  // yearFilter style removed
  // actionButton style removed (or kept if generic and used elsewhere, but not on this page)

  section: {
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
