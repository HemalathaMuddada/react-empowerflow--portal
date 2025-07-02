// Dummy payslip data
// In a real app, actual payslip files (PDFs) might be stored securely and fetched.
// For this dummy service, we'll just store metadata and maybe simple structured data.
const payslips = [
  {
    id: 'PS001',
    month: 'November',
    year: 2023,
    userId: 'employee@example.com',
    fileName: 'Payslip_Nov_2023.pdf',
    issueDate: '2023-11-30',
    // Basic salary details (example)
    details: {
      basic: 50000,
      hra: 20000,
      specialAllowance: 10000,
      grossEarnings: 80000,
      incomeTax: 5000,
      providentFund: 3600,
      totalDeductions: 8600,
      netSalary: 71400,
    }
  },
  {
    id: 'PS002',
    month: 'October',
    year: 2023,
    userId: 'employee@example.com',
    fileName: 'Payslip_Oct_2023.pdf',
    issueDate: '2023-10-31',
    details: {
      basic: 50000,
      hra: 20000,
      specialAllowance: 10000,
      grossEarnings: 80000,
      incomeTax: 5000,
      providentFund: 3600,
      totalDeductions: 8600,
      netSalary: 71400,
    }
  },
   {
    id: 'PS003',
    month: 'November',
    year: 2023,
    userId: 'lead@example.com',
    fileName: 'Payslip_Nov_2023_Lead.pdf',
    issueDate: '2023-11-30',
    details: { /* ... different salary structure ... */ netSalary: 90000 }
  },
];

// Simulates fetching payslip list for a user
export const getPayslips = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const userPayslips = payslips.filter(p => p.userId === userId)
                                 .sort((a,b) => new Date(b.issueDate) - new Date(a.issueDate)); // Newest first
      resolve(JSON.parse(JSON.stringify(userPayslips)));
    }, 450);
  });
};

// Simulates fetching a specific payslip's details (or a dummy file content)
export const getPayslipDetails = (payslipId, userId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const payslip = payslips.find(p => p.id === payslipId && p.userId === userId);
      if (payslip) {
        // In a real scenario, this might return a link to a PDF or file stream.
        // Here, we return the metadata including structured details.
        resolve(JSON.parse(JSON.stringify(payslip)));
      } else {
        reject({ message: 'Payslip not found or access denied.' });
      }
    }, 300);
  });
};

// Function to get the most recent payslip status for dashboard card
export const getRecentPayslipStatus = (userId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userPayslips = payslips.filter(p => p.userId === userId)
                                     .sort((a,b) => new Date(b.issueDate) - new Date(a.issueDate));
            if (userPayslips.length > 0) {
                resolve(`View ${userPayslips[0].month}`);
            } else {
                resolve('N/A');
            }
        }, 200);
    });
};
