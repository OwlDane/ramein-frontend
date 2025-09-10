'use client'

import React, { createContext, useContext } from 'react'
import { ErrorToast, useErrorToast, ErrorType } from '@/components/error'

interface ToastItem {
    id: string
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

interface ErrorContextType {
    showError: (title: string, message?: string) => void
    showWarning: (title: string, message?: string) => void
    showInfo: (title: string, message?: string) => void
    showSuccess: (title: string, message?: string) => void
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

export function useError() {
    const context = useContext(ErrorContext)
    if (context === undefined) {
        throw new Error('useError must be used within an ErrorProvider')
    }
    return context
}

export function ErrorProvider({ children }: { children: React.ReactNode }) {
    const { toasts, showError, showWarning, showInfo, showSuccess } = useErrorToast()

    const contextValue = {
        showError,
        showWarning,
        showInfo,
        showSuccess
    }

    return (
        <ErrorContext.Provider value={contextValue}>
            {children}

            {/* Render all toasts */}
            {toasts.map((toast: ToastItem) => (
                <ErrorToast
                    key={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={toast.onClose}
                    showCloseButton={toast.showCloseButton}
                    action={toast.action}
                />
            ))}
        </ErrorContext.Provider>
    )
}
