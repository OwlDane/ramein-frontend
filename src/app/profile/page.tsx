'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
    const { user, token, isLoading } = useAuth();
    const router = useRouter();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [education, setEducation] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login');
        }
    }, [isLoading, user, router]);

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
            setAddress(user.address || '');
            setEducation(user.education || '');
        }
    }, [user]);

    const onSave = async () => {
        if (!token) return;
        try {
            setSaving(true);
            await authAPI.updateProfile(token, { name, phone, address, education });
            toast.success('Profil berhasil diperbarui');
        } catch (e: any) {
            toast.error(e?.message || 'Gagal memperbarui profil');
        } finally {
            setSaving(false);
        }
    };

    // Convert page to a lightweight redirect helper: open dashboard modal instead
    useEffect(() => {
        // If user lands on /profile directly, send them to dashboard which now has the modal editor
        if (!isLoading) {
            window.location.replace('/dashboard');
        }
    }, [isLoading]);

    return null;
}


