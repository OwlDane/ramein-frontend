import { ErrorPage } from '@/components/error'

export default function NetworkError() {
    return (
        <ErrorPage
            statusCode={503}
            title="Koneksi Bermasalah"
            message="Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi."
            showRetry={true}
            showHome={true}
            showBack={true}
        />
    )
}
