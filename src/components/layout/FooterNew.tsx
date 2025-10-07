import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Twitter, Linkedin, Github, X } from 'lucide-react';
import Link from 'next/link';

export function FooterNew() {
    const currentYear = new Date().getFullYear();
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [showFaq, setShowFaq] = useState(false);

    const footerLinks = {
        product: [
            { name: 'Events', href: '/?view=events', type: 'link' },
            { name: 'FAQ', onClick: () => setShowFaq(true), type: 'button' }
        ],
        company: [
            { name: 'About', href: '/about' },
            { name: 'Articles', href: '/articles' },
            { name: 'Contact', href: '/contact' }
        ],
        legal: [
            { name: 'Privacy Policy', onClick: () => setShowPrivacy(true), type: 'button' },
            { name: 'Terms of Service', onClick: () => setShowTerms(true), type: 'button' },
            { name: 'Customer Service', href: '/customer-service', type: 'link' }
        ]
    };

    const socialLinks = [
        { name: 'Instagram', icon: Instagram, href: '#' },
        { name: 'Twitter', icon: Twitter, href: '#' },
        { name: 'LinkedIn', icon: Linkedin, href: '#' },
        { name: 'GitHub', icon: Github, href: '#' }
    ];

    return (
        <footer className="bg-foreground text-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    {/* Main Footer Content */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="lg:col-span-2">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <Link href="/">
                                    <h2 className="text-4xl md:text-5xl font-bold mb-4 hover:opacity-80 transition-opacity cursor-pointer">
                                        Ramein
                                    </h2>
                                </Link>
                                <p className="text-background/70 text-base mb-6 max-w-sm">
                                    Creating unforgettable experiences through amazing events. 
                                    Join our community today.
                                </p>
                            </motion.div>
                        </div>

                        {/* Links Columns */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                        >
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Product</h3>
                            <ul className="space-y-2">
                                {footerLinks.product.map((link) => (
                                    <li key={link.name}>
                                        {link.type === 'link' && link.href ? (
                                            <Link
                                                href={link.href}
                                                className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm py-1"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                                                <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={link.onClick}
                                                className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm text-left py-1"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                                                <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Company</h3>
                            <ul className="space-y-2">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm py-1"
                                        >
                                            <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                                            <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Legal</h3>
                            <ul className="space-y-2">
                                {footerLinks.legal.map((link) => (
                                    <li key={link.name}>
                                        {link.type === 'link' && link.href ? (
                                            <Link
                                                href={link.href}
                                                className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm py-1"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                                                <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={link.onClick}
                                                className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm text-left py-1"
                                            >
                                                <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                                                <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    {/* Bottom Bar */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="pt-8 border-t border-background/20"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            {/* Copyright */}
                            <p className="text-sm text-background/60">
                                © {currentYear} Ramein. All rights reserved.
                            </p>

                            {/* Social Links */}
                            <div className="flex items-center gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        aria-label={social.name}
                                        className="w-10 h-10 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition-colors group"
                                    >
                                        <social.icon className="w-5 h-5 text-background/70 group-hover:text-background transition-colors" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Privacy Policy Modal */}
            <AnimatePresence>
                {showPrivacy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md"
                        onClick={() => setShowPrivacy(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gradient-to-br from-background to-muted/30 rounded-3xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl border border-border/50 relative"
                        >
                            {/* Decorative gradient overlay */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
                            
                            <div className="relative p-6 border-b border-border/50 backdrop-blur-sm flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold mb-1">Privacy Policy</h2>
                                    <p className="text-sm text-muted-foreground">How we protect your data</p>
                                </div>
                                <button
                                    onClick={() => setShowPrivacy(false)}
                                    className="w-10 h-10 rounded-full hover:bg-muted/80 flex items-center justify-center transition-all hover:rotate-90 duration-300 group"
                                >
                                    <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>
                            <div className="relative p-6 overflow-y-auto max-h-[calc(85vh-120px)] bg-gradient-to-b from-transparent to-muted/20">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground mb-4">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        Last updated: {new Date().toLocaleDateString()}
                                    </div>
                                    
                                    <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">1</span>
                                            Information We Collect
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            We collect information you provide directly to us when you register for events, create an account, 
                                            or communicate with us. This may include your name, email address, phone number, and payment information.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">2</span>
                                            How We Use Your Information
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            We use the information we collect to provide, maintain, and improve our services, process your 
                                            event registrations, send you updates about events, and respond to your requests.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">3</span>
                                            Information Sharing
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            We do not sell your personal information. We may share your information with event organizers 
                                            for events you register for, and with service providers who assist us in operating our platform.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">4</span>
                                            Data Security
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            We implement appropriate security measures to protect your personal information. However, no 
                                            method of transmission over the internet is 100% secure.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-colors">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold">5</span>
                                            Your Rights
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            You have the right to access, update, or delete your personal information. You can do this 
                                            through your account settings or by contacting us directly.
                                        </p>
                                    </div>

                                    <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20">
                                        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                            <span className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold">📧</span>
                                            Contact Us
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            If you have any questions about this Privacy Policy, please contact us at{' '}
                                            <a href="mailto:hello@ramein.com" className="text-primary font-medium hover:underline">hello@ramein.com</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAQ Modal */}
            <AnimatePresence>
                {showFaq && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowFaq(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-background rounded-3xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                                <button
                                    onClick={() => setShowFaq(false)}
                                    className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                                <div className="space-y-6">
                                    {/* FAQ Item 1 */}
                                    <div className="border-b border-border pb-6">
                                        <h3 className="text-lg font-bold mb-2">How do I register for an event?</h3>
                                        <p className="text-muted-foreground">
                                            To register for an event, simply browse our events catalog, select the event you&apos;re interested in, 
                                            and click the &quot;Register Now&quot; button. You&apos;ll need to create an account or log in if you haven&apos;t already. 
                                            Follow the registration steps and complete the payment if required.
                                        </p>
                                    </div>

                                    {/* FAQ Item 2 */}
                                    <div className="border-b border-border pb-6">
                                        <h3 className="text-lg font-bold mb-2">Can I cancel my event registration?</h3>
                                        <p className="text-muted-foreground">
                                            Cancellation policies vary by event. Please check the specific event&apos;s cancellation policy before registering. 
                                            Generally, you can cancel your registration through your dashboard. Refunds, if applicable, will be processed 
                                            according to the event organizer&apos;s policy.
                                        </p>
                                    </div>

                                    {/* FAQ Item 3 */}
                                    <div className="border-b border-border pb-6">
                                        <h3 className="text-lg font-bold mb-2">How do I get my event ticket or confirmation?</h3>
                                        <p className="text-muted-foreground">
                                            After successful registration, you&apos;ll receive a confirmation email with your event details and a unique 
                                            registration token. You can also access your tickets anytime from your dashboard. Make sure to bring your 
                                            token or confirmation email to the event.
                                        </p>
                                    </div>

                                    {/* FAQ Item 4 */}
                                    <div className="border-b border-border pb-6">
                                        <h3 className="text-lg font-bold mb-2">What payment methods do you accept?</h3>
                                        <p className="text-muted-foreground">
                                            We accept various payment methods including credit/debit cards, bank transfers, and digital wallets. 
                                            The available payment options will be displayed during the checkout process. All payments are processed 
                                            securely through our trusted payment partners.
                                        </p>
                                    </div>

                                    {/* FAQ Item 5 */}
                                    <div className="border-b border-border pb-6">
                                        <h3 className="text-lg font-bold mb-2">How do I mark my attendance at an event?</h3>
                                        <p className="text-muted-foreground">
                                            Once you&apos;re registered for an event, you&apos;ll receive a unique attendance token. At the event venue, 
                                            you can use this token to mark your attendance through the &quot;Fill Attendance&quot; button in your dashboard 
                                            or by providing it to the event organizer.
                                        </p>
                                    </div>

                                    {/* FAQ Item 6 */}
                                    <div className="border-b border-border pb-6">
                                        <h3 className="text-lg font-bold mb-2">Can I transfer my registration to someone else?</h3>
                                        <p className="text-muted-foreground">
                                            Registration transfers depend on the event organizer&apos;s policy. Some events allow transfers while others don&apos;t. 
                                            Please contact the event organizer directly through the event page or reach out to our support team for assistance.
                                        </p>
                                    </div>

                                    {/* FAQ Item 7 */}
                                    <div className="pb-6">
                                        <h3 className="text-lg font-bold mb-2">I didn&apos;t receive my confirmation email. What should I do?</h3>
                                        <p className="text-muted-foreground">
                                            First, check your spam or junk folder. If you still can&apos;t find it, log in to your dashboard where you can 
                                            view all your registered events and download your confirmation. If the issue persists, contact our support 
                                            team at hello@ramein.com
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Terms of Service Modal */}
            <AnimatePresence>
                {showTerms && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowTerms(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-background rounded-3xl max-w-3xl w-full max-h-[80vh] overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-border flex items-center justify-between">
                                <h2 className="text-2xl font-bold">Terms of Service</h2>
                                <button
                                    onClick={() => setShowTerms(false)}
                                    className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                                <div className="prose prose-slate max-w-none">
                                    <p className="text-muted-foreground mb-4">Last updated: {new Date().toLocaleDateString()}</p>
                                    
                                    <h3 className="text-xl font-bold mt-6 mb-3">1. Acceptance of Terms</h3>
                                    <p className="text-muted-foreground mb-4">
                                        By accessing and using Ramein, you accept and agree to be bound by the terms and provision 
                                        of this agreement. If you do not agree to these terms, please do not use our services.
                                    </p>

                                    <h3 className="text-xl font-bold mt-6 mb-3">2. Use of Service</h3>
                                    <p className="text-muted-foreground mb-4">
                                        You agree to use our platform only for lawful purposes and in accordance with these Terms. 
                                        You are responsible for maintaining the confidentiality of your account credentials.
                                    </p>

                                    <h3 className="text-xl font-bold mt-6 mb-3">3. Event Registration</h3>
                                    <p className="text-muted-foreground mb-4">
                                        When you register for an event, you agree to provide accurate information and to attend 
                                        the event or cancel your registration in accordance with the event's cancellation policy.
                                    </p>

                                    <h3 className="text-xl font-bold mt-6 mb-3">4. Payment Terms</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Payment for events is processed securely through our payment partners. All fees are 
                                        non-refundable unless otherwise stated by the event organizer.
                                    </p>

                                    <h3 className="text-xl font-bold mt-6 mb-3">5. Limitation of Liability</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Ramein shall not be liable for any indirect, incidental, special, consequential or punitive 
                                        damages resulting from your use of or inability to use the service.
                                    </p>

                                    <h3 className="text-xl font-bold mt-6 mb-3">6. Changes to Terms</h3>
                                    <p className="text-muted-foreground mb-4">
                                        We reserve the right to modify these terms at any time. We will notify users of any 
                                        material changes via email or through our platform.
                                    </p>

                                    <h3 className="text-xl font-bold mt-6 mb-3">7. Contact Information</h3>
                                    <p className="text-muted-foreground">
                                        For questions about these Terms of Service, please contact us at hello@ramein.com
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </footer>
    );
}
