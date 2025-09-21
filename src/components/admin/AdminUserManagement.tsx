'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Search,
    Users,
    UserCheck,
    Mail,
    Shield,
    AlertCircle,
    RefreshCw
} from 'lucide-react';

interface User {
    id: string;
    email: string;
    name: string;
    role: 'USER' | 'ADMIN';
    isVerified: boolean;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

export function AdminUserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const params = new URLSearchParams({
                page: currentPage.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(selectedRole && { role: selectedRole })
            });

            const response = await fetch(`http://localhost:3001/api/admin/users?${params}`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsers(data.users);
                setTotalPages(data.pagination.totalPages);
                setTotalUsers(data.pagination.total);
            } else {
                setError('Gagal memuat data pengguna');
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
            setError('Terjadi kesalahan saat memuat data');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchTerm, selectedRole]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleRoleChange = async (userId: string, newRole: 'USER' | 'ADMIN') => {
        try {
            const adminToken = localStorage.getItem('ramein_admin_token');
            
            const response = await fetch(`http://localhost:3001/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (response.ok) {
                // Update local state
                setUsers(users.map(user => 
                    user.id === userId 
                        ? { ...user, role: newRole }
                        : user
                ));
            } else {
                const data = await response.json();
                setError(data.message || 'Gagal mengupdate role pengguna');
            }
        } catch (error) {
            console.error('Failed to update user role:', error);
            setError('Terjadi kesalahan saat mengupdate role');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-800';
            case 'USER':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getVerificationStatus = (user: User) => {
        if (user.isVerified && user.isEmailVerified) {
            return { status: 'verified', text: 'Terverifikasi', color: 'text-green-600' };
        } else if (user.isEmailVerified) {
            return { status: 'email-verified', text: 'Email Terverifikasi', color: 'text-yellow-600' };
        } else {
            return { status: 'unverified', text: 'Belum Terverifikasi', color: 'text-red-600' };
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold">Pengelolaan Pengguna</h2>
                    <p className="text-muted-foreground">
                        Kelola data pengguna dan peran akses
                    </p>
                </div>
                <Button variant="outline" onClick={fetchUsers}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Total Pengguna
                                    </p>
                                    <p className="text-3xl font-bold">{totalUsers}</p>
                                </div>
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        Admin
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {users.filter(u => u.role === 'ADMIN').length}
                                    </p>
                                </div>
                                <Shield className="h-8 w-8 text-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">
                                        User
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {users.filter(u => u.role === 'USER').length}
                                    </p>
                                </div>
                                <UserCheck className="h-8 w-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Cari pengguna..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-48">
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full p-2 border rounded-md"
                            >
                                <option value="">Semua Role</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Users List */}
            {isLoading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-muted rounded-full"></div>
                                        <div>
                                            <div className="h-4 bg-muted rounded w-32 mb-2"></div>
                                            <div className="h-3 bg-muted rounded w-48"></div>
                                        </div>
                                    </div>
                                    <div className="h-8 bg-muted rounded w-20"></div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {users.map((user, index) => {
                        const verification = getVerificationStatus(user);
                        return (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <Users className="w-6 h-6 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold">{user.name}</h3>
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(user.role)}`}>
                                                            {user.role}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                                                        <Mail className="w-4 h-4" />
                                                        {user.email}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-sm">
                                                        <span className={verification.color}>
                                                            {verification.text}
                                                        </span>
                                                        <span className="text-muted-foreground">•</span>
                                                        <span className="text-muted-foreground">
                                                            Bergabung {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value as 'USER' | 'ADMIN')}
                                                    className="px-3 py-1 border rounded-md text-sm"
                                                >
                                                    <option value="USER">User</option>
                                                    <option value="ADMIN">Admin</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Halaman {currentPage} dari {totalPages}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            )}

            {users.length === 0 && !isLoading && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Tidak ada pengguna ditemukan</h3>
                        <p className="text-muted-foreground">
                            Coba ubah filter pencarian atau refresh halaman
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
