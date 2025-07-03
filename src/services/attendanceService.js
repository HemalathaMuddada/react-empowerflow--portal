// Dummy attendance data
// This would be more complex in a real system, involving daily logs, etc.
let attendanceData = {
  'employee@example.com': {
    regularizations: [
      { id: 'AR001', date: '2023-12-15', reason: 'Forgot to punch out', status: 'Pending', submittedOn: '2023-12-16' },
    ],
    logs: [ // Simple daily log example
      { date: '2024-01-08', checkIn: '09:05', checkOut: '17:55', workedHours: '8h 50m', status: 'Present' },
      { date: '2024-01-09', checkIn: '09:00', checkOut: '18:05', workedHours: '9h 05m', status: 'Present' },
    ],
    summary: {
        month: 'January 2024',
        daysPresent: 2,
        daysAbsent: 0,
        lateMarks: 1,
    }
  },
  // ... other users
};

// Simulates fetching pending attendance regularizations count for a user
export const getPendingRegularizationsCount = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userData = attendanceData[userId];
      if (userData && userData.regularizations) {
        const pendingCount = userData.regularizations.filter(r => r.status === 'Pending').length;
        resolve(pendingCount);
      } else {
        resolve(0);
      }
    }, 250);
  });
};

// Simulates fetching attendance logs for a user for a period
export const getAttendanceLogs = (userId, period) => { // period could be { month: 1, year: 2024 }
  return new Promise((resolve) => {
    setTimeout(() => {
      const userData = attendanceData[userId];
      // For now, just return all logs for the dummy user
      resolve(userData ? JSON.parse(JSON.stringify(userData.logs)) : []);
    }, 400);
  });
};

// Simulates submitting a new attendance log (manual check-in/out)
export const addAttendanceLog = (userId, logEntry) => { // logEntry: { date, checkIn, checkOut }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!attendanceData[userId]) {
        attendanceData[userId] = { regularizations: [], logs: [], summary: {} };
      }
      // Basic calculation for workedHours (can be improved)
      const workedHours = 'N/A'; // Placeholder, would need time diff logic
      const newLog = { ...logEntry, workedHours, status: 'Present' }; // Assume present if logged
      attendanceData[userId].logs.push(newLog);
      resolve({ message: 'Attendance logged successfully.', log: newLog });
    }, 500);
  });
};

// Simulates submitting an attendance regularization request
export const applyRegularization = (userId, requestData) => { // requestData: { date, reason, checkInTime, checkOutTime }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!attendanceData[userId]) {
        attendanceData[userId] = { regularizations: [], logs: [], summary: {} };
      }
      const newRequest = {
        id: `AR${String(attendanceData[userId].regularizations.length + 1).padStart(3, '0')}`,
        ...requestData,
        status: 'Pending',
        submittedOn: new Date().toISOString().split('T')[0],
      };
      attendanceData[userId].regularizations.push(newRequest);
      resolve({ message: 'Regularization request submitted.', request: newRequest });
    }, 600);
  });
};
