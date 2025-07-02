// Dummy leave data for a user
// In a real app, this would be fetched based on the logged-in user
let userLeaveData = { // Data for employee@example.com (Kara Thrace, female)
  balances: [
    { type: 'Annual', balance: 12, total: 20 },
    { type: 'Sick', balance: 8, total: 10 },
    { type: 'Casual', balance: 5, total: 5 },
    { type: 'Compensatory Off', balance: 2, total: 5 }, // Earned against extra work
    { type: 'Maternity', balance: 0, total: 180 }, // Example, might not be applicable to this specific dummy user
    { type: 'Paternity', balance: 0, total: 15 },  // Example
    { type: 'LOP Taken', value: 1, unit: 'days this year' }, // Different structure: just a value and unit
    { type: 'Bereavement', balance: 3, total: 3 },
  ],
  history: [
    { id: 'L001', type: 'Annual', startDate: '2023-11-10', endDate: '2023-11-12', days: 3, status: 'Approved', reason: 'Vacation', appliedOn: '2023-11-01' },
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
export const applyForLeave = (applicationData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const {
        leaveType,
        startDate,
        endDate,
        reason,
        days, // Use pre-calculated days
        startDateSession,
        endDateSession,
        contactNumber,
        // attachedFileName
      } = applicationData;

      // Basic validation (can be expanded)
      if (!leaveType || !startDate || !endDate || !reason || days === undefined || days <= 0) {
        return reject({ message: 'All fields are required and leave days must be greater than 0.' });
      }
      // Date validation already done client-side, but can re-verify if needed:
      // const start = new Date(startDate);
      // const end = new Date(endDate);
      // if (start > end) {
      //   return reject({ message: 'End date cannot be before start date.' });
      // }

      const balanceEntry = userLeaveData.balances.find(b => b.type === leaveType);
      if (!balanceEntry) {
        return reject({ message: `Invalid leave type: ${leaveType}` });
      }
      // Check balance for leave types that have one (LOP Taken does not)
      if (balanceEntry.balance !== undefined && balanceEntry.balance < days) {
        return reject({ message: `Insufficient ${leaveType} leave balance.` });
      }

      const newLeave = {
        id: `L${String(userLeaveData.history.length + 1).padStart(3, '0')}`,
        type: leaveType,
        startDate,
        endDate,
        startDateSession, // Store session details
        endDateSession,   // Store session details
        days, // Use the days calculated by UI
        status: 'Pending',
        reason,
        contactNumber: contactNumber || '', // Store contact number
        // attachment: attachedFileName || null, // Store attachment info
        appliedOn: new Date().toISOString().split('T')[0],
      };

      userLeaveData.history.push(newLeave);
      // No balance deduction on application in this dummy service.
      // If implemented, it should use the 'days' value.
      // if (balanceEntry.balance !== undefined) balanceEntry.balance -= days;

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
