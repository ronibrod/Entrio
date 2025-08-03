import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const UserContext = createContext()

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [initialLoad, setInitialLoad] = useState(false)
  const [authError, setAuthError] = useState(null)

  const getToken = () => localStorage.getItem('token')

  const setAuthHeader = () => {
    const token = getToken()
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }

  useEffect(() => {
    setAuthHeader();
    const checkSession = async () => {
      try {
        const { data } = await axios.get('/api/auth/me');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setInitialLoad(true);
      }
    };

    checkSession();
  }, []);

  const signin = useCallback(async (company, password) => {
    try {
      const { data } = await axios.post('/api/auth/login', { company, password });
      localStorage.setItem('token', data.token);
      setAuthHeader();
      setUser(null);
      setAuthError(null);
      return data;
    } catch (error) {
      setUser(null);
      setAuthError(error);
      throw error;
    }
  }, []);

  const signup = useCallback(async (company, password) => {
    try {
      const { data } = await axios.post('/api/auth/signup', { company, password });
      localStorage.setItem('token', data.token);
      setAuthHeader();
      setUser(null);
      setAuthError(null);
      return data;
    } catch (error) {
      setUser(null);
      setAuthError(error);
      throw error;
    }
  }, []);

  const signout = useCallback(() => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        initialLoad,
        signin,
        signup,
        signout,
        authError,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
