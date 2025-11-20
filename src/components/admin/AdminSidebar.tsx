"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    BarChart3,
    Calendar,
    Users,
    Banknote,
    Award,
    FileText,
    LogOut,
    ChevronRight,
} from "lucide-react";

interface AdminSidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    onLogout: () => void;
    isMobileOpen: boolean;
    onMobileClose: () => void;
}

const menuItems = [
    {
        group: "OVERVIEW",
        items: [
            { id: "overview", label: "Dashboard", icon: BarChart3 },
            { id: "events", label: "Kegiatan", icon: Calendar },
            { id: "users", label: "Pengguna", icon: Users },
        ],
    },
    {
        group: "MANAGEMENT",
        items: [
            { id: "payments", label: "Pembayaran", icon: Banknote },
            { id: "certificates", label: "Sertifikat", icon: Award },
            { id: "articles", label: "Artikel", icon: FileText },
        ],
    },
];

export function AdminSidebar({
    activeTab,
    onTabChange,
    onLogout,
    isMobileOpen,
    onMobileClose,
}: AdminSidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={onMobileClose}
                />
            )}

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -256 }}
                animate={{ x: isMobileOpen ? 0 : -256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className={`
          fixed lg:sticky
          top-0 left-0
          w-64 h-screen
          bg-gradient-to-b from-emerald-50 to-white
          border-r border-emerald-100
          flex flex-col
          z-50 lg:z-auto
          lg:translate-x-0
        `}
            >
                {/* Logo Section */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="p-6 border-b border-emerald-100 bg-white"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg shadow-md">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Ramein</h1>
                            <p className="text-xs text-emerald-600 font-medium">Admin Panel</p>
                        </div>
                    </div>
                </motion.div>

                {/* Navigation Menu */}
                <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {menuItems.map((group, groupIndex) => (
                        <motion.div
                            key={group.group}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.15 + groupIndex * 0.1 }}
                            className="space-y-2"
                        >
                            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest px-2">
                                {group.group}
                            </p>
                            <div className="space-y-1">
                                {group.items.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = activeTab === item.id;

                                    return (
                                        <motion.div
                                            key={item.id}
                                            whileHover={{ x: 4 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant={isActive ? "default" : "ghost"}
                                                className={`
                          w-full justify-start gap-3 h-11 px-4
                          transition-all duration-200
                          ${isActive
                                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg"
                                                        : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                                                    }
                        `}
                                                onClick={() => {
                                                    onTabChange(item.id);
                                                    onMobileClose();
                                                }}
                                            >
                                                <Icon className="w-5 h-5 flex-shrink-0" />
                                                <span className="font-medium text-sm">{item.label}</span>
                                                {isActive && (
                                                    <ChevronRight className="w-4 h-4 ml-auto" />
                                                )}
                                            </Button>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ))}
                </nav>

                {/* Logout Button */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    className="p-4 border-t border-emerald-100 bg-white"
                >
                    <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            variant="outline"
                            className="w-full justify-start gap-3 h-11 border-emerald-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            onClick={onLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium text-sm">Logout</span>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.aside>
        </>
    );
}
