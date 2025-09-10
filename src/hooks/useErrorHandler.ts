import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useErrorHandler() {
    const router = useRouter()

    const handleError = useCallback((error: Error, context?: string) => {
        console.error(`Error in ${context || 'unknown context'}:`, error)

        // Log to external service if needed
        // errorReportingService.log(error, context)

        // Determine error type and redirect accordingly
        if (error.message.includes('404') || error.message.includes('not found')) {
            router.push('/not-found')
        } else if (error.message.includes('500') || error.message.includes('server')) {
            router.push('/server-error')
        } else if (error.message.includes('503') || error.message.includes('maintenance')) {
            router.push('/maintenance')
        } else {
            // For other errors, you might want to show a toast or modal
            // instead of redirecting
            console.error('Unhandled error:', error)
        }
    }, [router])

    const handleAsyncError = useCallback(async (
        asyncFn: () => Promise<unknown>,
        context?: string
    ) => {
        try {
            return await asyncFn()
        } catch (error) {
            handleError(error as Error, context)
            throw error // Re-throw so calling code can handle if needed
        }
    }, [handleError])

    return {
        handleError,
        handleAsyncError
    }
}
