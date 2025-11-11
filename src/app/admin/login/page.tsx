'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle, DoorOpen, Lock, User } from 'lucide-react';

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
            const response = await fetch('http://localhost:3001/api/admin/auth/login', {
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
        <div className="min-h-screen bg-[#4A5FBD] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden"
            >
                <div className="grid md:grid-cols-2 min-h-[600px]">
                    {/* Left Side - Illustration */}
                    <div className="bg-gradient-to-br from-[#D5DCF5] to-[#E8EBF7] flex items-center justify-center p-12 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-10 left-10 w-20 h-20 bg-[#4A5FBD] rounded-full blur-xl"></div>
                            <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#4A5FBD] rounded-full blur-2xl"></div>
                        </div>
                        
                        {/* Illustration - Elegant Door */}
                        <div className="relative z-10">
                            <svg 
                                width="280" 
                                height="420" 
                                viewBox="0 0 280 420" 
                                fill="none" 
                                xmlns="http://www.w3.org/2000/svg"
                                className="drop-shadow-2xl"
                            >
                                {/* Wall Background */}
                                <rect x="0" y="0" width="280" height="420" fill="#E8EBF7"/>
                                
                                {/* Wall Texture/Pattern */}
                                <rect x="0" y="0" width="280" height="420" fill="url(#wallPattern)" opacity="0.3"/>
                                <defs>
                                    <pattern id="wallPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                        <circle cx="20" cy="20" r="1" fill="#C5CEF5" opacity="0.5"/>
                                    </pattern>
                                </defs>
                                
                                {/* Door Frame Shadow */}
                                <rect x="62" y="52" width="156" height="336" rx="8" fill="#000000" opacity="0.1"/>
                                
                                {/* Door Frame - Outer */}
                                <rect x="60" y="50" width="160" height="340" rx="8" fill="#8B9DD9"/>
                                
                                {/* Door Frame - Middle */}
                                <rect x="68" y="58" width="144" height="324" rx="6" fill="#A5B4E8"/>
                                
                                {/* Door Frame - Inner */}
                                <rect x="76" y="66" width="128" height="308" rx="4" fill="#C5D4F5"/>
                                
                                {/* Door Surface */}
                                <rect x="80" y="70" width="120" height="300" rx="3" fill="#5B6FB5"/>
                                <rect x="82" y="72" width="116" height="296" rx="3" fill="#6B7BC5"/>
                                
                                {/* Door Panel 1 (Top Left) */}
                                <rect x="92" y="85" width="46" height="75" rx="3" fill="#7A89D4" opacity="0.6"/>
                                <rect x="94" y="87" width="42" height="71" rx="2" fill="#8B9AE4" opacity="0.3"/>
                                
                                {/* Door Panel 2 (Top Right) */}
                                <rect x="142" y="85" width="46" height="75" rx="3" fill="#7A89D4" opacity="0.6"/>
                                <rect x="144" y="87" width="42" height="71" rx="2" fill="#8B9AE4" opacity="0.3"/>
                                
                                {/* Door Panel 3 (Bottom Left) */}
                                <rect x="92" y="175" width="46" height="75" rx="3" fill="#7A89D4" opacity="0.6"/>
                                <rect x="94" y="177" width="42" height="71" rx="2" fill="#8B9AE4" opacity="0.3"/>
                                
                                {/* Door Panel 4 (Bottom Right) */}
                                <rect x="142" y="175" width="46" height="75" rx="3" fill="#7A89D4" opacity="0.6"/>
                                <rect x="144" y="177" width="42" height="71" rx="2" fill="#8B9AE4" opacity="0.3"/>
                                
                                {/* Door Handle Base */}
                                <ellipse cx="172" cy="210" rx="12" ry="6" fill="#3D4A82" opacity="0.3"/>
                                
                                {/* Door Handle */}
                                <circle cx="170" cy="210" r="5" fill="#3D4A82"/>
                                <ellipse cx="177" cy="210" rx="10" ry="4" fill="#4A5A92"/>
                                <rect x="170" y="207" width="12" height="6" rx="2" fill="#5A6AA2"/>
                                
                                {/* Door Handle Shine */}
                                <ellipse cx="176" cy="208" rx="6" ry="2" fill="#7A8AB2" opacity="0.6"/>
                                
                                {/* Door Keyhole */}
                                <ellipse cx="170" cy="225" rx="3" ry="4" fill="#2C3A72"/>
                                <rect x="169" y="226" width="2" height="6" fill="#2C3A72"/>
                                
                                {/* Door Bottom Detail */}
                                <rect x="85" y="355" width="110" height="8" rx="1" fill="#5B6FB5" opacity="0.5"/>
                                
                                {/* Floor */}
                                <rect x="0" y="390" width="280" height="30" fill="#D5DCF5"/>
                                
                                {/* Floor Shadow */}
                                <ellipse cx="140" cy="392" rx="80" ry="6" fill="#000000" opacity="0.15"/>
                                
                                {/* Door Hinge Top */}
                                <rect x="84" y="90" width="8" height="20" rx="2" fill="#4A5A92"/>
                                <circle cx="88" cy="95" r="2" fill="#3D4A82"/>
                                <circle cx="88" cy="105" r="2" fill="#3D4A82"/>
                                
                                {/* Door Hinge Bottom */}
                                <rect x="84" y="340" width="8" height="20" rx="2" fill="#4A5A92"/>
                                <circle cx="88" cy="345" r="2" fill="#3D4A82"/>
                                <circle cx="88" cy="355" r="2" fill="#3D4A82"/>
                            </svg>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="flex items-center justify-center p-12">
                        <div className="w-full max-w-md space-y-8">
                            {/* Header */}
                            <div className="text-center space-y-2">
                                <h1 className="text-3xl font-bold text-[#1E3A8A]">Login to Dashboard</h1>
                            </div>

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
                                    className="w-full h-12 bg-[#2C4A9F] hover:bg-[#1E3A8A] text-white font-semibold text-base rounded-full shadow-lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Loading...' : 'LOGIN'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
