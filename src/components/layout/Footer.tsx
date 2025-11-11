import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { FAQModal, PrivacyModal, TermsModal } from "@/components/modals";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showFaq, setShowFaq] = useState(false);

  // Prevent body scroll saat modal open
  useEffect(() => {
    if (showPrivacy || showTerms || showFaq) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showPrivacy, showTerms, showFaq]);

  const footerLinks = {
    product: [
      { name: "Events", href: "/events", type: "link" },
      { name: "FAQ", onClick: () => setShowFaq(true), type: "button" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Articles", href: "/articles" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      {
        name: "Privacy Policy",
        onClick: () => setShowPrivacy(true),
        type: "button",
      },
      {
        name: "Terms of Service",
        onClick: () => setShowTerms(true),
        type: "button",
      },
      { name: "Customer Service", href: "/customer-service", type: "link" },
    ],
  };

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
  ];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-screen-2xl mx-auto">
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

            {/* Product Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Product
              </h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    {link.type === "link" && link.href ? (
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm py-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={link.onClick}
                        className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm text-left py-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Company
              </h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm py-1"
                    >
                      <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                      <span className="group-hover:translate-x-1 transition-transform">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
                Legal
              </h3>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    {link.type === "link" && link.href ? (
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm py-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
                      </Link>
                    ) : (
                      <button
                        onClick={link.onClick}
                        className="group inline-flex items-center gap-2 text-background/70 hover:text-background transition-all text-sm text-left py-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-background/40 group-hover:bg-background group-hover:w-2 transition-all" />
                        <span className="group-hover:translate-x-1 transition-transform">
                          {link.name}
                        </span>
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
              <p className="text-sm text-background/60">
                © {currentYear} Ramein. All rights reserved.
              </p>

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

      {/* Modals */}
      <AnimatePresence mode="wait">
        {showPrivacy && (
          <PrivacyModal key="privacy-modal" isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
        )}
        {showTerms && (
          <TermsModal key="terms-modal" isOpen={showTerms} onClose={() => setShowTerms(false)} />
        )}
        {showFaq && (
          <FAQModal key="faq-modal" isOpen={showFaq} onClose={() => setShowFaq(false)} />
        )}
      </AnimatePresence>
    </footer>
  );
}