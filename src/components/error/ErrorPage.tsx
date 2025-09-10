'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Home, RefreshCw, ArrowLeft, AlertTriangle, Search, Server, Wifi } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface ErrorPageProps {
    statusCode?: number
    title?: string
    message?: string
    showRetry?: boolean
    showHome?: boolean
    showBack?: boolean
    onRetry?: () => void
    onBack?: () => void
}

const errorConfigs = {
    404: {
        title: 'Halaman Tidak Ditemukan',
        message: 'Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut telah dipindahkan atau dihapus.',
        icon: Search,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    500: {
        title: 'Server Error',
        message: 'Terjadi kesalahan pada server kami. Tim kami telah diberitahu dan sedang memperbaikinya.',
        icon: Server,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
    },
    503: {
        title: 'Layanan Tidak Tersedia',
        message: 'Server sedang dalam pemeliharaan atau kelebihan beban. Silakan coba lagi nanti.',
        icon: Wifi,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
    },
    default: {
        title: 'Terjadi Kesalahan',
        message: 'Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi support jika masalah berlanjut.',
        icon: AlertTriangle,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
    }
}

export function ErrorPage({
    statusCode = 500,
    title,
    message,
    showRetry = true,
    showHome = true,
    showBack = true,
    onRetry,
    onBack
}: ErrorPageProps) {
    const router = useRouter()
    const config = errorConfigs[statusCode as keyof typeof errorConfigs] || errorConfigs.default
    const Icon = config.icon

    const handleRetry = () => {
        if (onRetry) {
            onRetry()
        } else {
            window.location.reload()
        }
    }

    const handleHome = () => {
        router.push('/')
    }

    const handleBack = () => {
        if (onBack) {
            onBack()
        } else {
            router.back()
        }
    }

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut" as const,
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" as const }
        }
    }

    const iconVariants = {
        hidden: { scale: 0, rotate: -180 },
        visible: {
            scale: 1,
            rotate: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut" as const,
                type: "spring" as const,
                stiffness: 200
            }
        }
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <Card className="border-border shadow-glow bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-8 lg:p-12 text-center">
                        {/* Error Icon */}
                        <motion.div
                            variants={iconVariants}
                            className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${config.bgColor} ${config.borderColor} border-2 mb-8`}
                        >
                            <Icon className={`w-12 h-12 ${config.color}`} />
                        </motion.div>

                        {/* Status Code */}
                        <motion.div variants={itemVariants} className="mb-4">
                            <h1 className="text-6xl lg:text-8xl font-bold text-foreground mb-4">
                                {statusCode}
                            </h1>
                        </motion.div>

                        {/* Title */}
                        <motion.h2
                            variants={itemVariants}
                            className="text-2xl lg:text-3xl font-bold text-foreground mb-4"
                        >
                            {title || config.title}
                        </motion.h2>

                        {/* Message */}
                        <motion.p
                            variants={itemVariants}
                            className="text-muted-foreground text-lg mb-8 leading-relaxed max-w-lg mx-auto"
                        >
                            {message || config.message}
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            variants={itemVariants}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            {showRetry && (
                                <Button
                                    onClick={handleRetry}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Coba Lagi
                                </Button>
                            )}

                            {showBack && (
                                <Button
                                    onClick={handleBack}
                                    variant="outline"
                                    className="border-2 border-border hover:border-primary hover:bg-accent transition-all duration-200"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Kembali
                                </Button>
                            )}

                            {showHome && (
                                <Button
                                    onClick={handleHome}
                                    variant="outline"
                                    className="border-2 border-border hover:border-primary hover:bg-accent transition-all duration-200"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Beranda
                                </Button>
                            )}
                        </motion.div>

                        {/* Additional Help */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-8 pt-6 border-t border-border"
                        >
                            <p className="text-sm text-muted-foreground">
                                Masih mengalami masalah?{' '}
                                <a
                                    href="mailto:support@ramein.com"
                                    className="text-primary hover:text-primary/80 transition-colors font-medium"
                                >
                                    Hubungi Support
                                </a>
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>

                {/* Background Decoration */}
                <motion.div
                    className="absolute inset-0 -z-10 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
                </motion.div>
            </motion.div>
        </div>
    )
}
