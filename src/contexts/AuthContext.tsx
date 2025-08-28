'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types/user';
import { authAPI } from '../lib/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    verifyEmail: (token: string) => Promise<void>;
    requestPasswordReset: (email: string) => Promise<void>;
    resetPassword: (token: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check for existing token on app load
        const storedToken = localStorage.getItem('ramein_token');
        if (storedToken) {
            setToken(storedToken);
            // Fetch user profile
            fetchUserProfile(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchUserProfile = async (userToken: string) => {
        try {
            const userProfile = await authAPI.getProfile(userToken);
            setUser(userProfile as User);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
            // Clear invalid token
            localStorage.removeItem('ramein_token');
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authAPI.login({ email, password });
            setUser(response.user as User);
            setToken(response.token);
            localStorage.setItem('ramein_token', response.token);
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: any) => {
        try {
            const response = await authAPI.register(userData);
            setUser(response.user as User);
            setToken(response.token);
            localStorage.setItem('ramein_token', response.token);
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        if (token) {
            // Try to call logout API, but don't wait for it
            authAPI.logout(token).catch(console.error);
        }
        setUser(null);
        setToken(null);
        localStorage.removeItem('ramein_token');
    };

    const verifyEmail = async (verificationToken: string) => {
        try {
            await authAPI.verifyEmail({ token: verificationToken });
            // Update user verification status
            if (user) {
                setUser({ ...user, isVerified: true });
            }
        } catch (error) {
            throw error;
        }
    };

    const requestPasswordReset = async (email: string) => {
        try {
            await authAPI.requestPasswordReset({ email });
        } catch (error) {
            throw error;
        }
    };

    const resetPassword = async (resetToken: string, newPassword: string) => {
        try {
            await authAPI.resetPassword({ token: resetToken, newPassword });
        } catch (error) {
            throw error;
        }
    };

    const value: AuthContextType = {
        user,
        token,
        isLoading,
        isLoggedIn: !!user,
        login,
        register,
        logout,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
