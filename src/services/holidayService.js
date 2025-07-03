// Dummy data for holidays
const holidays = [
  { date: '2024-01-01', name: 'New Year\'s Day', type: 'National Holiday' },
  { date: '2024-03-25', name: 'Holi', type: 'Optional Holiday' },
  { date: '2024-04-14', name: 'Ambedkar Jayanti', type: 'National Holiday' },
  { date: '2024-08-15', name: 'Independence Day', type: 'National Holiday' },
  { date: '2024-10-02', name: 'Gandhi Jayanti', type: 'National Holiday' },
  { date: '2024-10-31', name: 'Diwali', type: 'National Holiday' },
  { date: '2024-12-25', name: 'Christmas Day', type: 'National Holiday' },
];

// Simulates fetching all holidays
export const getHolidays = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...holidays]); // Return a copy to prevent direct modification
    }, 300); // Simulate API delay
  });
};

// Simulates fetching upcoming holidays (e.g., next 2)
export const getUpcomingHolidays = (count = 2) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to start of day for comparison

      const upcoming = holidays
        .filter(holiday => new Date(holiday.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Sort by date
        .slice(0, count);
      resolve(upcoming);
    }, 300);
  });
};
