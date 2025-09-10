'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { ErrorPage } from './ErrorPage'

interface Props {
    children: ReactNode
    fallback?: ReactNode
    onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
    hasError: boolean
    error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo)

        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <ErrorPage
                    statusCode={500}
                    title="Terjadi Kesalahan"
                    message="Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau coba lagi nanti."
                    showRetry={true}
                    showHome={true}
                    showBack={true}
                    onRetry={() => {
                        this.setState({ hasError: false, error: undefined })
                        window.location.reload()
                    }}
                />
            )
        }

        return this.props.children
    }
}
