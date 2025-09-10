/**
 * Validation utility functions
 */

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export const isValidPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
    return passwordRegex.test(password)
}

export const isValidPhoneNumber = (phone: string): boolean => {
    // Indonesian phone number format
    const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const isValidName = (name: string): boolean => {
    // At least 2 characters, only letters and spaces
    const nameRegex = /^[a-zA-Z\s]{2,}$/
    return nameRegex.test(name.trim())
}

export const isValidURL = (url: string): boolean => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

export const isValidDate = (date: string): boolean => {
    const parsedDate = new Date(date)
    return !isNaN(parsedDate.getTime())
}

export const isFutureDate = (date: string): boolean => {
    return new Date(date) > new Date()
}

export const isPastDate = (date: string): boolean => {
    return new Date(date) < new Date()
}

interface ValidationRule {
    required?: string
    pattern?: {
        test: (value: string) => boolean
        message?: string
    }
    minLength?: {
        value: number
        message?: string
    }
    maxLength?: {
        value: number
        message?: string
    }
}

export const validateForm = (data: Record<string, unknown>, rules: Record<string, ValidationRule>): Record<string, string> => {
    const errors: Record<string, string> = {}

    Object.keys(rules).forEach(field => {
        const value = data[field]
        const fieldRules = rules[field]

        if (fieldRules.required && (!value || value.toString().trim() === '')) {
            errors[field] = fieldRules.required
        } else if (value && fieldRules.pattern && !fieldRules.pattern.test(value.toString())) {
            errors[field] = fieldRules.pattern.message || 'Format tidak valid'
        } else if (value && fieldRules.minLength && value.toString().length < fieldRules.minLength.value) {
            errors[field] = fieldRules.minLength.message || `Minimal ${fieldRules.minLength.value} karakter`
        } else if (value && fieldRules.maxLength && value.toString().length > fieldRules.maxLength.value) {
            errors[field] = fieldRules.maxLength.message || `Maksimal ${fieldRules.maxLength.value} karakter`
        }
    })

    return errors
}
