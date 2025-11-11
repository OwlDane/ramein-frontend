import React from 'react';
import { motion } from 'framer-motion';
import { X, Shield } from 'lucide-react';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-background to-muted/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-border/50 relative"
            >
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

                <div className="relative p-6 border-b border-border/50 backdrop-blur-sm">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <Shield className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                        Privacy Policy
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        How we protect your data
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-muted/80 flex items-center justify-center transition-all hover:rotate-90 duration-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="relative p-6 overflow-y-auto max-h-[calc(90vh-180px)] scroll-smooth bg-gradient-to-b from-transparent to-muted/20">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs text-muted-foreground mb-4">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Last updated: {new Date().toLocaleDateString()}
                        </div>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            1. Information We Collect
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            We collect information you provide directly to us when you
                            register for events, create an account, or communicate
                            with us. This may include your name, email address, phone
                            number, and payment information.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            2. How We Use Your Information
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            We use the information we collect to provide, maintain,
                            and improve our services, process your event
                            registrations, send you updates about events, and respond
                            to your requests.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            3. Information Sharing
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            We do not sell your personal information. We may share
                            your information with event organizers for events you
                            register for, and with service providers who assist us in
                            operating our platform.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            4. Data Security
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            We implement appropriate security measures to protect your
                            personal information. However, no method of transmission
                            over the internet is 100% secure.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            5. Your Rights
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            You have the right to access, update, or delete your
                            personal information. You can do this through your account
                            settings or by contacting us directly.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            6. Contact Us
                        </h3>
                        <p className="text-foreground/80">
                            If you have any questions about this Privacy Policy,
                            please contact us at{" "}
                            <a
                                href="mailto:hello@ramein.com"
                                className="text-primary font-medium hover:underline"
                            >
                                hello@ramein.com
                            </a>
                        </p>
                    </div>
                </div>

                {/* Keyboard Hint */}
                <div className="px-6 py-3 border-t border-border bg-muted/30">
                    <p className="text-xs text-muted-foreground text-center">
                        Press <kbd className="px-2 py-1 rounded bg-background border border-border text-xs">ESC</kbd> to close
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
