'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, LoginResponse, RegisterResponse, RegisterRequest } from '../types/user';
import { authAPI } from '../lib/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<RegisterResponse>;
    logout: () => void;
    requestOTP: (email: string) => Promise<void>;
    verifyOTP: (email: string, otp: string, purpose: 'email_verification' | 'login_completion') => Promise<{ message: string; token?: string; user?: Omit<User, 'password'> }>;
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
            // Backend returns a flat user object
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
            const response: LoginResponse = await authAPI.login({ email, password });
            // Direct login: expect token + user
            if (response.token && response.user) {
                const userData: User = {
                    id: response.user.id,
                    email: response.user.email,
                    name: response.user.name,
                    phone: '', // These fields are not returned by login, will be filled by profile fetch
                    address: '',
                    education: '',
                    isVerified: true, // If login succeeds, user is verified
                    isEmailVerified: true,
                    isOtpVerified: true,
                    role: response.user.role as 'USER' | 'ADMIN',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                setUser(userData);
                setToken(response.token);
                localStorage.setItem('ramein_token', response.token);
                
                // Fetch complete user profile
                await fetchUserProfile(response.token);
                return;
            }
            
            throw new Error('Invalid login response');
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData: RegisterRequest) => {
        try {
            const response: RegisterResponse = await authAPI.register(userData);
            // Registration successful, return the message for proper handling
            return response;
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

    const requestOTP = async (email: string) => {
        try {
            await authAPI.requestOTP(email);
        } catch (error) {
            throw error;
        }
    };

    const verifyOTP = async (email: string, otp: string, purpose: 'email_verification' | 'login_completion') => {
        try {
            const response = await authAPI.verifyOTP(email, otp, purpose);
            
            if (purpose === 'email_verification') {
                // Update user verification status for email verification
                if (user) {
                    setUser({ ...user, isVerified: true, isEmailVerified: true });
                }
            }
            
            return response;
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
        requestOTP,
        verifyOTP,
        requestPasswordReset,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
