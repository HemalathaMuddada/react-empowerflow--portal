import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getUserData } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session (e.g., in localStorage)
    const savedUser = localStorage.getItem('empowerFlowUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Optionally, you might want to verify the token or user data with a backend here
        // For this dummy setup, we'll just use the stored data.
        // Let's also fetch the full user data including name.
        const fullUserData = getUserData(parsedUser.email);
        if (fullUserData) {
            setUser({ ...parsedUser, name: fullUserData.name });
        } else {
            localStorage.removeItem('empowerFlowUser'); // Clear invalid stored user
        }
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem('empowerFlowUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await apiLogin(email, password);
      setUser(userData);
      localStorage.setItem('empowerFlowUser', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    localStorage.removeItem('empowerFlowUser');
  };

  // Add signup to context if needed, or handle it directly in SignupPage
  // For now, login and logout are primary for AuthContext

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
