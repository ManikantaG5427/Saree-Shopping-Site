import React, { createContext, useContext, useState, useEffect } from 'react';
import { formatDate } from '../lib/utils.js';
import { authService } from '../api/authService.js';

const AuthContext = createContext(undefined);

const MOCK_USERS_KEY = 'saree_web_users';
const CURRENT_USER_KEY = 'saree_web_current_user';

const DEFAULT_USERS = {
  'admin@slshweaves.com': {
    id: 'user_admin',
    name: 'SLSH Administrator',
    email: 'admin@slshweaves.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91 94404 74742',
    addresses: [],
    createdAt: '2023-01-01',
  },
  'demo@slshweaves.com': {
    id: 'user_demo',
    name: 'Priya Sharma',
    email: 'demo@slshweaves.com',
    password: 'password123',
    role: 'customer',
    phone: '+91 98765 43210',
    addresses: [],
    createdAt: '2024-01-01',
  }
};

const getStoredUsers = () => {
  try {
    const custom = JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || '{}');
    return { ...DEFAULT_USERS, ...custom };
  } catch {
    return DEFAULT_USERS;
  }
};

const setStoredUsers = (users) => {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from local storage or server /me
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      }

      // If token exists, attempt to verify with backend
      const token = localStorage.getItem('saree_web_token');
      if (token) {
        try {
          const profile = await authService.getProfile();
          if (profile) {
            setUser(profile);
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
          }
        } catch {
          // Keep local user if backend is offline
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. Instant check for Admin or local users (guaranteed 100% success on Vercel or offline)
    if (cleanEmail === 'admin@slshweaves.com' && cleanPassword === 'admin123') {
      const adminUser = {
        id: 'user_admin',
        name: 'SLSH Administrator',
        email: 'admin@slshweaves.com',
        role: 'admin',
        phone: '+91 94404 74742',
        addresses: [],
        createdAt: '2023-01-01',
      };
      setUser(adminUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(adminUser));
      return true;
    }

    const users = getStoredUsers();
    const userData = users[cleanEmail];
    if (userData && userData.password === cleanPassword) {
      const { password: _, ...userWithoutPassword } = userData;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      return true;
    }

    // 2. Try real MERN backend API if available
    try {
      const res = await authService.login(cleanEmail, cleanPassword);
      if (res && typeof res === 'object' && res.user) {
        setUser(res.user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
        return true;
      }
    } catch {
      // Backend offline
    }

    return false;
  };

  const register = async (name, email, password, phone) => {
    // 1. Try real MERN backend API
    try {
      const res = await authService.register(name, email, password, phone);
      if (res?.user) {
        setUser(res.user);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(res.user));
        return true;
      }
    } catch {
      // Fallback to local storage if backend offline
    }

    // 2. Local fallback
    const users = getStoredUsers();
    if (users[email]) {
      return false;
    }

    const newUser = {
      id: 'user_' + Date.now(),
      name,
      email,
      phone,
      role: 'customer',
      addresses: [],
      createdAt: formatDate(new Date().toISOString()),
    };

    users[email] = { ...newUser, password };
    setStoredUsers(users);
    
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    authService.logout().catch(() => {});
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = async (data) => {
    if (!user) return;

    try {
      await authService.updateProfile(data);
    } catch {
      // Continue locally
    }
    
    const users = getStoredUsers();
    const updatedUser = { ...user, ...data };
    users[user.email] = { ...users[user.email], ...data };
    setStoredUsers(users);
    
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!user) return false;
    const users = getStoredUsers();
    const userData = users[user.email];
    if (userData && userData.password === currentPassword) {
      users[user.email].password = newPassword;
      setStoredUsers(users);
      return true;
    }
    return false;
  };

  const addAddress = async (address) => {
    if (!user) return;
    const newAddress = {
      ...address,
      id: 'addr_' + Date.now(),
    };
    const addresses = [...(user.addresses || [])];
    if (newAddress.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    } else if (addresses.length === 0) {
      newAddress.isDefault = true;
    }
    addresses.push(newAddress);
    await updateProfile({ addresses });
  };

  const updateAddress = async (id, address) => {
    if (!user) return;
    let addresses = [...(user.addresses || [])];
    if (address.isDefault) {
      addresses.forEach(a => a.isDefault = false);
    }
    addresses = addresses.map(a => a.id === id ? { ...a, ...address } : a);
    await updateProfile({ addresses });
  };

  const deleteAddress = async (id) => {
    if (!user) return;
    let addresses = (user.addresses || []).filter(a => a.id !== id);
    if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
      addresses[0].isDefault = true;
    }
    await updateProfile({ addresses });
  };

  const setDefaultAddress = async (id) => {
    if (!user) return;
    const addresses = (user.addresses || []).map(a => ({
      ...a,
      isDefault: a.id === id,
    }));
    await updateProfile({ addresses });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
