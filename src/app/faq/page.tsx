export default function FAQPage() {
    return (
        <div className="min-h-screen bg-background pt-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-foreground mb-8">Frequently Asked Questions</h1>

                <div className="space-y-6">
                    <div className="border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2">How do I register for an event?</h3>
                        <p className="text-muted-foreground">To register for an event, you need to create an account first, then browse available events and click the &ldquo;Register&rdquo; button on any event you&apos;re interested in.</p>
                    </div>

                    <div className="border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2">How do I get my certificate after attending an event?</h3>
                        <p className="text-muted-foreground">After attending an event, your certificate will be automatically generated and available in your dashboard. You can download it from there.</p>
                    </div>

                    <div className="border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Can I cancel my event registration?</h3>
                        <p className="text-muted-foreground">Yes, you can cancel your registration up to 24 hours before the event starts. Go to your dashboard and find the event in your registrations.</p>
                    </div>

                    <div className="border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2">What happens if I miss an event?</h3>
                        <p className="text-muted-foreground">If you miss an event, you won&apos;t receive a certificate. However, you can still view the event details and any materials that were shared.</p>
                    </div>

                    <div className="border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2">How do I reset my password?</h3>
                        <p className="text-muted-foreground">You can reset your password by clicking the &ldquo;Forgot Password&rdquo; link on the login page. We&apos;ll send you an email with a reset link.</p>
                    </div>

                    <div className="border border-border rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-2">Is my personal information secure?</h3>
                        <p className="text-muted-foreground">Yes, we take your privacy seriously. All personal information is encrypted and stored securely. We never share your information with third parties without your consent.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
