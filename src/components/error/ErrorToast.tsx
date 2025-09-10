'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type ErrorType = 'error' | 'warning' | 'info' | 'success'

interface ErrorToastProps {
    type: ErrorType
    title: string
    message?: string
    duration?: number
    onClose?: () => void
    showCloseButton?: boolean
    action?: {
        label: string
        onClick: () => void
    }
}

const typeConfig = {
    error: {
        icon: AlertCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-100'
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        iconBg: 'bg-yellow-100'
    },
    info: {
        icon: Info,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconBg: 'bg-blue-100'
    },
    success: {
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconBg: 'bg-green-100'
    }
}

export function ErrorToast({
    type,
    title,
    message,
    duration = 5000,
    onClose,
    showCloseButton = true,
    action
}: ErrorToastProps) {
    const [isVisible, setIsVisible] = useState(true)
    const config = typeConfig[type]
    const Icon = config.icon

    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false)
            }, duration)

            return () => clearTimeout(timer)
        }
    }, [duration])

    const handleClose = () => {
        setIsVisible(false)
        onClose?.()
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed top-4 right-4 z-50 max-w-sm w-full"
                >
                    <div className={`
            ${config.bgColor} ${config.borderColor} 
            border rounded-lg shadow-lg p-4 backdrop-blur-sm
          `}>
                        <div className="flex items-start gap-3">
                            <div className={`
                ${config.iconBg} ${config.color} 
                rounded-full p-2 flex-shrink-0
              `}>
                                <Icon className="w-5 h-5" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className={`font-semibold ${config.color} text-sm`}>
                                    {title}
                                </h4>
                                {message && (
                                    <p className="text-muted-foreground text-sm mt-1">
                                        {message}
                                    </p>
                                )}

                                {action && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="mt-2 text-xs"
                                        onClick={action.onClick}
                                    >
                                        {action.label}
                                    </Button>
                                )}
                            </div>

                            {showCloseButton && (
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="flex-shrink-0 p-1 h-auto"
                                    onClick={handleClose}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Hook for managing error toasts
export function useErrorToast() {
    const [toasts, setToasts] = useState<Array<ErrorToastProps & { id: string }>>([])

    const addToast = (toast: Omit<ErrorToastProps, 'onClose'>) => {
        const id = Math.random().toString(36).substr(2, 9)
        const newToast = {
            ...toast,
            id,
            onClose: () => removeToast(id)
        }
        setToasts(prev => [...prev, newToast])
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }

    const showError = (title: string, message?: string) => {
        addToast({ type: 'error', title, message })
    }

    const showWarning = (title: string, message?: string) => {
        addToast({ type: 'warning', title, message })
    }

    const showInfo = (title: string, message?: string) => {
        addToast({ type: 'info', title, message })
    }

    const showSuccess = (title: string, message?: string) => {
        addToast({ type: 'success', title, message })
    }

    return {
        toasts,
        addToast,
        removeToast,
        showError,
        showWarning,
        showInfo,
        showSuccess
    }
}
