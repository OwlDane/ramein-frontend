'use client'

import { ErrorPage } from '@/components/error'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error)
    }, [error])

    // Determine error type based on error message or other properties
    const getErrorType = () => {
        if (error.message.includes('404') || error.message.includes('not found')) {
            return 404
        }
        if (error.message.includes('500') || error.message.includes('server')) {
            return 500
        }
        if (error.message.includes('503') || error.message.includes('maintenance')) {
            return 503
        }
        return 500 // Default to server error
    }

    const statusCode = getErrorType()

    return (
        <ErrorPage
            statusCode={statusCode}
            title="Terjadi Kesalahan"
            message="Maaf, terjadi kesalahan yang tidak terduga. Tim kami telah diberitahu dan sedang memperbaikinya."
            showRetry={true}
            showHome={true}
            showBack={true}
            onRetry={reset}
        />
    )
}
