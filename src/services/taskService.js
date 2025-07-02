// Dummy task data
let tasks = [
  { id: 'T001', title: 'Complete Q4 Expense Report', status: 'Pending', dueDate: '2024-01-15', priority: 'High', assignedTo: 'employee@example.com', description: 'Submit all receipts and expense details for Q4.' },
  { id: 'T002', title: 'Prepare Presentation for Client Meeting', status: 'In Progress', dueDate: '2024-01-20', priority: 'High', assignedTo: 'employee@example.com', description: 'Client X meeting on Jan 22nd.' },
  { id: 'T003', title: 'Update Team Wiki with New Guidelines', status: 'Pending', dueDate: '2024-01-25', priority: 'Medium', assignedTo: 'lead@example.com', description: 'Incorporate feedback from the last review.' },
  { id: 'T004', title: 'Review Junior Developer Code Submissions', status: 'Done', dueDate: '2023-12-28', priority: 'Medium', assignedTo: 'lead@example.com', description: 'Check PRs #101, #102.' },
  { id: 'T005', title: 'Mandatory Compliance Training Module', status: 'Pending', dueDate: '2024-02-01', priority: 'High', assignedTo: 'employee@example.com', description: 'Complete the annual compliance training.' },
];

// Simulates fetching tasks for the current user (or all for an admin/manager)
// For simplicity, let's assume it fetches tasks assigned to a user or all if no userId.
export const getTasks = (userId = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userId) {
        resolve(JSON.parse(JSON.stringify(tasks.filter(task => task.assignedTo === userId))));
      } else {
        resolve(JSON.parse(JSON.stringify(tasks))); // Return all for a generic view
      }
    }, 350);
  });
};

// Simulates fetching pending tasks count for a user
export const getPendingTasksCount = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pendingCount = tasks.filter(task => task.assignedTo === userId && task.status === 'Pending').length;
      resolve(pendingCount);
    }, 200);
  });
};

// Simulates updating a task status
export const updateTaskStatus = (taskId, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex === -1) {
        return reject({ message: 'Task not found.' });
      }
      tasks[taskIndex].status = newStatus;
      resolve({ message: 'Task status updated successfully.', task: tasks[taskIndex] });
    }, 400);
  });
};

// Simulates adding a new task (e.g., by a manager or lead)
export const addTask = (taskData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!taskData.title || !taskData.assignedTo || !taskData.dueDate) {
        return reject({ message: 'Title, assigned user, and due date are required.'});
      }
      const newTask = {
        id: `T${String(tasks.length + 1).padStart(3, '0')}`,
        status: 'Pending', // Default status
        priority: 'Medium', // Default priority
        ...taskData,
      };
      tasks.push(newTask);
      resolve({ message: 'Task added successfully.', task: newTask });
    }, 500);
  });
};
