'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Calendar } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { login, requestOTP } = useAuth();
    const router = useRouter();

    // Removed unused resendVerificationLink function

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/');
            return;
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
            if (errorMessage.includes('verifikasi')) {
                setError('Akun Anda belum diverifikasi. Silakan cek email Anda untuk verifikasi sebelum login.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToPassword = () => {
        setIsOtpStep(false);
        setOtp('');
        setError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Side - Blue Gradient with Branding */}
            <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-[#4F46E5] via-[#5B52E8] to-[#6B63EC] relative overflow-hidden">
                {/* Decorative geometric shapes */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-64 h-64 border-2 border-white/10 rounded-3xl rotate-12"></div>
                    <div className="absolute bottom-32 right-20 w-48 h-48 border-2 border-white/10 rounded-3xl -rotate-12"></div>
                    <div className="absolute top-1/2 left-1/3 w-32 h-32 border-2 border-white/10 rounded-2xl rotate-45"></div>
                </div>

                <div className="relative z-10 flex flex-col justify-center items-start px-20 text-white max-w-2xl mx-auto">
                    {/* Logo/Icon */}
                    <div className="mb-12">
                        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8">
                            <Calendar className="w-12 h-12 text-[#4F46E5]" />
                        </div>
                        
                        <h1 className="text-5xl font-bold mb-6 leading-tight">
                            Hello<br />Ramein! 👋
                        </h1>
                        <p className="text-lg text-white/90 leading-relaxed max-w-lg">
                            Manage your events seamlessly. Get highly productive through automation and save tons of time!
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-12 left-20 text-white/60 text-sm">
                        © 2025 Ramein. All rights reserved.
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-[45%] flex items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            {isOtpStep ? 'Verify OTP' : 'Welcome Back!'}
                        </h2>
                        <p className="text-gray-600">
                            {isOtpStep 
                                ? 'Enter the OTP code sent to your email'
                                : (
                                    <>
                                        Don&apos;t have an account?{' '}
                                        <Link href="/register" className="text-[#4F46E5] hover:underline font-medium">
                                            Create a new account now
                                        </Link>
                                        , it&apos;s FREE! Takes less than a minute.
                                    </>
                                )
                            }
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!isOtpStep ? (
                            <>
                                {/* Email */}
                                <div>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your.email@gmail.com"
                                        required
                                        className="h-12 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                            className="h-12 border-gray-300 focus:border-[#4F46E5] focus:ring-[#4F46E5] pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* OTP Input */}
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                                        OTP Code*
                                    </label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="000000"
                                        required
                                        className="h-11 text-center text-2xl tracking-widest"
                                        maxLength={6}
                                    />
                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                        Enter the 6-digit code sent to {email}
                                    </p>
                                </div>

                                {/* Back Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBackToPassword}
                                    className="w-full h-11"
                                >
                                    Back to Password
                                </Button>
                            </>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="text-sm text-green-600 bg-green-500/10 border border-green-500/20 rounded-md p-3">
                                {success}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-lg"
                            disabled={isLoading}
                        >
                            {isLoading 
                                ? (isOtpStep ? 'Verifying...' : 'Logging in...') 
                                : (isOtpStep ? 'Verify OTP' : 'Login Now')
                            }
                        </Button>

                        {/* Google Login */}
                        {!isOtpStep && (
                            <Button
                                type="button"
                                onClick={() => console.log('Google login')}
                                variant="outline"
                                className="w-full h-12 border-gray-300 hover:bg-gray-50 font-medium rounded-lg"
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="#4285F4"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="#34A853"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="#FBBC05"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="#EA4335"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Login with Google
                            </Button>
                        )}

                        {/* Forgot Password */}
                        {!isOtpStep && (
                            <div className="text-center">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-gray-600 hover:text-gray-900 hover:underline"
                                >
                                    Forgot password? <span className="font-semibold">Click here</span>
                                </Link>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
