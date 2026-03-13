/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearAuthToken, getMe, login as apiLogin, loginWithGoogle as apiLoginWithGoogle, logoutUser, setAuthToken } from '../services/api';
import { clearGuestPreviewState } from '../utils/previewGate';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const me = await getMe();
                setUser(me);
                setIsAuthenticated(true);
            } catch {
                // Not authenticated or token expired
                clearAuthToken();
                setIsAuthenticated(false);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();
    }, []);

    const login = async (email, password) => {
        const res = await apiLogin(email, password);
        setAuthToken(res.accessToken);
        clearGuestPreviewState();
        setUser(res.user);
        setIsAuthenticated(true);
        return res;
    };

    const loginWithGoogle = async (credential) => {
        const res = await apiLoginWithGoogle(credential);
        setAuthToken(res.accessToken);
        clearGuestPreviewState();
        setUser(res.user);
        setIsAuthenticated(true);
        return res;
    };

    const logout = async () => {
        try {
            await logoutUser();
        } catch (e) {
            console.warn('Logout API failed', e);
        }
        clearAuthToken();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, loginWithGoogle, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
