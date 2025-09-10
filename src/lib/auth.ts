import { apiFetch } from './api';
import type {
    LoginRequest,
    RegisterRequest,
    LoginResponse,
    RegisterResponse,
    VerificationRequest,
    ResetPasswordRequest,
    ResetPasswordConfirmRequest,
    User
} from '../types/user';

export const authAPI = {
    // Login user
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        return apiFetch<LoginResponse>('/auth/login', {
            method: 'POST',
            body: data
        });
    },

    // Register user
    register: async (data: RegisterRequest): Promise<RegisterResponse> => {
        return apiFetch<RegisterResponse>('/auth/register', {
            method: 'POST',
            body: data
        });
    },

    // Request OTP for email verification during registration
    requestOTP: async (email: string): Promise<void> => {
        await apiFetch<{ message: string }>('/auth/request-verification', {
            method: 'POST',
            body: { email }
        });
    },

    // Request OTP for login 2FA
    requestLoginOTP: async (email: string): Promise<void> => {
        await apiFetch<{ message: string }>('/auth/request-login-otp', {
            method: 'POST',
            body: { email }
        });
    },

    // Verify OTP for both email verification and login completion
    verifyOTP: async (email: string, otp: string, purpose: 'email_verification' | 'login_completion'): Promise<{ message: string; token?: string; user?: Omit<User, 'password'> }> => {
        return apiFetch<{ message: string; token?: string; user?: Omit<User, 'password'> }>('/auth/verify-otp', {
            method: 'POST',
            body: { email, otp, purpose }
        });
    },

    // Verify email with token
    verifyEmail: async (data: VerificationRequest): Promise<{ message: string }> => {
        return apiFetch<{ message: string }>('/auth/verify-email', {
            method: 'POST',
            body: data
        });
    },

    // Request password reset
    requestPasswordReset: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
        return apiFetch<{ message: string }>('/auth/request-reset-password', {
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
    getProfile: async (token: string): Promise<Omit<User, 'password'>> => {
        return apiFetch<Omit<User, 'password'>>('/auth/profile', {
            method: 'GET',
            token
        });
    },

    // Update current user profile
    updateProfile: async (token: string, data: { name?: string; phone?: string; address?: string; education?: string }): Promise<Omit<User, 'password'>> => {
        return apiFetch<Omit<User, 'password'>>('/auth/profile', {
            method: 'PATCH',
            token,
            body: data
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
