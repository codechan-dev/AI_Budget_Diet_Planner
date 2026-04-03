import { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/auth`
    : 'http://localhost:3000/api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch {
            return null;
        }
    });
    const [authError, setAuthError] = useState(null);
    const [authLoading, setAuthLoading] = useState(false);

    const saveSession = (tkn, usr) => {
        localStorage.setItem('token', tkn);
        localStorage.setItem('user', JSON.stringify(usr));
        setToken(tkn);
        setUser(usr);
    };

    const register = useCallback(async ({ name, email, password }) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const { data } = await axios.post(`${BASE_URL}/register`, { name, email, password });
            saveSession(data.token, data.user);
            return true;
        } catch (err) {
            setAuthError(err.response?.data?.error || 'Registration failed.');
            return false;
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const login = useCallback(async ({ email, password }) => {
        setAuthLoading(true);
        setAuthError(null);
        try {
            const { data } = await axios.post(`${BASE_URL}/login`, { email, password });
            saveSession(data.token, data.user);
            return true;
        } catch (err) {
            setAuthError(err.response?.data?.error || 'Login failed.');
            return false;
        } finally {
            setAuthLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    const clearAuthError = useCallback(() => setAuthError(null), []);

    return (
        <AuthContext.Provider value={{ token, user, authLoading, authError, register, login, logout, clearAuthError }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
