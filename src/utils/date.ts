/**
 * Date utility functions
 */

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export const addMonths = (date: Date, months: number): Date => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
}

export const addYears = (date: Date, years: number): Date => {
    const result = new Date(date)
    result.setFullYear(result.getFullYear() + years)
    return result
}

export const getDaysDifference = (date1: Date, date2: Date): number => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime())
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

export const isToday = (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
}

export const isYesterday = (date: Date): boolean => {
    const yesterday = addDays(new Date(), -1)
    return date.toDateString() === yesterday.toDateString()
}

export const isTomorrow = (date: Date): boolean => {
    const tomorrow = addDays(new Date(), 1)
    return date.toDateString() === tomorrow.toDateString()
}

export const getStartOfDay = (date: Date): Date => {
    const result = new Date(date)
    result.setHours(0, 0, 0, 0)
    return result
}

export const getEndOfDay = (date: Date): Date => {
    const result = new Date(date)
    result.setHours(23, 59, 59, 999)
    return result
}

export const getStartOfWeek = (date: Date): Date => {
    const result = new Date(date)
    const day = result.getDay()
    const diff = result.getDate() - day + (day === 0 ? -6 : 1) // Monday as first day
    result.setDate(diff)
    return getStartOfDay(result)
}

export const getEndOfWeek = (date: Date): Date => {
    const startOfWeek = getStartOfWeek(date)
    return getEndOfDay(addDays(startOfWeek, 6))
}

export const getStartOfMonth = (date: Date): Date => {
    const result = new Date(date)
    result.setDate(1)
    return getStartOfDay(result)
}

export const getEndOfMonth = (date: Date): Date => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + 1, 0)
    return getEndOfDay(result)
}

export const isWeekend = (date: Date): boolean => {
    const day = date.getDay()
    return day === 0 || day === 6
}

export const isWeekday = (date: Date): boolean => {
    return !isWeekend(date)
}

export const getRelativeTime = (date: Date): string => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) {
        return 'baru saja'
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60)
        return `${minutes} menit yang lalu`
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600)
        return `${hours} jam yang lalu`
    } else if (diffInSeconds < 2592000) {
        const days = Math.floor(diffInSeconds / 86400)
        return `${days} hari yang lalu`
    } else if (diffInSeconds < 31536000) {
        const months = Math.floor(diffInSeconds / 2592000)
        return `${months} bulan yang lalu`
    } else {
        const years = Math.floor(diffInSeconds / 31536000)
        return `${years} tahun yang lalu`
    }
}
