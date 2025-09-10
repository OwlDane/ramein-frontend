/**
 * Format utility functions
 */

export const formatCurrency = (amount: number, currency = 'IDR'): string => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount)
}

export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('id-ID').format(num)
}

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options
    }

    return new Intl.DateTimeFormat('id-ID', defaultOptions).format(new Date(date))
}

export const formatTime = (date: string | Date): string => {
    return new Intl.DateTimeFormat('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date))
}

export const formatDateTime = (date: string | Date): string => {
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date))
}

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')

    // Format Indonesian phone number
    if (cleaned.startsWith('62')) {
        return `+${cleaned}`
    } else if (cleaned.startsWith('0')) {
        return `+62${cleaned.slice(1)}`
    } else {
        return `+62${cleaned}`
    }
}
