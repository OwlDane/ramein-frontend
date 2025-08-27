import { motion } from 'framer-motion'
import { Sparkles, Mail, Phone, MapPin, Facebook, Twitter, Instagram, ExternalLink } from 'lucide-react'

export function Footer() {
    const footerLinks = {
        company: [
            { name: 'Tentang Kami', href: '#' },
            { name: 'Tim Kami', href: '#' },
            { name: 'Karir', href: '#' },
            { name: 'Press Kit', href: '#' }
        ],
        services: [
            { name: 'Event Planning', href: '#' },
            { name: 'Corporate Events', href: '#' },
            { name: 'Workshops', href: '#' },
            { name: 'Conferences', href: '#' }
        ],
        support: [
            { name: 'FAQ', href: '#' },
            { name: 'Help Center', href: '#' },
            { name: 'Kontak Support', href: '#' },
            { name: 'Community', href: '#' }
        ],
        legal: [
            { name: 'Privacy Policy', href: '#' },
            { name: 'Terms of Service', href: '#' },
            { name: 'Cookie Policy', href: '#' },
            { name: 'GDPR', href: '#' }
        ]
    }

    const socialLinks = [
        { icon: Facebook, href: '#', name: 'Facebook' },
        { icon: Twitter, href: '#', name: 'Twitter' },
        { icon: Instagram, href: '#', name: 'Instagram' },
        { icon: Linkedin, href: '#', name: 'LinkedIn' }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }

    return (
        <footer className="bg-primary text-primary-foreground overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <motion.div
                    className="absolute inset-0"
                    animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
                    transition={{ duration: 20, repeat: Infinity, repeatType: 'reverse' }}
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            <div className="container mx-auto px-4 py-16 relative">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid lg:grid-cols-5 gap-12"
                >
                    {/* Brand Section */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <motion.div
                            className="flex items-center gap-3 mb-6"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                        >
                            <motion.div
                                className="w-12 h-12 bg-primary-foreground/20 rounded-xl flex items-center justify-center"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                                <Sparkles className="w-7 h-7 text-primary-foreground" />
                            </motion.div>
                            <div>
                                <h3 className="text-3xl font-bold tracking-tight">Ramein</h3>
                                <p className="text-primary-foreground/60 text-sm">Event Platform</p>
                            </div>
                        </motion.div>

                        <p className="text-primary-foreground/80 text-lg leading-relaxed mb-6 max-w-md">
                            Platform event terpercaya yang menghubungkan peserta dengan pengalaman berkualitas tinggi.
                            Temukan, daftar, dan nikmati event terbaik bersama kami.
                        </p>

                        {/* Kontak */}
                        <div className="space-y-3 mb-6">
                            <motion.div className="flex items-center gap-3 text-primary-foreground/70" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <Mail className="w-5 h-5" />
                                <span>hello@ramein.com</span>
                            </motion.div>
                            <motion.div className="flex items-center gap-3 text-primary-foreground/70" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <Phone className="w-5 h-5" />
                                <span>+62 21 1234 5678</span>
                            </motion.div>
                            <motion.div className="flex items-center gap-3 text-primary-foreground/70" whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                <MapPin className="w-5 h-5" />
                                <span>Jakarta, Indonesia</span>
                            </motion.div>
                        </div>

                        {/* Sosial */}
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    className="w-10 h-10 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-colors"
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                >
                                    <social.icon className="w-5 h-5 text-primary-foreground" />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Sections */}
                    {['company', 'services', 'support'].map((section) => (
                        <motion.div key={section} variants={itemVariants}>
                            <h4 className="text-xl font-medium mb-6 text-primary-foreground">
                                {section === 'company' ? 'Perusahaan' :
                                    section === 'services' ? 'Layanan' : 'Support'}
                            </h4>
                            <ul className="space-y-3">
                                {footerLinks[section as keyof typeof footerLinks].map((link) => (
                                    <motion.li key={link.name} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                                        <a
                                            href={link.href}
                                            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-base"
                                        >
                                            {link.name}
                                        </a>
                                    </motion.li>
                                ))}
                            </ul>
                            {section === 'support' && (
                                <motion.div
                                    className="bg-primary-foreground/10 backdrop-blur-sm rounded-lg p-4 border border-primary-foreground/20 mt-8"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <h5 className="text-lg font-medium mb-2 text-primary-foreground">Newsletter</h5>
                                    <p className="text-primary-foreground/70 text-sm mb-3">Dapatkan update event terbaru</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="Email Anda"
                                            className="flex-1 px-3 py-2 bg-primary-foreground/10 border border-primary-foreground/30 rounded-md text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:border-primary-foreground/60"
                                        />
                                        <motion.button
                                            className="px-4 py-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 rounded-md transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <ExternalLink className="w-4 h-4 text-primary-foreground" />
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>

                {/* Footer Bottom */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="border-t border-primary-foreground/20 mt-16 pt-8"
                >
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <motion.div className="flex flex-wrap items-center gap-6 text-primary-foreground/60 text-base">
                            {footerLinks.legal.map((link) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    className="hover:text-primary-foreground transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </motion.div>
                        <motion.div className="text-primary-foreground/60 text-base">
                            © 2025 Ramein. Made in Indonesia
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </footer>
    )
}
