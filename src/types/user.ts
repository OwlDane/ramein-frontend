export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    address: string;
    education: string;
    isVerified: boolean;
    verificationToken?: string;
    tokenExpiry?: string;
    resetToken?: string;
    resetTokenExpiry?: string;
    role: UserRole;
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

export interface VerificationRequest {
    token: string;
}

export interface ResetPasswordRequest {
    email: string;
}

export interface ResetPasswordConfirmRequest {
    token: string;
    newPassword: string;
}
