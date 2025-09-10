import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
    Download, Smartphone, Wifi, WifiOff, 
    CheckCircle, XCircle, Info, Star
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Type definition for PWA install prompt event
interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAFeaturesProps {
    onInstall?: () => void;
}

export function PWAFeatures({ onInstall }: PWAFeaturesProps) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        // Listen for beforeinstallprompt event
        const handleBeforeInstallPrompt = (e: Event) => {
            const installPromptEvent = e as BeforeInstallPromptEvent;
            installPromptEvent.preventDefault();
            setDeferredPrompt(installPromptEvent);
            setShowInstallPrompt(true);
        };

        // Listen for appinstalled event
        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowInstallPrompt(false);
            toast.success('Aplikasi berhasil diinstall!');
        };

        // Listen for online/offline events
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        // Add event listeners
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
        window.addEventListener('appinstalled', handleAppInstalled);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Register service worker
        registerServiceWorker();

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
            window.removeEventListener('appinstalled', handleAppInstalled);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const registerServiceWorker = async () => {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered:', registration);
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    };

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            onInstall?.();
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismissInstall = () => {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
    };

    const getPWAStatus = () => {
        if (isInstalled) {
            return { status: 'installed', color: 'default', text: 'Terinstall', icon: CheckCircle };
        }
        if (deferredPrompt) {
            return { status: 'available', color: 'default', text: 'Tersedia', icon: Download };
        }
        return { status: 'unavailable', color: 'secondary', text: 'Tidak Tersedia', icon: XCircle };
    };

    const pwaStatus = getPWAStatus();

    return (
        <>
            {/* Install Prompt */}
            <AnimatePresence>
                {showInstallPrompt && (
                    <motion.div
                        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50"
                        initial={{ opacity: 0, y: 100, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.8 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <Card className="border-border shadow-2xl bg-gradient-to-r from-blue-50 to-indigo-50">
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Smartphone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg text-blue-900">
                                            Install Ramein App
                                        </CardTitle>
                                        <p className="text-sm text-blue-700">
                                            Akses lebih cepat dari home screen
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleInstall}
                                        size="sm"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Install
                                    </Button>
                                    <Button
                                        onClick={handleDismissInstall}
                                        size="sm"
                                        variant="outline"
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                    >
                                        Nanti
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PWA Status Indicator */}
            <div className="fixed top-4 right-4 z-40">
                <div className="flex items-center gap-2">
                    {/* Online Status */}
                    <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
                        {isOnline ? (
                            <>
                                <Wifi className="w-3 h-3 mr-1" />
                                Online
                            </>
                        ) : (
                            <>
                                <WifiOff className="w-3 h-3 mr-1" />
                                Offline
                            </>
                        )}
                    </Badge>

                    {/* PWA Status */}
                    <Badge variant={pwaStatus.color as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                        <pwaStatus.icon className="w-3 h-3 mr-1" />
                        PWA {pwaStatus.text}
                    </Badge>
                </div>
            </div>

            {/* PWA Info Card (can be shown in settings or help section) */}
            <Card className="border-border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-primary" />
                        Progressive Web App (PWA)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h4 className="font-medium text-foreground">Fitur PWA:</h4>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Install di home screen
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Akses offline
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Push notifications
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    Update otomatis
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-foreground">Status:</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Install Status:</span>
                                    <Badge variant={pwaStatus.color as "default" | "secondary" | "destructive" | "outline"} className="text-xs">
                                        {pwaStatus.text}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Connection:</span>
                                    <Badge variant={isOnline ? "default" : "destructive"} className="text-xs">
                                        {isOnline ? 'Online' : 'Offline'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Service Worker:</span>
                                    <Badge variant="default" className="text-xs">
                                        Active
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!isInstalled && deferredPrompt && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Info className="w-5 h-5 text-blue-600" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-900">
                                        Install Aplikasi
                                    </p>
                                    <p className="text-xs text-blue-700">
                                        Install Ramein sebagai aplikasi untuk pengalaman yang lebih baik
                                    </p>
                                </div>
                                <Button
                                    onClick={handleInstall}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Install
                                </Button>
                            </div>
                        </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                        <p>
                            <strong>Tips:</strong> Untuk pengalaman terbaik, install aplikasi ini di home screen 
                            perangkat Anda. Aplikasi akan tetap berfungsi meskipun offline.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

// Hook untuk menggunakan PWA features
export function usePWA() {
    const [isInstalled, setIsInstalled] = useState(false);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true);
        }

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return {
        isInstalled,
        isOnline,
        isPWA: true
    };
}
