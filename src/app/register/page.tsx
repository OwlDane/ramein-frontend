'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, User, GraduationCap, Github, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		confirmPassword: '',
		name: '',
		phone: '',
		address: '',
		education: ''
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [emailPreferences, setEmailPreferences] = useState(true);

	const { register } = useAuth();
	const router = useRouter();

	const handleInputChange = (field: string, value: string) => {
		setFormData(prev => ({ ...prev, [field]: value }));
	};

	const validateForm = () => {
		if (formData.password !== formData.confirmPassword) {
			setError('Passwords do not match');
			return false;
		}

		// Match backend password validation exactly - support more special characters
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&'#*+=\-])[A-Za-z\d@$!%?&'#*+=\-]{8,}$/;
		if (!passwordRegex.test(formData.password)) {
			setError('Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, dan karakter spesial');
			return false;
		}

		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		if (!validateForm()) return;

		setIsLoading(true);

		try {
			// Remove confirmPassword from the data sent to the API
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { confirmPassword, ...registerData } = formData;
			await register(registerData);
			// Registration successful, redirect to verify-email with email parameter
			setError(''); // Clear any previous errors
			router.push(`/verify-email?email=${encodeURIComponent(formData.email)}&fromRegister=true`);
		} catch (err: unknown) {
			const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
			setError(errorMessage);
		} finally {
			setIsLoading(false);
		}
	};

	const handleGoogleRegister = () => {
		// TODO: Implement Google OAuth
		console.log('Google register clicked');
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
						<h1 className="text-4xl font-bold mb-4">Create your free account</h1>
						<p className="text-lg text-slate-300 leading-relaxed">
							Join Ramein to discover amazing events, earn certificates, and connect with others.
						</p>
					</div>

					<div className="space-y-6">
						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
								<Github className="w-6 h-6 text-purple-400" />
							</div>
							<div>
								<h3 className="font-semibold">Event Discovery</h3>
								<p className="text-sm text-slate-400">Find and join events that interest you</p>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
								<GraduationCap className="w-6 h-6 text-blue-400" />
							</div>
							<div>
								<h3 className="font-semibold">Skill Development</h3>
								<p className="text-sm text-slate-400">Learn and grow through events</p>
							</div>
						</div>

						<div className="flex items-center space-x-3">
							<div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center">
								<User className="w-6 h-6 text-green-400" />
							</div>
							<div>
								<h3 className="font-semibold">Community</h3>
								<p className="text-sm text-slate-400">Connect with like-minded people</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Right Side - Registration Form */}
			<div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
				<div className="w-full max-w-md">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="flex justify-center mb-4">
							<div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
								<Github className="w-6 h-6 text-primary-foreground" />
							</div>
						</div>
						<h1 className="text-2xl font-bold text-foreground mb-2">Sign up for Ramein</h1>
						<p className="text-muted-foreground">
							Join thousands of users discovering amazing events
						</p>
					</div>

					{/* Google Sign Up Button */}
					<Button
						onClick={handleGoogleRegister}
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

					{/* Registration Form */}
					<form onSubmit={handleSubmit} className="space-y-4">
						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
								Email*
							</label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={(e) => handleInputChange('email', e.target.value)}
								placeholder="Email"
								required
								className="h-11"
							/>
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
								Password*
							</label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? 'text' : 'password'}
									value={formData.password}
									onChange={(e) => handleInputChange('password', e.target.value)}
									placeholder="Password"
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
							<p className="text-xs text-muted-foreground mt-1">
								Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, dan karakter spesial (@$!%?&apos;#*+=-).
							</p>
						</div>

						{/* Confirm Password */}
						<div>
							<label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
								Confirm Password*
							</label>
							<div className="relative">
								<Input
									id="confirmPassword"
									type={showConfirmPassword ? 'text' : 'password'}
									value={formData.confirmPassword}
									onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
									placeholder="Confirm Password"
									required
									className="h-11 pr-10"
								/>
								<button
									type="button"
									onClick={() => setShowConfirmPassword(!showConfirmPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
								>
									{showConfirmPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</button>
							</div>
						</div>

						{/* Name */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
								Full Name*
							</label>
							<Input
								id="name"
								type="text"
								value={formData.name}
								onChange={(e) => handleInputChange('name', e.target.value)}
								placeholder="Full Name"
								required
								className="h-11"
							/>
						</div>

						{/* Phone */}
						<div>
							<label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
								Phone Number*
							</label>
							<Input
								id="phone"
								type="tel"
								value={formData.phone}
								onChange={(e) => handleInputChange('phone', e.target.value)}
								placeholder="Phone Number"
								required
								className="h-11"
							/>
						</div>

						{/* Address */}
						<div>
							<label htmlFor="address" className="block text-sm font-medium text-foreground mb-2">
								Address*
							</label>
							<Input
								id="address"
								type="text"
								value={formData.address}
								onChange={(e) => handleInputChange('address', e.target.value)}
								placeholder="Address"
								required
								className="h-11"
							/>
						</div>

						{/* Education */}
						<div>
							<label htmlFor="education" className="block text-sm font-medium text-foreground mb-2">
								Education Level*
							</label>
							<select
								id="education"
								value={formData.education}
								onChange={(e) => handleInputChange('education', e.target.value)}
								required
								className="w-full h-11 px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
							>
								<option value="">Select Education Level</option>
								<option value="SD">SD (Elementary)</option>
								<option value="SMP">SMP (Junior High)</option>
								<option value="SMA">SMA (Senior High)</option>
								<option value="D3">D3 (Diploma)</option>
								<option value="S1">S1 (Bachelor)</option>
								<option value="S2">S2 (Master)</option>
								<option value="S3">S3 (Doctorate)</option>
								<option value="Other">Other</option>
							</select>
						</div>

						{/* Email Preferences */}
						<div className="flex items-start space-x-3">
							<input
								type="checkbox"
								id="emailPreferences"
								checked={emailPreferences}
								onChange={(e) => setEmailPreferences(e.target.checked)}
								className="mt-1 h-4 w-4 text-primary focus:ring-primary border-border rounded"
							/>
							<label htmlFor="emailPreferences" className="text-sm text-muted-foreground">
								Receive occasional product updates and announcements
							</label>
						</div>

						{/* Error Message */}
						{error && (
							<div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md p-3">
								{error}
							</div>
						)}

						{/* Create Account Button */}
						<Button
							type="submit"
							className="w-full h-11"
							disabled={isLoading}
						>
							{isLoading ? 'Creating account...' : 'Create account'}
						</Button>
					</form>

					{/* Legal Disclaimer */}
					<div className="mt-6 text-center">
						<p className="text-xs text-muted-foreground leading-relaxed">
							By creating an account, you agree to the{' '}
							<Link href="/terms" className="text-primary hover:text-primary/80">
								Terms of Service
							</Link>
							. For more information about Ramein&apos;s privacy practices, see the{' '}
							<Link href="/privacy" className="text-primary hover:text-primary/80">
								Privacy Statement
							</Link>
							. We&apos;ll occasionally send you account-related emails.
						</p>
					</div>

					                    {/* Sign In Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{' '}
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