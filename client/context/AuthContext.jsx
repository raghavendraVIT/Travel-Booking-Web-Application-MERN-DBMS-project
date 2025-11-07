import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/users/login', { email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return true;
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || error.message);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/users/register', { name, email, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            return true;
        } catch (error) {
            console.error('Registration failed:', error.response?.data?.message || error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/auth');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
