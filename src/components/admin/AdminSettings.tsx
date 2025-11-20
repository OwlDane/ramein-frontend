'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
    Settings, 
    Mail, 
    Bell, 
    Shield, 
    Palette,
    Save,
    RefreshCw,
    CheckCircle,
    AlertCircle,
    Globe,
    Lock,
    FileText,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

export function AdminSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    // General Settings
    const [siteName, setSiteName] = useState('Ramein');
    const [siteDescription, setSiteDescription] = useState('Sistem Informasi Manajemen Kegiatan Akademik');
    const [contactEmail, setContactEmail] = useState('admin@ramein.com');
    const [contactPhone, setContactPhone] = useState('+62 812-3456-7890');
    
    // Email Settings
    const [emailEnabled, setEmailEnabled] = useState(true);
    const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
    const [smtpPort, setSmtpPort] = useState('587');
    const [smtpUser, setSmtpUser] = useState('');
    
    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [newEventNotif, setNewEventNotif] = useState(true);
    const [newUserNotif, setNewUserNotif] = useState(true);
    const [paymentNotif, setPaymentNotif] = useState(true);
    
    // Security Settings
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState('60');
    const [maxLoginAttempts, setMaxLoginAttempts] = useState('5');
    const [passwordMinLength, setPasswordMinLength] = useState('8');
    
    // Registration Settings
    const [allowRegistration, setAllowRegistration] = useState(true);
    const [requireEmailVerification, setRequireEmailVerification] = useState(true);
    const [autoApproveUsers, setAutoApproveUsers] = useState(false);
    
    // Event Settings
    const [maxParticipantsDefault, setMaxParticipantsDefault] = useState('100');
    const [autoGenerateCertificates, setAutoGenerateCertificates] = useState(true);
    const [requirePaymentConfirmation, setRequirePaymentConfirmation] = useState(true);
    
    // Appearance Settings
    const [primaryColor, setPrimaryColor] = useState('#10b981');
    const [darkMode, setDarkMode] = useState(false);
    const [compactMode, setCompactMode] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveSuccess(false);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsSaving(false);
        setSaveSuccess(true);
        
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    return (
        <div className="space-y-6">
            {saveSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                >
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Pengaturan berhasil disimpan!
                        </AlertDescription>
                    </Alert>
                </motion.div>
            )}

            <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2">
                    <TabsTrigger value="general" className="flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Umum</span>
                    </TabsTrigger>
                    <TabsTrigger value="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="hidden sm:inline">Email</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="w-4 h-4" />
                        <span className="hidden sm:inline">Notifikasi</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span className="hidden sm:inline">Keamanan</span>
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="hidden sm:inline">Kegiatan</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <span className="hidden sm:inline">Tampilan</span>
                    </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Globe className="w-5 h-5" />
                                Pengaturan Umum
                            </CardTitle>
                            <CardDescription>
                                Konfigurasi dasar sistem Ramein
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="siteName">Nama Aplikasi</Label>
                                <Input
                                    id="siteName"
                                    value={siteName}
                                    onChange={(e) => setSiteName(e.target.value)}
                                    placeholder="Ramein"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="siteDescription">Deskripsi</Label>
                                <Input
                                    id="siteDescription"
                                    value={siteDescription}
                                    onChange={(e) => setSiteDescription(e.target.value)}
                                    placeholder="Deskripsi aplikasi"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="contactEmail">Email Kontak</Label>
                                    <Input
                                        id="contactEmail"
                                        type="email"
                                        value={contactEmail}
                                        onChange={(e) => setContactEmail(e.target.value)}
                                        placeholder="admin@ramein.com"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="contactPhone">Telepon Kontak</Label>
                                    <Input
                                        id="contactPhone"
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        placeholder="+62 812-3456-7890"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Registrasi Pengguna</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Izinkan pengguna baru mendaftar
                                    </p>
                                </div>
                                <Switch
                                    checked={allowRegistration}
                                    onCheckedChange={setAllowRegistration}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Verifikasi Email</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Wajibkan verifikasi email saat registrasi
                                    </p>
                                </div>
                                <Switch
                                    checked={requireEmailVerification}
                                    onCheckedChange={setRequireEmailVerification}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Email Settings */}
                <TabsContent value="email" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5" />
                                Konfigurasi Email
                            </CardTitle>
                            <CardDescription>
                                Pengaturan SMTP untuk pengiriman email
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Aktifkan Email</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Gunakan layanan email untuk notifikasi
                                    </p>
                                </div>
                                <Switch
                                    checked={emailEnabled}
                                    onCheckedChange={setEmailEnabled}
                                />
                            </div>

                            {emailEnabled && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="smtpHost">SMTP Host</Label>
                                            <Input
                                                id="smtpHost"
                                                value={smtpHost}
                                                onChange={(e) => setSmtpHost(e.target.value)}
                                                placeholder="smtp.gmail.com"
                                            />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label htmlFor="smtpPort">SMTP Port</Label>
                                            <Input
                                                id="smtpPort"
                                                value={smtpPort}
                                                onChange={(e) => setSmtpPort(e.target.value)}
                                                placeholder="587"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="smtpUser">SMTP Username</Label>
                                        <Input
                                            id="smtpUser"
                                            value={smtpUser}
                                            onChange={(e) => setSmtpUser(e.target.value)}
                                            placeholder="your-email@gmail.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="smtpPassword">SMTP Password</Label>
                                        <Input
                                            id="smtpPassword"
                                            type="password"
                                            placeholder="••••••••"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Gunakan App Password untuk Gmail
                                        </p>
                                    </div>

                                    <Button variant="outline" className="w-full">
                                        <Zap className="w-4 h-4 mr-2" />
                                        Test Koneksi Email
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="w-5 h-5" />
                                Pengaturan Notifikasi
                            </CardTitle>
                            <CardDescription>
                                Kelola notifikasi email untuk admin
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Notifikasi Email</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Terima notifikasi via email
                                    </p>
                                </div>
                                <Switch
                                    checked={emailNotifications}
                                    onCheckedChange={setEmailNotifications}
                                />
                            </div>

                            {emailNotifications && (
                                <div className="space-y-3 pl-4 border-l-2 border-muted">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm">Kegiatan Baru</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Notifikasi saat ada kegiatan baru dibuat
                                            </p>
                                        </div>
                                        <Switch
                                            checked={newEventNotif}
                                            onCheckedChange={setNewEventNotif}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm">Pengguna Baru</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Notifikasi saat ada pengguna baru mendaftar
                                            </p>
                                        </div>
                                        <Switch
                                            checked={newUserNotif}
                                            onCheckedChange={setNewUserNotif}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="space-y-0.5">
                                            <Label className="text-sm">Pembayaran</Label>
                                            <p className="text-xs text-muted-foreground">
                                                Notifikasi saat ada pembayaran baru
                                            </p>
                                        </div>
                                        <Switch
                                            checked={paymentNotif}
                                            onCheckedChange={setPaymentNotif}
                                        />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security Settings */}
                <TabsContent value="security" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Pengaturan Keamanan
                            </CardTitle>
                            <CardDescription>
                                Konfigurasi keamanan dan autentikasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Aktifkan 2FA untuk admin
                                    </p>
                                </div>
                                <Switch
                                    checked={twoFactorAuth}
                                    onCheckedChange={setTwoFactorAuth}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="sessionTimeout">Session Timeout (menit)</Label>
                                    <Input
                                        id="sessionTimeout"
                                        type="number"
                                        value={sessionTimeout}
                                        onChange={(e) => setSessionTimeout(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                                    <Input
                                        id="maxLoginAttempts"
                                        type="number"
                                        value={maxLoginAttempts}
                                        onChange={(e) => setMaxLoginAttempts(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="passwordMinLength">Min Password Length</Label>
                                    <Input
                                        id="passwordMinLength"
                                        type="number"
                                        value={passwordMinLength}
                                        onChange={(e) => setPasswordMinLength(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Alert>
                                <Lock className="h-4 w-4" />
                                <AlertDescription>
                                    Perubahan pengaturan keamanan akan diterapkan pada sesi login berikutnya.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Event Settings */}
                <TabsContent value="events" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                Pengaturan Kegiatan
                            </CardTitle>
                            <CardDescription>
                                Konfigurasi default untuk kegiatan
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="maxParticipants">Maksimal Peserta Default</Label>
                                <Input
                                    id="maxParticipants"
                                    type="number"
                                    value={maxParticipantsDefault}
                                    onChange={(e) => setMaxParticipantsDefault(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Jumlah maksimal peserta default saat membuat kegiatan baru
                                </p>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Auto-Generate Sertifikat</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Otomatis buat sertifikat setelah kegiatan selesai
                                    </p>
                                </div>
                                <Switch
                                    checked={autoGenerateCertificates}
                                    onCheckedChange={setAutoGenerateCertificates}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Konfirmasi Pembayaran</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Wajibkan konfirmasi manual untuk pembayaran
                                    </p>
                                </div>
                                <Switch
                                    checked={requirePaymentConfirmation}
                                    onCheckedChange={setRequirePaymentConfirmation}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Auto-Approve Pengguna</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Otomatis setujui pengguna baru tanpa review
                                    </p>
                                </div>
                                <Switch
                                    checked={autoApproveUsers}
                                    onCheckedChange={setAutoApproveUsers}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Appearance Settings */}
                <TabsContent value="appearance" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                Pengaturan Tampilan
                            </CardTitle>
                            <CardDescription>
                                Kustomisasi tampilan admin panel
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="primaryColor">Warna Utama</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="primaryColor"
                                        type="color"
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="w-20 h-10"
                                    />
                                    <Input
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        placeholder="#10b981"
                                        className="flex-1"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Gunakan tema gelap
                                    </p>
                                </div>
                                <Switch
                                    checked={darkMode}
                                    onCheckedChange={setDarkMode}
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Compact Mode</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Tampilan lebih ringkas dengan spacing lebih kecil
                                    </p>
                                </div>
                                <Switch
                                    checked={compactMode}
                                    onCheckedChange={setCompactMode}
                                />
                            </div>

                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    Perubahan tampilan akan diterapkan setelah refresh halaman.
                                </AlertDescription>
                            </Alert>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" disabled={isSaving}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Menyimpan...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Simpan Pengaturan
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}
