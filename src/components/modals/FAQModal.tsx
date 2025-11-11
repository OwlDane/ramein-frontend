import React from 'react';
import { motion } from 'framer-motion';
import { X, HelpCircle, ChevronDown, Mail, Lock, Eye, Users, FileText } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface FAQModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function FAQModal({ isOpen, onClose }: FAQModalProps) {
    if (!isOpen) return null;

    const faqData = [
        {
            id: "registration",
            question: "How do I register for an event?",
            answer: "To register for an event, simply browse our events catalog, select the event you're interested in, and click the 'Register Now' button. You'll need to create an account or log in if you haven't already. Follow the registration steps and complete the payment if required.",
            icon: Users,
        },
        {
            id: "cancellation",
            question: "Can I cancel my event registration?",
            answer: "Cancellation policies vary by event. Please check the specific event's cancellation policy before registering. Generally, you can cancel your registration through your dashboard. Refunds, if applicable, will be processed according to the event organizer's policy.",
            icon: X,
        },
        {
            id: "ticket",
            question: "How do I get my event ticket or confirmation?",
            answer: "After successful registration, you'll receive a confirmation email with your event details and a unique registration token. You can also access your tickets anytime from your dashboard. Make sure to bring your token or confirmation email to the event.",
            icon: FileText,
        },
        {
            id: "payment",
            question: "What payment methods do you accept?",
            answer: "We accept various payment methods including credit/debit cards, bank transfers, and digital wallets. The available payment options will be displayed during the checkout process. All payments are processed securely through our trusted payment partners.",
            icon: Lock,
        },
        {
            id: "attendance",
            question: "How do I mark my attendance at an event?",
            answer: "Once you're registered for an event, you'll receive a unique attendance token. At the event venue, you can use this token to mark your attendance through the 'Fill Attendance' button in your dashboard or by providing it to the event organizer.",
            icon: Eye,
        },
        {
            id: "transfer",
            question: "Can I transfer my registration to someone else?",
            answer: "Registration transfers depend on the event organizer's policy. Some events allow transfers while others don't. Please contact the event organizer directly through the event page or reach out to our support team for assistance.",
            icon: Users,
        },
        {
            id: "email",
            question: "I didn't receive my confirmation email. What should I do?",
            answer: "First, check your spam or junk folder. If you still can't find it, log in to your dashboard where you can view all your registered events and download your confirmation. If the issue persists, contact our support team at hello@ramein.com",
            icon: Mail,
        },
    ];

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
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

                {/* Header */}
                <div className="relative p-6 border-b border-border bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                    <HelpCircle className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                                        Frequently Asked Questions
                                    </h2>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Find answers to common questions
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full hover:bg-muted flex items-center justify-center transition-all hover:rotate-90 duration-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Content with Accordion */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)] scroll-smooth">
                    <Accordion type="single" collapsible className="space-y-3">
                        {faqData.map((faq, index) => (
                            <AccordionItem
                                key={faq.id}
                                value={faq.id}
                                className="border border-border rounded-2xl overflow-hidden bg-card hover:border-primary/30 transition-colors"
                            >
                                <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 transition-colors [&[data-state=open]]:bg-primary/5">
                                    <div className="flex items-center gap-3 text-left">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <faq.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <span className="font-semibold text-base text-foreground">{faq.question}</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-5 pb-4">
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="ml-13 pt-2 text-foreground/80 leading-relaxed"
                                    >
                                        {faq.answer}
                                    </motion.div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Contact CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <Mail className="w-5 h-5 text-primary" />
                            <h3 className="font-bold text-foreground">Still have questions?</h3>
                        </div>
                        <p className="text-sm text-foreground/70 mb-3">
                            Can't find the answer you're looking for? Our support team is here to help.
                        </p>
                        <a
                            href="mailto:hello@ramein.com"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                        >
                            Contact Support
                            <ChevronDown className="w-4 h-4 -rotate-90" />
                        </a>
                    </motion.div>
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
