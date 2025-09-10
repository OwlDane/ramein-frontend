import { ErrorPage } from '@/components/error'

export default function ServerError() {
    return (
        <ErrorPage
            statusCode={500}
            title="Server Error"
            message="Terjadi kesalahan pada server kami. Tim kami telah diberitahu dan sedang memperbaikinya. Silakan coba lagi dalam beberapa saat."
            showRetry={true}
            showHome={true}
            showBack={true}
        />
    )
}
