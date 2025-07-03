// Dummy performance review data
const performanceData = {
  'employee@example.com': {
    currentCycle: {
      name: 'Annual Review 2023-2024',
      status: 'Self-appraisal Due', // Possible statuses: Not Started, Self-appraisal Due, Manager Review, HR Review, Completed
      deadline: '2024-01-31',
      overallRating: null, // Populated after completion
      goals: [
        { id: 'G01', description: 'Improve project delivery time by 10%', status: 'On Track' },
        { id: 'G02', description: 'Complete Advanced React Certification', status: 'Pending Self-Update' },
      ],
    },
    history: [
      { cycleName: 'Mid-Year Review 2023', status: 'Completed', overallRating: 'Exceeds Expectations', completedOn: '2023-07-15' },
    ],
  },
  'lead@example.com': {
    currentCycle: {
      name: 'Annual Review 2023-2024',
      status: 'Manager Review Pending for Team',
      deadline: '2024-02-15', // Deadline for manager to complete reviews
    }
    // ... more data for lead
  }
};

// Simulates fetching current performance review status for a user
export const getPerformanceReviewStatus = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userData = performanceData[userId];
      if (userData && userData.currentCycle) {
        resolve(userData.currentCycle.status); // e.g., "Self-appraisal Due"
      } else {
        resolve('Not Started'); // Default if no cycle active or user not found
      }
    }, 300);
  });
};

// Simulates fetching full performance review details for a user
export const getPerformanceReviewDetails = (userId, cycleName = null) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userData = performanceData[userId];
      if (!userData) {
        return reject({ message: 'Performance data not found for user.' });
      }
      if (cycleName) { // Fetch a specific historical cycle
        const cycle = userData.history.find(c => c.cycleName === cycleName);
        if (cycle) {
          resolve(JSON.parse(JSON.stringify(cycle)));
        } else {
          reject({ message: `Review cycle '${cycleName}' not found.`});
        }
      } else { // Fetch current cycle
        resolve(JSON.parse(JSON.stringify(userData.currentCycle || {})));
      }
    }, 500);
  });
};

// Simulates submitting self-appraisal
export const submitSelfAppraisal = (userId, appraisalData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userData = performanceData[userId];
      if (!userData || !userData.currentCycle || userData.currentCycle.status !== 'Self-appraisal Due') {
        return reject({ message: 'Not eligible for self-appraisal submission at this time.' });
      }
      // Here, you'd update goals, add comments, etc.
      // For dummy, just change status
      userData.currentCycle.status = 'Manager Review';
      userData.currentCycle.selfAppraisalData = appraisalData; // Store submitted data
      resolve({ message: 'Self-appraisal submitted successfully.', cycle: userData.currentCycle });
    }, 700);
  });
};
