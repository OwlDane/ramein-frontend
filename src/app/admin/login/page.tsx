'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle, Shield, Lock, CheckCircle } from 'lucide-react';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check if admin is already logged in
        const adminToken = localStorage.getItem('ramein_admin_token');
        if (adminToken) {
            router.push('/admin/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('ramein_admin_token', data.token);
                router.push('/admin/dashboard');
            } else {
                setError(data.message || 'Login gagal');
            }
        } catch {
            setError('Terjadi kesalahan saat login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="grid md:grid-cols-2 min-h-[600px]">
                    {/* Left Side - Login Form */}
                    <div className="bg-white flex flex-col items-center justify-center p-8 md:p-12">
                        <div className="w-full max-w-md space-y-8">
                            {/* Header */}
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="text-center space-y-2"
                            >
                                <div className="flex items-center justify-center gap-2 mb-4">
                                    <Shield className="w-8 h-8 text-emerald-600" />
                                    <h1 className="text-3xl font-bold text-emerald-600">Admin Login</h1>
                                </div>
                                <p className="text-sm text-gray-600">Secure access for administrators</p>
                            </motion.div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <Alert variant="destructive" className="bg-red-50 border-red-200">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="example@email.com"
                                        required
                                        className="h-12 border-2 border-gray-300 focus:border-[#4A5FBD] focus:ring-[#4A5FBD]"
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••••"
                                            required
                                            className="h-12 border-2 border-gray-300 focus:border-[#4A5FBD] focus:ring-[#4A5FBD] pr-10"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-gray-500" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-gray-500" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <Button
                                    type="submit"
                                    className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base rounded-full shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'LOGIN'}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Security Content */}
                    <div className="relative overflow-hidden flex flex-col items-center justify-center p-8 md:p-12">
                        {/* Background Image */}
                        <Image
                            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop"
                            alt="Security"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        
                        {/* Dark Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700/80 via-emerald-800/80 to-emerald-900/80" />

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative z-10 text-white space-y-8 max-w-md"
                        >
                            {/* Security Icon */}
                            <div className="flex justify-center">
                                <div className="bg-white/20 backdrop-blur-sm p-6 rounded-full border border-white/30">
                                    <Lock className="w-12 h-12 text-white" />
                                </div>
                            </div>

                            {/* Title */}
                            <div className="text-center space-y-2">
                                <h2 className="text-3xl font-bold">Secure Access</h2>
                                <p className="text-white/80 text-sm">Admin Portal Protection</p>
                            </div>

                            {/* Tips */}
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="flex gap-3 items-start"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-sm">Jaga Keamanan Password</p>
                                        <p className="text-white/70 text-xs">Gunakan password yang kuat dan jangan bagikan ke siapapun</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="flex gap-3 items-start"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-sm">Logout Setelah Selesai</p>
                                        <p className="text-white/70 text-xs">Selalu logout dari akun admin saat selesai bekerja</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                    className="flex gap-3 items-start"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-sm">Periksa Aktivitas</p>
                                        <p className="text-white/70 text-xs">Monitor semua aktivitas admin untuk keamanan maksimal</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    className="flex gap-3 items-start"
                                >
                                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0 mt-1" />
                                    <div>
                                        <p className="font-semibold text-sm">Update Berkala</p>
                                        <p className="text-white/70 text-xs">Pastikan sistem selalu diupdate untuk keamanan optimal</p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
