import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText } from 'lucide-react';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">Terms of Service</h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Our terms and conditions
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
                            1. Acceptance of Terms
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            By accessing and using Ramein, you accept and agree to be
                            bound by the terms and provision of this agreement. If you
                            do not agree to these terms, please do not use our services.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            2. Use of Service
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            You agree to use our platform only for lawful purposes and
                            in accordance with these Terms. You are responsible for
                            maintaining the confidentiality of your account credentials.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            3. Event Registration
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            When you register for an event, you agree to provide
                            accurate information and to attend the event or cancel your
                            registration in accordance with the event&apos;s
                            cancellation policy.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            4. Payment Terms
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            Payment for events is processed securely through our payment
                            partners. All fees are non-refundable unless otherwise
                            stated by the event organizer.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            5. Limitation of Liability
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            Ramein shall not be liable for any indirect, incidental,
                            special, consequential or punitive damages resulting from
                            your use of or inability to use the service.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            6. Changes to Terms
                        </h3>
                        <p className="text-foreground/80 mb-4">
                            We reserve the right to modify these terms at any time. We
                            will notify users of any material changes via email or
                            through our platform.
                        </p>

                        <h3 className="text-xl font-bold mt-6 mb-3 text-foreground">
                            7. Contact Information
                        </h3>
                        <p className="text-foreground/80">
                            For questions about these Terms of Service, please contact
                            us at{" "}
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
