/**
 * String utility functions
 */

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const capitalizeWords = (str: string): string => {
    return str.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    )
}

export const truncate = (str: string, length: number, suffix = '...'): string => {
    if (str.length <= length) return str
    return str.substring(0, length) + suffix
}

export const slugify = (str: string): string => {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
}

export const camelCase = (str: string): string => {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
        return index === 0 ? word.toLowerCase() : word.toUpperCase()
    }).replace(/\s+/g, '')
}

export const kebabCase = (str: string): string => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
}

export const snakeCase = (str: string): string => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase()
}

export const removeAccents = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export const generateRandomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

export const generateId = (prefix = ''): string => {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substr(2, 5)
    return `${prefix}${timestamp}${random}`.toLowerCase()
}

export const extractInitials = (name: string, maxLength = 2): string => {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, maxLength)
}

export const maskEmail = (email: string): string => {
    const [username, domain] = email.split('@')
    if (username.length <= 2) return email

    const maskedUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1)
    return `${maskedUsername}@${domain}`
}

export const maskPhone = (phone: string): string => {
    if (phone.length <= 4) return phone

    const visibleDigits = 4
    const maskedLength = phone.length - visibleDigits
    const visiblePart = phone.slice(-visibleDigits)
    const maskedPart = '*'.repeat(maskedLength)

    return maskedPart + visiblePart
}

export const highlightText = (text: string, searchTerm: string): string => {
    if (!searchTerm) return text

    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
}

export const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '')
}

export const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }

    return text.replace(/[&<>"']/g, (m) => map[m])
}

