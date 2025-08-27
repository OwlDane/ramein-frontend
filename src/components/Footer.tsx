import { motion } from 'framer-motion'
import { Sparkles, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, ExternalLink } from 'lucide-react'

const XIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-.88-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
    </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
)

const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.525 3.488"/>
    </svg>
)

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

    // Updated social links with modern platforms
    const socialLinks = [
        { icon: Instagram, href: '#', name: 'Instagram', color: 'hover:text-pink-400' },
        { icon: XIcon, href: '#', name: 'X (Twitter)', color: 'hover:text-blue-400' },
        { icon: TikTokIcon, href: '#', name: 'TikTok', color: 'hover:text-red-400' },
        { icon: YouTubeIcon, href: '#', name: 'YouTube', color: 'hover:text-red-500' },
        { icon: Linkedin, href: '#', name: 'LinkedIn', color: 'hover:text-blue-500' },
        { icon: WhatsAppIcon, href: '#', name: 'WhatsApp', color: 'hover:text-green-400' },
        { icon: Facebook, href: '#', name: 'Facebook', color: 'hover:text-blue-600' }
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
                ease: "easeOut" as const
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

                        {/* Updated Social Media Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    className={`w-12 h-12 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-lg flex items-center justify-center transition-all duration-300 ${social.color} group`}
                                    whileHover={{ scale: 1.1, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 + 0.5 }}
                                    title={social.name}
                                >
                                    <social.icon className="w-5 h-5 text-primary-foreground group-hover:scale-110 transition-transform" />
                                </motion.a>
                            ))}
                        </div>

                        {/* Social Media Labels */}
                        <div className="text-xs text-primary-foreground/50 mt-2">
                            Instagram • X • TikTok • YouTube • LinkedIn • WhatsApp • Facebook
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