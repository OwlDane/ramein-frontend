'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import Image from 'next/image';

function LoginPageContent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpStep, setIsOtpStep] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isResendingVerification, setIsResendingVerification] = useState(false);
    const [showVerificationButton, setShowVerificationButton] = useState(false);

    // Slide data
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop&crop=center",
            title: "Ikuti Kegiatan Lebih Mudah",
            description: "Daftar dan ikuti berbagai event dalam sekali klik. Nikmati kemudahan berkegiatan bersama Ramein dan dapatkan sertifikat."
        },
        {
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&crop=center",
            title: "Notifikasi dan Jadwal Real-Time",
            description: "Dapatkan pemberitahuan langsung tentang jadwal, pengumuman, dan informasi penting seputar kegiatan Anda."
        },
        {
            image: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop&crop=center",
            title: "Dapatkan Sertifikat Digital",
            description: "Raih sertifikat resmi untuk setiap kegiatan yang Anda ikuti dan tingkatkan kredibilitas profesional Anda."
        }
    ];

    // Auto slide effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(timer);
    }, [slides.length]);

    const { login, googleLogin } = useAuth();
    const router = useRouter();

    const handleGoogleLogin = useGoogleLogin({
        scope: 'email profile openid',
        onSuccess: async (tokenResponse) => {
            console.log('Google login successful:', tokenResponse);
            setIsLoading(true);
            setError('');
            try {
                await googleLogin(tokenResponse.access_token);
                router.push('/');
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Google login failed';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google login error:', error);
            setError('Google login was cancelled or failed');
        },
    });

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
                setShowVerificationButton(true);
            } else {
                setError(errorMessage);
                setShowVerificationButton(false);
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
        setShowVerificationButton(false);
    };

    const handleResendVerification = async () => {
        setIsResendingVerification(true);
        setError('');
        setSuccess('');
        
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/request-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Gagal mengirim email verifikasi');
            }
            
            setSuccess('Link verifikasi telah dikirim ke email Anda. Silakan cek inbox atau spam folder.');
            setShowVerificationButton(false);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Gagal mengirim email verifikasi';
            setError(errorMessage);
        } finally {
            setIsResendingVerification(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Left Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-white">
                {/* Header with Logo */}
                <div className="p-6 lg:p-8">
                    <div className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Ramein Logo"
                            width={32}
                            height={32}
                            className="mr-3"
                        />
                        <span className="text-xl font-bold text-green-600">RAMEIN</span>
                    </div>
                </div>

                {/* Form Container */}
                <div className="flex-1 flex items-center justify-center px-6 lg:px-12 pb-8">
                    <div className="w-full max-w-md">
                        {/* Form Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {isOtpStep ? 'Verifikasi OTP' : (
                                    <>
                                        Selamat Datang Kembali di <br />
                                        <span className="text-green-600">RAMEIN</span> 👋
                                    </>
                                )}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {isOtpStep 
                                    ? 'Masukkan kode OTP yang dikirim ke email Anda'
                                    : 'Masuk untuk mengikuti berbagai event menarik'
                                }
                            </p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isOtpStep ? (
                                <>
                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="contoh@email.com"
                                            required
                                            className="h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                                        />
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <div className="flex items-center justify-between mb-1">
                                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                                Password
                                            </label>
                                            <Link
                                                href="/forgot-password"
                                                className="text-sm text-green-600 hover:text-green-700"
                                            >
                                                Lupa password?
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Minimal 8 karakter"
                                                required
                                                className="h-11 border-gray-300 focus:border-amber-500 focus:ring-amber-500 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
                                <>
                                    {/* OTP Input */}
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                            Kode OTP*
                                        </label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            placeholder="000000"
                                            required
                                            className="h-11 text-center text-2xl tracking-widest border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                                            maxLength={6}
                                        />
                                        <p className="text-xs text-gray-500 text-center mt-2">
                                            Masukkan kode 6 digit yang dikirim ke {email}
                                        </p>
                                    </div>

                                    {/* Back Button */}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleBackToPassword}
                                        className="w-full h-11"
                                    >
                                        Kembali ke Kata Sandi
                                    </Button>
                                </>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                                    {error}
                                    {showVerificationButton && (
                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            disabled={isResendingVerification}
                                            className="mt-2 text-green-600 hover:text-green-700 font-medium underline disabled:opacity-50"
                                        >
                                            {isResendingVerification ? 'Mengirim...' : 'Klik disini untuk Verifikasi'}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-3">
                                    {success}
                                </div>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-11 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md"
                                disabled={isLoading}
                            >
                                {isLoading 
                                    ? (isOtpStep ? 'Memverifikasi...' : 'Masuk...') 
                                    : (isOtpStep ? 'Verifikasi OTP' : 'Masuk')
                                }
                            </Button>

                            {/* Divider */}
                            {!isOtpStep && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">Atau lanjutkan dengan</span>
                                    </div>
                                </div>
                            )}

                            {/* Google Login */}
                            {!isOtpStep && process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID && (
                                <Button
                                    type="button"
                                    onClick={() => handleGoogleLogin()}
                                    variant="outline"
                                    className="w-full h-11 border-gray-300 hover:bg-gray-50 font-medium rounded-md"
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
                                    Masuk Dengan Google
                                </Button>
                            )}
                        </form>

                        {/* Register Link */}
                        {!isOtpStep && (
                            <div className="text-center mt-6">
                                <p className="text-sm text-gray-600">
                                    Tidak memiliki akun?{' '}
                                    <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                                        Daftar
                                    </Link>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Side - Hero Image Slider */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                {/* Background Image Slider */}
                <div className="absolute inset-0">
                    {slides.map((slide, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${
                                index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                        >
                            <Image
                                src={slide.image}
                                alt={slide.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    ))}
                </div>
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
                
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
                    
                    {/* Slide Content */}
                    <div className="mb-8 max-w-md">
                        <h1 className="text-3xl font-bold mb-4 transition-all duration-500">
                            {slides[currentSlide].title}
                        </h1>
                        <p className="text-base opacity-90 leading-relaxed transition-all duration-500">
                            {slides[currentSlide].description}
                        </p>
                    </div>
                    
                    {/* Pagination dots */}
                    <div className="flex space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
    
    if (!googleClientId) {
        return <LoginPageContent />;
    }
    
    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <LoginPageContent />
        </GoogleOAuthProvider>
    );
}
