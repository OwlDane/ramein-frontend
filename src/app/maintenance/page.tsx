import { ErrorPage } from '@/components/error'

export default function Maintenance() {
    return (
        <ErrorPage
            statusCode={503}
            title="Layanan Sedang Dipelihara"
            message="Kami sedang melakukan pemeliharaan sistem untuk memberikan pengalaman yang lebih baik. Silakan kembali dalam beberapa saat."
            showRetry={true}
            showHome={true}
            showBack={false}
        />
    )
}
