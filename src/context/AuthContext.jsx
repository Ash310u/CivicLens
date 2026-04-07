import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = {
  'citizen@civic.lens': { id: '1', name: 'Hamza Ali Mazari', email: 'citizen@civic.lens', role: 'citizen', ward_id: 'W-14', city_id: 'BLR', impact_score: 1250, avatar: null },
  'authority@civic.lens': { id: '2', name: 'Jameel Jamali', email: 'authority@civic.lens', role: 'authority', ward_id: 'W-14', city_id: 'BLR', department: 'Solid Waste Management', tier: 'ward' },
  'admin@civic.lens': { id: '3', name: 'Ajay Sanyal', email: 'admin@civic.lens', role: 'admin', city_id: 'BLR' },
  'org@civic.lens': { id: '4', name: 'RAW', email: 'org@civic.lens', role: 'organization', org_id: 'ORG-1', city_id: 'BLR' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('civiclens-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('civiclens-token'));

  const login = useCallback(async (email, password) => {
    // Mock login
    const mockUser = MOCK_USERS[email];
    if (mockUser) {
      const mockToken = btoa(JSON.stringify({ user_id: mockUser.id, role: mockUser.role, exp: Date.now() + 86400000 }));
      setUser(mockUser);
      setToken(mockToken);
      localStorage.setItem('civiclens-user', JSON.stringify(mockUser));
      localStorage.setItem('civiclens-token', mockToken);
      return { success: true, user: mockUser };
    }
    return { success: false, error: 'Invalid credentials' };
  }, []);

  const signup = useCallback(async (data) => {
    const newUser = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email,
      role: data.role || 'citizen',
      ward_id: data.ward_id || 'W-1',
      city_id: data.city_id || 'BLR',
      impact_score: 0,
    };
    const mockToken = btoa(JSON.stringify({ user_id: newUser.id, role: newUser.role, exp: Date.now() + 86400000 }));
    setUser(newUser);
    setToken(mockToken);
    localStorage.setItem('civiclens-user', JSON.stringify(newUser));
    localStorage.setItem('civiclens-token', mockToken);
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('civiclens-user');
    localStorage.removeItem('civiclens-token');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
