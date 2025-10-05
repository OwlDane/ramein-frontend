// Application Constants
export const APP_CONFIG = {
    name: 'Ramein',
    description: 'Platform Event Terpercaya #1',
    version: '1.0.0',
    author: 'Ramein Team',
    url: 'https://ramein.com',
    supportEmail: 'support@ramein.com'
} as const

export const API_ENDPOINTS = {
    base: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
        profile: '/auth/profile',
        verifyEmail: '/auth/verify-email',
        requestOTP: '/auth/request-otp',
        verifyOTP: '/auth/verify-otp',
        forgotPassword: '/auth/forgot-password',
        resetPassword: '/auth/reset-password'
    },
    events: {
        list: '/events',
        detail: '/events',
        register: '/events/register',
        myEvents: '/participants/my-events'
    },
    admin: {
        login: '/admin/auth/login',
        logout: '/admin/auth/logout',
        verify: '/admin/auth/verify',
        profile: '/admin/auth/profile',
        dashboard: '/admin/dashboard',
        events: '/admin/events',
        certificates: '/admin/certificates',
        participants: '/admin/participants'
    }
} as const

export const STORAGE_KEYS = {
    token: 'ramein_token',
    userToken: 'userToken',
    viewState: 'ramein-view-state',
    theme: 'ramein-theme',
    language: 'ramein-language'
} as const

export const ERROR_MESSAGES = {
    network: 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
    server: 'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
    notFound: 'Halaman yang Anda cari tidak ditemukan.',
    unauthorized: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
    forbidden: 'Akses ditolak. Silakan login terlebih dahulu.',
    validation: 'Data yang Anda masukkan tidak valid.',
    timeout: 'Permintaan terlalu lama. Silakan coba lagi.'
} as const

export const SUCCESS_MESSAGES = {
    login: 'Berhasil login!',
    register: 'Registrasi berhasil! Silakan cek email untuk verifikasi.',
    logout: 'Berhasil logout!',
    profileUpdate: 'Profil berhasil diperbarui!',
    eventRegister: 'Berhasil mendaftar event!',
    passwordReset: 'Password berhasil direset!'
} as const

export const ROUTES = {
    home: '/',
    login: '/login',
    register: '/register',
    dashboard: '/dashboard',
    profile: '/profile',
    about: '/about',
    contact: '/contact',
    faq: '/faq',
    privacy: '/privacy',
    terms: '/terms',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    verifyEmail: '/verify-email',
    maintenance: '/maintenance',
    serverError: '/server-error',
    networkError: '/network-error',
    notFound: '/not-found'
} as const

export const VALIDATION_RULES = {
    email: {
        required: 'Email wajib diisi',
        pattern: 'Format email tidak valid'
    },
    password: {
        required: 'Password wajib diisi',
        minLength: 'Password minimal 8 karakter',
        pattern: 'Password harus mengandung huruf besar, huruf kecil, dan angka'
    },
    name: {
        required: 'Nama wajib diisi',
        minLength: 'Nama minimal 2 karakter'
    },
    phone: {
        required: 'Nomor telepon wajib diisi',
        pattern: 'Format nomor telepon tidak valid'
    }
} as const
