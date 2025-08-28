import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, AlertTriangle, LogOut } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SessionTimeoutProps {
    timeoutMinutes?: number;
    onTimeout: () => void;
    onExtend: () => void;
}

export function SessionTimeout({ 
    timeoutMinutes = 5, 
    onTimeout, 
    onExtend 
}: SessionTimeoutProps) {
    const [timeLeft, setTimeLeft] = useState(timeoutMinutes * 60); // in seconds
    const [showWarning, setShowWarning] = useState(false);
    const [isActive, setIsActive] = useState(true);

    const warningThreshold = 60; // Show warning 1 minute before timeout

    // Reset timer on user activity
    const resetTimer = useCallback(() => {
        setTimeLeft(timeoutMinutes * 60);
        setShowWarning(false);
        setIsActive(true);
    }, [timeoutMinutes]);

    // Handle user activity
    useEffect(() => {
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const handleActivity = () => {
            if (isActive) {
                resetTimer();
            }
        };

        events.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleActivity, true);
            });
        };
    }, [isActive, resetTimer]);

    // Countdown timer
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setIsActive(false);
                    onTimeout();
                    return 0;
                }
                
                // Show warning when time is running low
                if (prev <= warningThreshold && !showWarning) {
                    setShowWarning(true);
                    toast.error('Session akan berakhir dalam 1 menit. Silakan lakukan aktivitas untuk memperpanjang session.');
                }
                
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, showWarning, onTimeout]);

    // Auto-logout when time runs out
    useEffect(() => {
        if (timeLeft === 0) {
            toast.error('Session telah berakhir. Anda akan logout secara otomatis.');
            setTimeout(() => {
                onTimeout();
            }, 2000);
        }
    }, [timeLeft, onTimeout]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progressPercentage = ((timeoutMinutes * 60 - timeLeft) / (timeoutMinutes * 60)) * 100;

    if (!showWarning && timeLeft > warningThreshold) {
        return null; // Don't show anything until warning time
    }

    return (
        <AnimatePresence>
            {showWarning && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <Card className="border-border shadow-2xl">
                            <CardHeader className="text-center border-b border-border">
                                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AlertTriangle className="w-8 h-8 text-amber-600" />
                                </div>
                                <CardTitle className="text-xl font-bold text-amber-800">
                                    Session Timeout Warning
                                </CardTitle>
                            </CardHeader>

                            <CardContent className="p-6">
                                <div className="text-center space-y-4">
                                    <p className="text-muted-foreground">
                                        Session Anda akan berakhir dalam:
                                    </p>
                                    
                                    <div className="text-4xl font-mono font-bold text-amber-600">
                                        {formatTime(timeLeft)}
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm text-muted-foreground">
                                            <span>Progress</span>
                                            <span>{Math.round(progressPercentage)}%</span>
                                        </div>
                                        <Progress value={progressPercentage} className="h-2" />
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={onExtend}
                                            className="flex-1 bg-primary hover:bg-primary/90"
                                        >
                                            <Clock className="w-4 h-4 mr-2" />
                                            Perpanjang Session
                                        </Button>
                                        
                                        <Button
                                            onClick={onTimeout}
                                            variant="outline"
                                            className="flex-1"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout Sekarang
                                        </Button>
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        Lakukan aktivitas (klik, scroll, atau ketik) untuk memperpanjang session secara otomatis
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Hook untuk menggunakan session timeout
export function useSessionTimeout(timeoutMinutes: number = 5) {
    const [isSessionActive, setIsSessionActive] = useState(true);

    const handleTimeout = useCallback(() => {
        setIsSessionActive(false);
        // Clear user token
        localStorage.removeItem('userToken');
        // Redirect to login
        window.location.href = '/login';
    }, []);

    const handleExtend = useCallback(() => {
        setIsSessionActive(true);
        // Reset timer logic is handled in the component
    }, []);

    return {
        isSessionActive,
        SessionTimeoutComponent: (
            <SessionTimeout
                timeoutMinutes={timeoutMinutes}
                onTimeout={handleTimeout}
                onExtend={handleExtend}
            />
        )
    };
}
