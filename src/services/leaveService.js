// Dummy leave data for a user
// In a real app, this would be fetched based on the logged-in user
let userLeaveData = {
  balances: [
    { type: 'Annual', balance: 12, total: 20 },
    { type: 'Sick', balance: 8, total: 10 },
    { type: 'Casual', balance: 5, total: 5 },
  ],
  history: [
    { id: 'L001', type: 'Annual', startDate: '2023-11-10', endDate: '2023-11-12', days: 3, status: 'Approved', reason: 'Vacation' },
    { id: 'L002', type: 'Sick', startDate: '2023-12-01', endDate: '2023-12-01', days: 1, status: 'Approved', reason: 'Fever' },
    { id: 'L003', type: 'Casual', startDate: '2024-01-05', endDate: '2024-01-05', days: 1, status: 'Pending', reason: 'Personal Errand' },
  ],
};

// Simulates fetching leave balances for the current user
export const getLeaveBalances = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(userLeaveData.balances))); // Deep copy
    }, 400);
  });
};

// Simulates fetching leave history for the current user
export const getLeaveHistory = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(JSON.parse(JSON.stringify(userLeaveData.history))); // Deep copy
    }, 400);
  });
};

// Simulates applying for leave
export const applyForLeave = (leaveApplication) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const { leaveType, startDate, endDate, reason } = leaveApplication;
      // Basic validation (can be expanded)
      if (!leaveType || !startDate || !endDate || !reason) {
        return reject({ message: 'All fields are required for leave application.' });
      }

      // Calculate days (simple version, can be improved with date-fns or similar)
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return reject({ message: 'End date cannot be before start date.' });
      }
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start day

      const balanceEntry = userLeaveData.balances.find(b => b.type === leaveType);
      if (!balanceEntry) {
        return reject({ message: `Invalid leave type: ${leaveType}` });
      }
      if (balanceEntry.balance < diffDays) {
        return reject({ message: `Insufficient ${leaveType} leave balance.` });
      }

      const newLeave = {
        id: `L${String(userLeaveData.history.length + 1).padStart(3, '0')}`,
        type: leaveType,
        startDate,
        endDate,
        days: diffDays,
        status: 'Pending', // Default status
        reason,
        appliedOn: new Date().toISOString().split('T')[0],
      };

      userLeaveData.history.push(newLeave);
      // Optionally, deduct from balance if auto-deduction on apply is desired,
      // or wait for approval. For now, we'll let it be pending without deduction.
      // balanceEntry.balance -= diffDays;

      resolve({ message: 'Leave applied successfully. Awaiting approval.', leave: newLeave });
    }, 600);
  });
};

// Simulates cancelling a leave request (if it's pending)
export const cancelLeaveRequest = (leaveId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const leaveIndex = userLeaveData.history.findIndex(l => l.id === leaveId);
      if (leaveIndex === -1) {
        return reject({ message: 'Leave request not found.' });
      }
      if (userLeaveData.history[leaveIndex].status !== 'Pending') {
        return reject({ message: 'Only pending leave requests can be cancelled.' });
      }
      userLeaveData.history.splice(leaveIndex, 1); // Remove the leave request
      resolve({ message: 'Leave request cancelled successfully.' });
    }, 500);
  });
};
