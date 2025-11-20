import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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

  const topNavLinks = [
    { name: "Beranda", href: "/" },
    { name: "Kegiatan", href: "/events" },
    { name: "Contact", href: "/contact" },
    { name: "Artikel", href: "/articles" },
  ];

  const quickLinks = [
    { name: "Beranda", href: "/" },
    { name: "Event", href: "/events" },
    { name: "Galeri", href: "/galeri" },
    { name: "Artikel", href: "/articles" },
  ];

  const socialLinks = [
    { name: "Facebook", icon: "/icons/facebook.png", href: "#" },
    { name: "Instagram", icon: "/icons/instagram.png", href: "#" },
    { name: "TikTok", icon: "/icons/tik-tok.png", href: "#" },
    { name: "Twitter", icon: "/icons/twitter.png", href: "#" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="block lg:hidden py-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Logo & Brand */}
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Image
                  src="/logo.png"
                  alt="Ramein Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
                <h2 className="text-xl font-bold text-green-600">RAMEIN</h2>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                Sistem Informasi Manajemen<br />Kegiatan Akademik Sekolah
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
                RAMEIN membantu pengelolaan kegiatan secara terintegrasi, mulai dari pembuatan acara, pendaftaran peserta, verifikasi kehadiran, hingga distribusi sertifikat secara digital.
              </p>
            </div>

            {/* Navigation Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {quickLinks.map((link, index) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    index === 0 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Two Column Layout for Address & Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 text-left">
              {/* Address */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Alamat</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Jl. Pendidikan No. 12, Jakarta, Indonesia
                </p>
                
                <h4 className="font-bold text-gray-900 mb-3">Hubungi Kami</h4>
                <a
                  href="mailto:ramein@esis@gmail.com"
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  ramein@esis@gmail.com
                </a>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3">Fitur Utama</h4>
                <p className="text-sm text-gray-600">
                  Manajemen Kegiatan, Pendaftaran Peserta, Presensi Digital, & Distribusi Sertifikat.
                </p>
                
                <h4 className="font-bold text-gray-900 mb-3 mt-4">Ikuti Kami</h4>
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      aria-label={social.name}
                      className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
                    >
                      <Image
                        src={social.icon}
                        alt={social.name}
                        width={16}
                        height={16}
                        className="w-4 h-4 brightness-0 invert"
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-center pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                © {currentYear} RAMEIN. Seluruh hak cipta dilindungi.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <Link href="/" className="flex items-center gap-2 mb-2">
                <Image
                  src="/logo.png"
                  alt="Ramein Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
                <h2 className="text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer text-gray-900">
                  Ramein
                </h2>
              </Link>
              <p className="text-sm font-semibold text-green-600 mb-3">
                Sistem Informasi Manajemen Kegiatan
              </p>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed max-w-lg">
                RAMEIN membantu pengelolaan kegiatan secara terintegrasi, mulai dari pembuatan acara, pendaftaran peserta, verifikasi kehadiran, hingga distribusi sertifikat secara digital.
              </p>
              <p className="text-xs text-gray-500">
                © {currentYear} RAMEIN. Seluruh hak cipta dilindungi.
              </p>
            </motion.div>

            {/* Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h3 className="text-sm font-bold text-gray-900 mb-3">Alamat</h3>
              <div className="flex items-start gap-2 mb-4">
                <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Jl. Merdeka Jaya, Bogor, Indonesia
                </p>
              </div>
              
              <h3 className="text-sm font-bold text-gray-900 mb-3">Hubungi Kami</h3>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600 flex-shrink-0" />
                <a
                  href="mailto:ramein@esis@gmail.com"
                  className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                >
                  ramein@halo.com
                </a>
              </div>
            </motion.div>

            {/* Quick Links & Social Media */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="text-sm font-bold text-gray-900 mb-3">Tautan Cepat</h3>
              <ul className="space-y-2 text-sm text-gray-600 mb-6">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="hover:text-green-600 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
              
              <h3 className="text-sm font-bold text-gray-900 mb-3">Ikuti Kami</h3>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    aria-label={social.name}
                    className="hover:opacity-80 transition-opacity duration-300"
                  >
                    <Image
                      src={social.icon}
                      alt={social.name}
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
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