export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-20 px-6">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-3xl font-bold text-foreground mb-8">About Ramein</h1>

                <div className="prose prose-gray max-w-none">
                    <p className="text-lg text-muted-foreground mb-6">
                        Ramein is a leading platform for event management and discovery, connecting people with meaningful experiences.
                    </p>

                    <h2>Our Mission</h2>
                    <p>To create a seamless platform that empowers individuals and organizations to discover, organize, and participate in events that enrich lives and build communities.</p>

                    <h2>What We Do</h2>
                    <p>We provide a comprehensive event management solution that includes event discovery, registration, attendance tracking, and certificate generation. Our platform serves both event organizers and participants, making it easy to create and join events.</p>

                    <h2>Our Values</h2>
                    <ul>
                        <li><strong>Innovation:</strong> We continuously improve our platform with cutting-edge technology</li>
                        <li><strong>Community:</strong> We believe in the power of bringing people together</li>
                        <li><strong>Quality:</strong> We maintain high standards in everything we do</li>
                        <li><strong>Accessibility:</strong> We make events accessible to everyone</li>
                    </ul>

                    <h2>Contact Information</h2>
                    <p>For more information about Ramein, please contact us at hello@ramein.com or visit our contact page.</p>
                </div>
            </div>
        </div>
    )
}
