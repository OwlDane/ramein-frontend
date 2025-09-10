/**
 * Environment Configuration
 */

export const env = {
    // App Configuration
    NODE_ENV: process.env.NODE_ENV || 'development',
    IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
    IS_PRODUCTION: process.env.NODE_ENV === 'production',

    // API Configuration
    API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',

    // Unsplash Configuration
    UNSPLASH_ACCESS_KEY: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',

    // Feature Flags
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true',

    // PWA Configuration
    PWA_ENABLED: process.env.NEXT_PUBLIC_PWA_ENABLED === 'true',

    // Error Reporting
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',

    // Social Media
    FACEBOOK_APP_ID: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
    GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',

    // Other Services
    GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID || '',
    HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
} as const

export const isClient = typeof window !== 'undefined'
export const isServer = typeof window === 'undefined'
