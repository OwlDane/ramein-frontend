'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    User,
    Mail,
    Phone,
    MapPin,
    GraduationCap,
    Save,
    Loader2,
    Camera,
    CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '@/components/ui/ImageWithFallback';

interface ProfileSettingsProps {
    user: {
        id: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
        education?: string;
        avatar?: string | null;
    };
    userToken: string;
    onUpdate: (user: ProfileSettingsProps['user']) => void;
}

export function ProfileSettings({ user, userToken, onUpdate }: ProfileSettingsProps) {
    const [formData, setFormData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        education: user.education || ''
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        if (!userToken) return;

        try {
            setSaving(true);
            const { authAPI } = await import('@/lib/auth');
            const updated = await authAPI.updateProfile(userToken, formData);
            onUpdate(updated);
            toast.success('Profil berhasil diperbarui!');
        } catch {
            toast.error('Gagal memperbarui profil');
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (name?: string) => {
        if (!name) return 'U';
        const parts = name.trim().split(' ').filter(Boolean);
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    const getCompletionPercentage = () => {
        const fields = [formData.name, formData.phone, formData.address, formData.education];
        const filled = fields.filter(f => f && f.trim()).length;
        return Math.round((filled / fields.length) * 100);
    };

    const completionPercentage = getCompletionPercentage();

    return (
        <div className="space-y-6">
            {/* Profile Header */}
            <Card className="border-border/60 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="h-24 w-24 rounded-2xl ring-4 ring-primary/20 shadow-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                {user.avatar ? (
                                    <ImageWithFallback
                                        src={user.avatar}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-primary">
                                        {getInitials(user.name)}
                                    </span>
                                )}
                            </div>
                            <button className="absolute -bottom-2 -right-2 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-110 transition-transform">
                                <Camera className="w-4 h-4" />
                            </button>
                            <div className="absolute -top-2 -right-2">
                                <div className="bg-green-500 text-white p-1 rounded-full">
                                    <CheckCircle className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold mb-1">{user.name}</h2>
                            <p className="text-muted-foreground mb-4">{user.email}</p>
                            
                            {/* Profile Completion */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Kelengkapan Profil</span>
                                    <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
                                </div>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-primary to-primary/80"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completionPercentage}%` }}
                                        transition={{ duration: 1 }}
                                    />
                                </div>
                                {completionPercentage < 100 && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Lengkapi profil Anda untuk pengalaman yang lebih baik
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Form */}
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5 text-primary" />
                        Informasi Pribadi
                    </CardTitle>
                    <CardDescription>
                        Perbarui informasi profil Anda. Pastikan data yang diisi akurat.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="w-4 h-4 text-muted-foreground" />
                                Nama Lengkap
                            </Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Masukkan nama lengkap"
                                className="h-11"
                            />
                        </div>

                        {/* Email (Read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={user.email}
                                disabled
                                className="h-11 bg-muted"
                            />
                            <p className="text-xs text-muted-foreground">Email tidak dapat diubah</p>
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                Nomor Telepon
                            </Label>
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="08xxxxxxxxxx"
                                className="h-11"
                            />
                        </div>

                        {/* Education */}
                        <div className="space-y-2">
                            <Label htmlFor="education" className="flex items-center gap-2">
                                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                                Pendidikan Terakhir
                            </Label>
                            <Input
                                id="education"
                                value={formData.education}
                                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                                placeholder="Contoh: S1 Teknik Informatika"
                                className="h-11"
                            />
                        </div>

                        {/* Address */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address" className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                Alamat
                            </Label>
                            <Input
                                id="address"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Alamat lengkap domisili"
                                className="h-11"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex justify-end pt-4 border-t">
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            className="min-w-[150px]"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Simpan Perubahan
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
