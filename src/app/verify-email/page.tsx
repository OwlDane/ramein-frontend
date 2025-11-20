'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

function VerifyEmailContent() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [isAutoRequesting, setIsAutoRequesting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const { requestOTP, verifyOTP } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Auto-verify with token from email link
    const handleAutoVerifyToken = useCallback(async (token: string) => {
        setIsVerifying(true);
        setError('');
        setSuccess('');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email/${token}`, {
                method: 'GET',
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Verifikasi gagal');
            }
            
            const data = await response.json();
            setSuccess('Email berhasil diverifikasi! Redirecting to login...');
            setTimeout(() => {
                router.push('/login?verified=true');
            }, 2000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Token verifikasi tidak valid atau sudah kadaluarsa';
            setError(errorMessage);
        } finally {
            setIsVerifying(false);
        }
    }, [router]);

    // Auto-request OTP when coming from registration
    const handleAutoRequestOTP = useCallback(async (emailAddress: string) => {
        setIsAutoRequesting(true);
        setError('');
        setSuccess('');
        try {
            await requestOTP(emailAddress);
            setOtpSent(true);
            setSuccess('OTP telah dikirim ke email Anda. Silakan cek inbox atau spam folder.');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Gagal mengirim OTP';
            setError(errorMessage);
        } finally {
            setIsAutoRequesting(false);
        }
    }, [requestOTP]);
    
    // Handle both token-based and OTP-based verification
    useEffect(() => {
        const token = searchParams.get('token');
        const emailParam = searchParams.get('email');
        const fromRegister = searchParams.get('fromRegister');

        // Priority 1: Token from email link
        if (token) {
            handleAutoVerifyToken(token);
            return;
        }

        // Priority 2: OTP flow from registration
        if (emailParam && fromRegister === 'true') {
            setEmail(emailParam);
            setTimeout(() => {
                handleAutoRequestOTP(emailParam);
            }, 1000);
        }
    }, [searchParams, handleAutoRequestOTP, handleAutoVerifyToken]);

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otp) {
            setError('OTP diperlukan');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            await verifyOTP(email, otp, 'email_verification');
            setSuccess('Email berhasil diverifikasi! Silakan login.');
            setTimeout(() => {
                router.push('/login');
            }, 2000);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Gagal memverifikasi OTP';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Verification Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white">
                {/* Header with Logo */}
                <div className="p-6 lg:p-8">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Ramein Logo"
                            width={32}
                            height={32}
                            className="mr-3"
                        />
                        <span className="text-xl font-bold text-green-600">RAMEIN</span>
                    </Link>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 lg:px-12 pb-8">
                    <div className="w-full max-w-md">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Verifikasi Email <span className="text-green-600">✉️</span>
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {searchParams.get('fromRegister') === 'true' 
                                    ? 'Akun Anda berhasil dibuat! Sekarang verifikasi email untuk mengaktifkannya.'
                                    : 'Klik link di email Anda untuk verifikasi'
                                }
                            </p>
                        </div>

                        {/* Auto-verifying with token */}
                        {isVerifying && (
                            <div className="text-center mb-6">
                                <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Memverifikasi Email...
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Mohon tunggu, kami sedang memverifikasi email Anda.
                                </p>
                            </div>
                        )}

                        {/* Auto-requesting OTP message */}
                        {isAutoRequesting && !isVerifying && (
                            <div className="text-center mb-6">
                                <Loader2 className="w-8 h-8 text-green-600 animate-spin mx-auto mb-2" />
                                <p className="text-sm text-gray-600">
                                    Mengirim OTP ke {email}...
                                </p>
                            </div>
                        )}

                        {/* Error Message (global) */}
                        {error && !otpSent && !isVerifying && (
                            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                                {error}
                            </div>
                        )}

                        {/* Success Message (global) */}
                        {success && !otpSent && !isVerifying && (
                            <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {success}
                            </div>
                        )}

                        {/* Verify OTP Form - Only show when OTP is sent */}
                        {otpSent && !isVerifying && (
                            <form onSubmit={handleVerifyOTP} className="space-y-4">
                                <div>
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
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
                                    <p className="text-xs text-gray-500 mt-1">
                                        Masukkan 6 digit kode yang dikirim ke email Anda
                                    </p>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                                        {error}
                                    </div>
                                )}

                                {/* Success Message */}
                                {success && (
                                    <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                                        {success}
                                    </div>
                                )}

                                {/* Verify OTP Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Memverifikasi...' : 'Verifikasi OTP'}
                                </Button>

                                {/* Resend OTP Button */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-11 border-gray-300 hover:bg-gray-50 font-medium rounded-md"
                                    onClick={() => {
                                        setOtpSent(false);
                                        setOtp('');
                                        setError('');
                                        setSuccess('');
                                        // Auto-request OTP again
                                        if (email) {
                                            handleAutoRequestOTP(email);
                                        }
                                    }}
                                >
                                    Kirim Ulang OTP
                                </Button>
                            </form>
                        )}

                        {/* Sign In Link */}
                        <div className="text-center mt-6">
                            <p className="text-sm text-gray-600">
                                Sudah terverifikasi?{' '}
                                <Link href="/login" className="text-green-600 hover:text-green-700 font-medium">
                                    Masuk
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-green-600 via-green-700 to-green-800">
                {/* Pattern Overlay */}
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
                
                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 text-white">
                    {/* Logo */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <Image
                                src="/logo.png"
                                alt="Ramein Logo"
                                width={24}
                                height={24}
                                className="mr-2"
                            />
                            <span className="text-sm font-semibold tracking-wider">RAMEIN</span>
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div className="mb-8 max-w-md">
                        <h1 className="text-3xl font-bold mb-4">
                            Verifikasi Email Anda
                        </h1>
                        <p className="text-base opacity-90 leading-relaxed">
                            Verifikasi email untuk mengaktifkan akun dan mulai mengikuti berbagai event menarik di Ramein.
                        </p>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-4 max-w-sm">
                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Mail className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Email Verification</h3>
                                <p className="text-xs opacity-75">Secure your account</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Account Activation</h3>
                                <p className="text-xs opacity-75">Access all features</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 text-left">
                            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <AlertCircle className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-sm">Security First</h3>
                                <p className="text-xs opacity-75">Protect your data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center px-6">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
