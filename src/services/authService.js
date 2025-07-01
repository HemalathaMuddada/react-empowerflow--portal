// Dummy user data
const users = {
  "lead@example.com": { password: "password", role: "lead", name: "Lee Adama" },
  "manager@example.com": { password: "password", role: "manager", name: "Laura Roslin" },
  "hr@example.com": { password: "password", role: "hr", name: "Tom Zarek" },
  "superadmin@example.com": { password: "password", role: "superadmin", name: "William Adama" },
  "employee@example.com": { password: "password", role: "employee", name: "Kara Thrace" },
};

export const login = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users[email] && users[email].password === password) {
        const { role, name } = users[email];
        resolve({ email, role, name, token: `dummy-token-${email}-${Date.now()}` });
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
        users[email] = { password, role, name };
        resolve({ email, role, name });
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
        return users[email];
    }
    return null;
}
