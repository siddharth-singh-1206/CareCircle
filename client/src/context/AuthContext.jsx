import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('carecircle_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [family, setFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged in user and family members
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('carecircle_token');
      if (!token) {
        setLoading(false);
        return;
      }
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setFamily(res.data.family);
        if (res.data.family && res.data.family.members) {
          setMembers(res.data.family.members);
          setSelectedMember((prev) => {
            if (prev && res.data.family.members.some((m) => m._id === prev._id)) {
              return res.data.family.members.find((m) => m._id === prev._id);
            }
            return res.data.family.members[0] || null;
          });
        }
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('carecircle_token', res.data.token);
        localStorage.setItem('carecircle_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        await fetchUserProfile();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      console.error('Login error:', err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Cannot connect to backend server. Please make sure the server is running on port 5000 (cd server; npm run dev)',
      };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        localStorage.setItem('carecircle_token', res.data.token);
        localStorage.setItem('carecircle_user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        await fetchUserProfile();
        return { success: true };
      }
      return { success: false, message: res.data.message };
    } catch (err) {
      console.error('Registration error:', err);
      return {
        success: false,
        message:
          err.response?.data?.message ||
          'Cannot connect to backend server. Please make sure the server is running on port 5000',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('carecircle_token');
    localStorage.removeItem('carecircle_user');
    setUser(null);
    setFamily(null);
    setMembers([]);
    setSelectedMember(null);
  };

  const refreshMembers = async () => {
    try {
      const res = await api.get('/members');
      if (res.data.success) {
        setMembers(res.data.members);
        if (!selectedMember && res.data.members.length > 0) {
          setSelectedMember(res.data.members[0]);
        }
      }
    } catch (err) {
      console.error('Error refreshing members:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        family,
        members,
        selectedMember,
        setSelectedMember,
        loading,
        login,
        register,
        logout,
        refreshMembers,
        fetchUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
