import React, { useState } from 'react'
import Image from 'next/image'

const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

type ImageWithFallbackProps = Omit<React.ComponentProps<typeof Image>, 'src' | 'alt'> & {
    src: string
    alt: string
    className?: string
    style?: React.CSSProperties
}

export function ImageWithFallback(props: ImageWithFallbackProps) {
    const [didError, setDidError] = useState(false)

    const { src, alt, style, className, ...rest } = props
    const { width, height, ...restWithoutSize } = rest as { width?: number; height?: number }

    const commonProps = {
        onError: () => setDidError(true),
        'data-original-url': src,
    } as const

    // If explicit dimensions are provided, use fixed sizing
    if (width && height) {
        return (
            <Image
                src={didError ? ERROR_IMG_SRC : src}
                width={width}
                height={height}
                alt={didError ? 'Error loading image' : alt}
                className={className}
                style={style}
                unoptimized={didError}
                {...restWithoutSize}
                {...commonProps}
            />
        )
    }

    // Otherwise, use fill to respect container sizing from className/style
    return (
        <div className={`relative ${className ?? ''}`} style={style}>
            <Image
                src={didError ? ERROR_IMG_SRC : src}
                fill
                sizes="100vw"
                alt={didError ? 'Error loading image' : alt}
                style={{ objectFit: 'cover' }}
                unoptimized={didError}
                {...restWithoutSize}
                {...commonProps}
            />
        </div>
    )
}
