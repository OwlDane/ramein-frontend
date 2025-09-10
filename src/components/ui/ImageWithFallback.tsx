import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { getFallbackImageUrl, getAvatarFallbackUrl } from '@/lib/unsplash'

const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type ImageWithFallbackProps = Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> & {
    src: string
    alt: string
    className?: string
    style?: React.CSSProperties
    fallbackType?: 'image' | 'avatar'
    retryCount?: number
    onError?: (error: Error) => void
    onLoad?: () => void
    priority?: boolean
    quality?: number
    placeholder?: 'blur' | 'empty'
    blurDataURL?: string
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
    const {
        src,
        alt,
        style,
        className,
        width,
        height,
        fallbackType = 'image',
        retryCount = 2,
        onError,
        onLoad,
        priority = false,
        quality = 75,
        placeholder = 'empty',
        blurDataURL,
        ...rest
    } = props

    const [currentSrc, setCurrentSrc] = useState(src)
    const [retryAttempts, setRetryAttempts] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    // Generate fallback URL based on type
    const getFallbackUrl = useCallback(() => {
        if (fallbackType === 'avatar') {
            return getAvatarFallbackUrl(alt || 'user', typeof width === 'number' ? width : 150)
        }
        return getFallbackImageUrl(alt || 'fallback', typeof width === 'number' ? width : 800, typeof height === 'number' ? height : 600)
    }, [fallbackType, alt, width, height])

    // Handle image load error
    const handleError = useCallback(() => {
        if (retryAttempts < retryCount && !hasError) {
            // Retry with exponential backoff
            const delay = Math.pow(2, retryAttempts) * 1000
            setTimeout(() => {
                setRetryAttempts(prev => prev + 1)
                setCurrentSrc(`${src}?retry=${retryAttempts + 1}&t=${Date.now()}`)
            }, delay)
        } else {
            // Use fallback image
            setCurrentSrc(getFallbackUrl())
            setHasError(true)
            onError?.(new Error(`Failed to load image after ${retryAttempts + 1} attempts`))
        }
    }, [src, retryAttempts, retryCount, hasError, getFallbackUrl, onError])

    // Handle successful image load
    const handleLoad = useCallback(() => {
        setIsLoading(false)
        onLoad?.()
    }, [onLoad])

    // Reset state when src changes
    useEffect(() => {
        setCurrentSrc(src)
        setRetryAttempts(0)
        setHasError(false)
        setIsLoading(true)
    }, [src])

    const commonProps = {
        onError: handleError,
        onLoad: handleLoad,
        'data-original-url': src,
        priority,
        quality,
        placeholder,
        blurDataURL: blurDataURL || (placeholder === 'blur' ? 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=' : undefined),
    } as const

    // If explicit dimensions are provided, use fixed sizing
    if (width && height) {
        return (
            <div className={`relative ${className || ''}`} style={style}>
                {isLoading && (
                    <div className="absolute inset-0 bg-muted animate-pulse rounded" />
                )}
                <Image
                    src={hasError ? ERROR_IMG_SRC : currentSrc}
                    width={width}
                    height={height}
                    alt={hasError ? 'Error loading image' : alt}
                    className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                    unoptimized={hasError}
                    {...rest}
                    {...commonProps}
                />
            </div>
        )
    }

    // Otherwise, use fill to respect container sizing from className/style
    return (
        <div className={`relative ${className ?? ''}`} style={style}>
            {isLoading && (
                <div className="absolute inset-0 bg-muted animate-pulse rounded" />
            )}
            <Image
                src={hasError ? ERROR_IMG_SRC : currentSrc}
                fill
                sizes="100vw"
                alt={hasError ? 'Error loading image' : alt}
                style={{ objectFit: 'cover' }}
                className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                unoptimized={hasError}
                {...rest}
                {...commonProps}
            />
        </div>
    )
}