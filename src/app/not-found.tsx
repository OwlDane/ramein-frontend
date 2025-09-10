import { ErrorPage } from '@/components/error'

export default function NotFound() {
    return (
        <ErrorPage
            statusCode={404}
            title="Halaman Tidak Ditemukan"
            message="Maaf, halaman yang Anda cari tidak dapat ditemukan. Mungkin halaman tersebut telah dipindahkan atau dihapus."
            showRetry={false}
            showHome={true}
            showBack={true}
        />
    )
}
