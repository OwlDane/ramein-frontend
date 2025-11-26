'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Check, Trash2, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    event?: {
        id: string;
        title: string;
        date: string;
    };
}

interface NotificationsTabProps {
    userToken: string;
}

export function NotificationsTab({ userToken }: NotificationsTabProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE_URL}/notifications?limit=50`, {
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch notifications');

            const data = await response.json();
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Gagal memuat notifikasi');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userToken) {
            fetchNotifications();
        }
    }, [userToken]);

    const markAsRead = async (id: string) => {
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to mark as read');

            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
            toast.success('Ditandai sudah dibaca');
        } catch (error) {
            console.error('Error marking notification as read:', error);
            toast.error('Gagal menandai notifikasi');
        }
    };

    const markAllAsRead = async () => {
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to mark all as read');

            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
            toast.success('Semua notifikasi ditandai sudah dibaca');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Gagal menandai semua notifikasi');
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${userToken}`,
                },
            });

            if (!response.ok) throw new Error('Failed to delete notification');

            setNotifications(prev => prev.filter(n => n.id !== id));
            toast.success('Notifikasi dihapus');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Gagal menghapus notifikasi');
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Memuat notifikasi...</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Notifikasi</h3>
                    <p className="text-sm text-muted-foreground">
                        {unreadCount > 0 ? `${unreadCount} notifikasi belum dibaca` : 'Semua notifikasi sudah dibaca'}
                    </p>
                </div>
                {unreadCount > 0 && (
                    <Button onClick={markAllAsRead} variant="outline" size="sm">
                        <Check className="w-4 h-4 mr-2" />
                        Tandai Semua Dibaca
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            {notifications.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center">
                        <BellOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">Belum ada notifikasi</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-2">
                    {notifications.map((notif) => (
                        <Card 
                            key={notif.id}
                            className={`transition-all ${!notif.isRead ? 'border-l-4 border-l-primary bg-primary/5' : ''}`}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Bell className={`w-4 h-4 ${!notif.isRead ? 'text-primary' : 'text-muted-foreground'}`} />
                                            <h4 className="font-semibold">{notif.title}</h4>
                                            {!notif.isRead && (
                                                <Badge variant="default" className="ml-2">Baru</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-2">{notif.message}</p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(notif.createdAt).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                            {notif.event && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {notif.event.title}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {!notif.isRead && (
                                            <Button
                                                onClick={() => markAsRead(notif.id)}
                                                variant="ghost"
                                                size="sm"
                                                title="Tandai dibaca"
                                            >
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button
                                            onClick={() => deleteNotification(notif.id)}
                                            variant="ghost"
                                            size="sm"
                                            title="Hapus"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
