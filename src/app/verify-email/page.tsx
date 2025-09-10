'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import Link from 'next/link';
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

    const { requestOTP, verifyOTP } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();

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
    }, [requestOTP]); // Add requestOTP as dependency if it comes from props/context
    
    // Then use it in useEffect
    useEffect(() => {
        const emailParam = searchParams.get('email');
        const fromRegister = searchParams.get('fromRegister');

        if (emailParam && fromRegister === 'true') {
            setEmail(emailParam);
            // Auto-request OTP after a short delay
            setTimeout(() => {
                handleAutoRequestOTP(emailParam);
            }, 1000);
        }
    }, [searchParams, handleAutoRequestOTP]);

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
                        <h1 className="text-4xl font-bold mb-4">Verifikasi Email</h1>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            Verifikasi email Anda untuk mengaktifkan akun dan mulai menggunakan Ramein.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Email Verification</h3>
                                <p className="text-sm text-slate-400">Secure your account</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Account Activation</h3>
                                <p className="text-sm text-slate-400">Access all features</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Security First</h3>
                                <p className="text-sm text-slate-400">Protect your data</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Verification Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                                <Mail className="w-6 h-6 text-primary-foreground" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-foreground mb-2">Verifikasi Email</h1>
                        <p className="text-muted-foreground">
                            {searchParams.get('fromRegister') === 'true' 
                                ? 'Akun Anda berhasil dibuat! Sekarang verifikasi email untuk mengaktifkannya.'
                                : 'Masukkan email Anda untuk menerima kode OTP verifikasi'
                            }
                        </p>
                    </div>

                    {/* Auto-requesting OTP message */}
                    {isAutoRequesting && (
                        <div className="text-center mb-6">
                            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                                Mengirim OTP ke {email}...
                            </p>
                        </div>
                    )}

                    {/* Verify OTP Form - Only show when OTP is sent */}
                    {otpSent && (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
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
                                    Masukkan 6 digit kode yang dikirim ke email Anda
                                </p>
                            </div>

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

                            {/* Verify OTP Button */}
                            <Button
                                type="submit"
                                className="w-full h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Memverifikasi...' : 'Verifikasi OTP'}
                            </Button>

                            {/* Resend OTP Button */}
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-11"
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
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Sudah verifikasi?{' '}
                            <Link
                                href="/login"
                                className="text-primary hover:text-primary/80 font-medium transition-colors"
                            >
                                Sign in →
                            </Link>
                        </p>
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
