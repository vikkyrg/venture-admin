import { createContext, useState, useEffect, useContext } from 'react';
import { loginAdmin as loginApi, getAdminProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('adminUser')) || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await getAdminProfile();
          setUser(res.data);
          localStorage.setItem('adminUser', JSON.stringify(res.data));
        } catch (err) {
          console.error('Token verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const res = await loginApi({ email, password });
    if (res.success) {
      const { token: newToken, _id, name, email: adminEmail, role } = res.data;
      const userData = { _id, name, email: adminEmail, role };
      
      setToken(newToken);
      setUser(userData);

      localStorage.setItem('adminToken', newToken);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      return res;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  return (
    <AuthContext.Provider value={{ token, user, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
