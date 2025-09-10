/**
 * Storage utility functions
 */

export const storage = {
    get: <T>(key: string, defaultValue?: T): T | null => {
        if (typeof window === 'undefined') return defaultValue || null

        try {
            const item = localStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue || null
        } catch (error) {
            console.error(`Error getting item from localStorage: ${key}`, error)
            return defaultValue || null
        }
    },

    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return

        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(`Error setting item in localStorage: ${key}`, error)
        }
    },

    remove: (key: string): void => {
        if (typeof window === 'undefined') return

        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.error(`Error removing item from localStorage: ${key}`, error)
        }
    },

    clear: (): void => {
        if (typeof window === 'undefined') return

        try {
            localStorage.clear()
        } catch (error) {
            console.error('Error clearing localStorage', error)
        }
    },

    exists: (key: string): boolean => {
        if (typeof window === 'undefined') return false
        return localStorage.getItem(key) !== null
    }
}

export const sessionStorage = {
    get: <T>(key: string, defaultValue?: T): T | null => {
        if (typeof window === 'undefined') return defaultValue || null

        try {
            const item = window.sessionStorage.getItem(key)
            return item ? JSON.parse(item) : defaultValue || null
        } catch (error) {
            console.error(`Error getting item from sessionStorage: ${key}`, error)
            return defaultValue || null
        }
    },

    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return

        try {
            window.sessionStorage.setItem(key, JSON.stringify(value))
        } catch (error) {
            console.error(`Error setting item in sessionStorage: ${key}`, error)
        }
    },

    remove: (key: string): void => {
        if (typeof window === 'undefined') return

        try {
            window.sessionStorage.removeItem(key)
        } catch (error) {
            console.error(`Error removing item from sessionStorage: ${key}`, error)
        }
    },

    clear: (): void => {
        if (typeof window === 'undefined') return

        try {
            window.sessionStorage.clear()
        } catch (error) {
            console.error('Error clearing sessionStorage', error)
        }
    }
}
