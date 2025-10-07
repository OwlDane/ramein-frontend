'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileLayout } from '../../components/profile/ProfileLayout';
import { motion } from 'framer-motion';

export default function ProfilePage() {
	const { user, isLoading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!isLoading && !user) {
			router.push('/login');
		}
	}, [user, isLoading, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center"
				>
					<div className="relative">
						<div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto mb-4"></div>
						<div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-primary/10 blur-sm mx-auto"></div>
					</div>
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.2 }}
						className="text-muted-foreground font-medium"
					>
						Memuat profil...
					</motion.p>
				</motion.div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return <ProfileLayout user={user} />;
}
