'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Eye, EyeOff, Github, ArrowLeft, Shield } from 'lucide-react';

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

    const resendVerificationLink = async () => {
        if (!email) {
            setError('Masukkan email terlebih dahulu untuk mengirim ulang link verifikasi.');
            return;
        }
        setError('');
        setSuccess('');
        try {
            await requestOTP(email);
            setSuccess('Link verifikasi telah dikirim ke email Anda.');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Gagal mengirim link verifikasi.';
            setError(msg);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await login(email, password);
            router.push('/');
            return;
        } catch (err: unknown) {
            // Handle verification errors specifically
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

    const handleGoogleLogin = () => {
        // TODO: Implement Google OAuth
        console.log('Google login clicked');
    };

    const handleBackToPassword = () => {
        setIsOtpStep(false);
        setOtp('');
        setError('');
        setSuccess('');
    };

    return (
        <div className="min-h-screen bg-background flex">
            {/* Back to Home Button */}
            <div className="absolute top-6 left-6 z-50">
                <Link href="/">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Left Side - Dark Theme with Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
                <div
                    className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-20`}
                />

                <div className="relative z-10 flex flex-col justify-center px-12 text-white">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-4">Welcome back to Ramein</h1>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            {isOtpStep 
                                ? 'Two-factor authentication untuk keamanan tambahan'
                                : 'Sign in to access your events, certificates, and manage your account.'
                            }
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                                <Github className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Event Management</h3>
                                <p className="text-sm text-slate-400">Organize and track your events</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Certificate System</h3>
                                <p className="text-sm text-slate-400">Download and verify certificates</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Two-Factor Auth</h3>
                                <p className="text-sm text-slate-400">Enhanced security with OTP</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                {isOtpStep ? (
                                    <Shield className="w-6 h-6 text-primary-foreground" />
                                ) : (
                                    <Github className="w-6 h-6 text-primary-foreground" />
                                )}
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">
                            {isOtpStep ? 'Two-Factor Authentication' : 'Sign in to Ramein'}
                        </h1>
                        <p className="text-muted-foreground">
                            {isOtpStep 
                                ? 'Masukkan kode OTP yang dikirim ke email Anda'
                                : 'Welcome back! Please enter your details.'
                            }
                        </p>
                    </div>

                    {/* Google Sign In Button - Only show in password step */}
                    {!isOtpStep && (
                        <>
                            <Button
                                onClick={handleGoogleLogin}
                                variant="outline"
                                className="w-full mb-6 h-11"
                                disabled={isLoading}
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                Continue with Google
                            </Button>

                            {/* Divider */}
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-border"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-background text-muted-foreground">or</span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isOtpStep ? (
                            // Step 1: Email and Password
                            <>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                        Email address
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                        className="h-11"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                            className="h-11 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            // Step 2: OTP
                            <>
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-2">
                                        Kode OTP
                                    </label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Masukkan kode OTP"
                                        required
                                        className="h-11 text-center text-lg tracking-widest"
                                        maxLength={6}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Masukkan 6 digit kode yang dikirim ke {email}
                                    </p>
                                </div>

                                {/* Back to Password Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBackToPassword}
                                    className="w-full h-11"
                                >
                                    Kembali ke Password
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
                            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                                {success}
                            </div>
                        )}

                        {/* Forgot Password Link - Only show in password step */}
                        {!isOtpStep && (
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                                <button
                                    type="button"
                                    onClick={resendVerificationLink}
                                    className="text-sm text-primary hover:text-primary/80 transition-colors"
                                >
                                    Kirim Ulang Link Verifikasi Email
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-11"
                            disabled={isLoading}
                        >
                            {isLoading 
                                ? (isOtpStep ? 'Memverifikasi...' : 'Signing in...') 
                                : (isOtpStep ? 'Verifikasi OTP' : 'Sign in')
                            }
                        </Button>
                    </form>

                    {/* Sign Up Link - Only show in password step */}
                    {!isOtpStep && (
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
