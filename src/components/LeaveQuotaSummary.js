import React, { useState, useEffect } from 'react';
import { getLeaveBalances } from '../services/leaveService';

const LeaveQuotaSummary = () => {
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const balances = await getLeaveBalances();
        // Filter out LOP Taken or any other types not typically shown as 'quota'
        const relevantBalances = balances.filter(b => b.type !== 'LOP Taken' && b.balance !== undefined);
        setLeaveBalances(relevantBalances);
      } catch (err) {
        console.error("Failed to fetch leave balances for Quota Summary:", err);
        setError('Could not load leave quota.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBalances();
  }, []);

  const getIconForLeaveType = (type) => {
    // Basic icons, can be replaced with SVGs or font icons
    switch (type) {
      case 'Annual': return '🏖️';
      case 'Sick': return '🤒';
      case 'Casual': return '🚶';
      case 'Compensatory Off': return '➕';
      case 'Maternity': return '🤰';
      case 'Paternity': return '👨‍🍼';
      case 'Bereavement': return '🖤';
      default: return '📄';
    }
  };

  if (isLoading) {
    return <div style={styles.loading}>Loading leave quotas...</div>;
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  if (leaveBalances.length === 0) {
    return <div style={styles.noData}>No leave quotas available.</div>;
  }

  return (
    <div style={styles.summaryContainer}>
      <h3 style={styles.sectionTitle}>Leave Quota</h3>
      <div style={styles.cardsGrid}>
        {leaveBalances.map(balance => (
          <div key={balance.type} style={styles.quotaCard}>
            <div style={styles.cardHeader}>
              <span style={styles.cardIcon}>{getIconForLeaveType(balance.type)}</span>
              <span style={styles.cardTitle}>{balance.type}</span>
            </div>
            <div style={styles.cardBody}>
              <span style={styles.balanceValue}>{String(balance.balance).padStart(2, '0')}</span>
              <span style={styles.balanceUnit}>Days</span>
            </div>
            <div style={styles.cardFooter}>
              Total: {balance.total} Days
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  summaryContainer: {
    padding: '15px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", // Match image font style
  },
  sectionTitle: {
    fontSize: '1.1em', // Adjusted from image
    fontWeight: '600',
    color: '#333',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
  },
  cardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', // Responsive grid
    gap: '15px',
  },
  quotaCard: {
    backgroundColor: '#f9f9f9', // Light background for cards
    borderRadius: '8px',
    padding: '15px',
    textAlign: 'center',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    // ':hover': { // This would need a library like Radium or styled-components for inline hover
    //   transform: 'translateY(-3px)',
    //   boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    // }
  },
  cardHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '10px',
  },
  cardIcon: {
    fontSize: '1.8em', // Larger icon
    marginBottom: '5px',
  },
  cardTitle: {
    fontSize: '0.9em',
    color: '#555',
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: '10px',
  },
  balanceValue: {
    fontSize: '2em', // Prominent balance value
    fontWeight: 'bold',
    color: '#2c3e50', // Darker color for value
    marginRight: '5px',
  },
  balanceUnit: {
    fontSize: '0.9em',
    color: '#777',
  },
  cardFooter: {
    fontSize: '0.8em',
    color: '#666',
    borderTop: '1px solid #eee',
    paddingTop: '8px',
    marginTop: '8px',
  },
  loading: {
    padding: '20px',
    textAlign: 'center',
    color: '#555',
  },
  error: {
    padding: '20px',
    textAlign: 'center',
    color: 'red',
  },
  noData: {
    padding: '20px',
    textAlign: 'center',
    color: '#777',
  }
};

export default LeaveQuotaSummary;
