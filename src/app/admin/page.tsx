'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // Check if admin is logged in
        const adminToken = localStorage.getItem('ramein_admin_token');
        if (adminToken) {
            router.push('/admin/dashboard');
        } else {
            router.push('/admin/login');
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Redirecting...</p>
            </div>
        </div>
    );
}
