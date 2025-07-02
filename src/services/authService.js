// Dummy user data
const users = {
  "lead@example.com": { password: "password", role: "lead", name: "Lee Adama", gender: "male" },
  "manager@example.com": { password: "password", role: "manager", name: "Laura Roslin", gender: "female" },
  "hr@example.com": { password: "password", role: "hr", name: "Tom Zarek", gender: "male" },
  "superadmin@example.com": { password: "password", role: "superadmin", name: "William Adama", gender: "male" },
  "employee@example.com": { password: "password", role: "employee", name: "Kara Thrace", gender: "female" },
};

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users[email] && users[email].password === password) {
        // Include gender in the resolved user object
        const { role, name, gender } = users[email];
        resolve({ email, role, name, gender, token: `dummy-token-${email}-${Date.now()}` });
      } else {
        reject("Invalid email or password");
      }
    }, 500);
  });
};

// Add a signup function for later use
export const signup = (name, email, password, role) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users[email]) {
        reject("User already exists");
      } else {
        // Add a default gender for new signups
        users[email] = { password, role, name, gender: "neutral" };
        resolve({ email, role, name, gender: "neutral" });
        console.log("Updated users:", users); // For debugging
      }
    }, 500);
  });
};

export const logout = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 200);
  });
};

export const getUserData = (email) => {
    if (users[email]) {
        // Ensure gender is returned if available, otherwise it might be undefined for older structures
        const { password, role, name, gender } = users[email];
        return { password, role, name, gender: gender || "neutral" }; // Default if gender somehow missing
    }
    return null;
}
