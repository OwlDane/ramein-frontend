import { apiFetch } from './api';
import type {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    VerificationRequest,
    ResetPasswordRequest,
    ResetPasswordConfirmRequest
} from '../types/user';

export const authAPI = {
    // Login user
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        return apiFetch<AuthResponse>('/auth/login', {
            method: 'POST',
            body: data
        });
    },

    // Register user
    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        return apiFetch<AuthResponse>('/auth/register', {
            method: 'POST',
            body: data
        });
    },

    // Verify email
    verifyEmail: async (data: VerificationRequest): Promise<{ message: string }> => {
        return apiFetch<{ message: string }>('/auth/verify-email', {
            method: 'POST',
            body: data
        });
    },

    // Request password reset
    requestPasswordReset: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
        return apiFetch<{ message: string }>('/auth/forgot-password', {
            method: 'POST',
            body: data
        });
    },

    // Reset password with token
    resetPassword: async (data: ResetPasswordConfirmRequest): Promise<{ message: string }> => {
        return apiFetch<{ message: string }>('/auth/reset-password', {
            method: 'POST',
            body: data
        });
    },

    // Get current user profile
    getProfile: async (token: string): Promise<Omit<AuthResponse['user'], 'password'>> => {
        return apiFetch<Omit<AuthResponse['user'], 'password'>>('/auth/profile', {
            method: 'GET',
            token
        });
    },

    // Logout user
    logout: async (token: string): Promise<{ message: string }> => {
        return apiFetch<{ message: string }>('/auth/logout', {
            method: 'POST',
            token
        });
    }
};
