export interface User {
    id: string;
    email: string;
    password?: string; // Optional in frontend
    name: string;
    phone: string;
    address: string;
    education: string;
    isVerified: boolean;
    isEmailVerified: boolean;
    isOtpVerified: boolean;
    verificationToken?: string | null;
    tokenExpiry?: Date | null;
    resetToken?: string | null;
    resetTokenExpiry?: Date | null;
    otp?: string | null;
    otpCreatedAt?: Date | null;
    role: 'USER' | 'ADMIN';
    createdAt: string;
    updatedAt: string;
}

export enum UserRole {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    education: string;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
    message?: string;
}

export interface LoginResponse {
    message: string;
    requiresOTP?: boolean;
    email?: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}

export interface RegisterResponse {
    message: string;
}

export interface VerificationRequest {
    token: string;
}

export interface OTPVerificationRequest {
    email: string;
    otp: string;
    purpose: 'email_verification' | 'login_completion';
}

export interface RequestOTPRequest {
    email: string;
}

export interface RequestLoginOTPRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface ResetPasswordConfirmRequest {
    token: string;
    newPassword: string;
}

export interface VerificationError {
    message: string;
    requiresVerification: boolean;
}
