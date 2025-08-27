import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, GraduationCap, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (userData: User) => void;
}

export function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpExpiry, setOtpExpiry] = useState<Date | null>(null);

    // Login form state
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    // Register form state
    const [registerData, setRegisterData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        education: '',
        password: '',
        confirmPassword: ''
    });

    // OTP state
    const [otpData, setOtpData] = useState({
        otp: '',
        email: ''
    });

    // Reset password state
    const [resetEmail, setResetEmail] = useState('');

    const validatePassword = (password: string) => {
        const minLength = password.length >= 8;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful login
            if (loginData.email && loginData.password) {
                const userData = {
                    id: '1',
                    name: 'John Doe',
                    email: loginData.email,
                    avatar: null
                };

                onLogin(userData);
                toast.success('Login berhasil!');
                setLoginData({ email: '', password: '' });
            } else {
                toast.error('Email dan password harus diisi');
            }
        } catch {
            toast.error('Terjadi kesalahan saat login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validation
            if (!registerData.fullName || !registerData.email || !registerData.phone ||
                !registerData.address || !registerData.education || !registerData.password) {
                toast.error('Semua field harus diisi');
                setIsLoading(false);
                return;
            }

            if (!validatePassword(registerData.password)) {
                toast.error('Password harus minimal 8 karakter dengan huruf besar, kecil, angka, dan karakter spesial');
                setIsLoading(false);
                return;
            }

            if (registerData.password !== registerData.confirmPassword) {
                toast.error('Konfirmasi password tidak sesuai');
                setIsLoading(false);
                return;
            }

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Send OTP
            setOtpData({ ...otpData, email: registerData.email });
            setOtpExpiry(new Date(Date.now() + 5 * 60 * 1000)); // 5 minutes from now
            setOtpSent(true);
            toast.success('Kode OTP telah dikirim ke email Anda');

        } catch {
            toast.error('Terjadi kesalahan saat mendaftar');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!otpData.otp || otpData.otp.length !== 6) {
                toast.error('Masukkan kode OTP 6 digit');
                setIsLoading(false);
                return;
            }

            if (otpExpiry && new Date() > otpExpiry) {
                toast.error('Kode OTP telah kadaluarsa');
                setIsLoading(false);
                return;
            }

            // Simulate OTP verification
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful registration
            const userData = {
                id: '1',
                name: registerData.fullName,
                email: registerData.email,
                avatar: null
            };

            onLogin(userData);
            toast.success('Pendaftaran berhasil! Selamat datang!');

            // Reset forms
            setRegisterData({
                fullName: '', email: '', phone: '', address: '', education: '', password: '', confirmPassword: ''
            });
            setOtpData({ otp: '', email: '' });
            setOtpSent(false);

        } catch {
            toast.error('Kode OTP tidak valid');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            setOtpExpiry(new Date(Date.now() + 5 * 60 * 1000));
            toast.success('Kode OTP baru telah dikirim');
        } catch {
            toast.error('Gagal mengirim ulang kode OTP');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!resetEmail) {
                toast.error('Masukkan alamat email');
                setIsLoading(false);
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Link reset password telah dikirim ke email Anda');
            setResetEmail('');
        } catch {
            toast.error('Terjadi kesalahan saat mengirim link reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (otpSent) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Verifikasi Email
                        </DialogTitle>
                    </DialogHeader>

                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-purple-600" />
                        </div>
                        <p className="text-gray-600">
                            Kode OTP telah dikirim ke <strong>{otpData.email}</strong>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                            Kode akan kadaluarsa dalam 5 menit
                        </p>
                    </div>

                    <form onSubmit={handleOtpVerification} className="space-y-4">
                        <div>
                            <Label htmlFor="otp">Kode OTP (6 digit)</Label>
                            <Input
                                id="otp"
                                type="text"
                                placeholder="000000"
                                maxLength={6}
                                value={otpData.otp}
                                onChange={(e) => setOtpData({ ...otpData, otp: e.target.value.replace(/\D/g, '') })}
                                className="text-center text-2xl tracking-widest"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Memverifikasi...' : 'Verifikasi OTP'}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleResendOtp}
                            className="w-full"
                            disabled={isLoading}
                        >
                            Kirim Ulang Kode OTP
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        Selamat Datang
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="login" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Masuk</TabsTrigger>
                        <TabsTrigger value="register">Daftar</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login" className="space-y-6">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Label htmlFor="login-email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="login-password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Masuk...' : 'Masuk'}
                            </Button>
                        </form>

                        <Tabs defaultValue="forgot" className="mt-4">
                            <div className="text-center">
                                <TabsTrigger value="forgot" className="text-sm text-purple-600 hover:text-purple-800">
                                    Lupa Password?
                                </TabsTrigger>
                            </div>

                            <TabsContent value="forgot" className="mt-4">
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div>
                                        <Label htmlFor="reset-email">Email untuk reset password</Label>
                                        <Input
                                            id="reset-email"
                                            type="email"
                                            placeholder="nama@email.com"
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" variant="outline" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Mengirim...' : 'Kirim Link Reset'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </TabsContent>

                    <TabsContent value="register" className="space-y-6">
                        <Alert>
                            <Shield className="h-4 w-4" />
                            <AlertDescription>
                                Password harus minimal 8 karakter dengan huruf besar, kecil, angka, dan karakter spesial.
                            </AlertDescription>
                        </Alert>

                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Nama Lengkap</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="fullName"
                                        type="text"
                                        placeholder="Nama lengkap Anda"
                                        value={registerData.fullName}
                                        onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="register-email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="register-email"
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={registerData.email}
                                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="phone">No. Handphone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="08xxxxxxxxxx"
                                        value={registerData.phone}
                                        onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="address">Alamat Tempat Tinggal</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="address"
                                        type="text"
                                        placeholder="Alamat lengkap Anda"
                                        value={registerData.address}
                                        onChange={(e) => setRegisterData({ ...registerData, address: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="education">Pendidikan Terakhir</Label>
                                <div className="relative">
                                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="education"
                                        type="text"
                                        placeholder="S1 Teknik Informatika"
                                        value={registerData.education}
                                        onChange={(e) => setRegisterData({ ...registerData, education: e.target.value })}
                                        className="pl-10"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="register-password">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="register-password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                        className="pl-10 pr-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Mendaftar...' : 'Daftar Sekarang'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}