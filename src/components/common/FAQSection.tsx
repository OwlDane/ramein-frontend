import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FAQItem[] = [
        {
            question: "Apa itu RAMEIN?",
            answer: "RAMEIN adalah Sistem Informasi Manajemen Kegiatan Akademik Sekolah yang dirancang untuk mempermudah pengelolaan event secara digital. Platform ini memungkinkan penyelenggara mengatur event, memverifikasi peserta, mengelola sertifikat, dan menghasilkan laporan dengan cepat dan aman."
        },
        {
            question: "Bagaimana cara mendaftar event di RAMEIN?",
            answer: "Untuk mendaftar event, Anda perlu membuat akun terlebih dahulu, lalu pilih event yang diinginkan dari halaman Event. Klik 'Daftar Sekarang', lengkapi formulir pendaftaran, dan lakukan pembayaran jika diperlukan. Anda akan menerima konfirmasi pendaftaran melalui email."
        },
        {
            question: "Apakah saya akan mendapat sertifikat setelah mengikuti event?",
            answer: "Ya! RAMEIN memiliki sistem sertifikat otomatis. Setelah Anda menyelesaikan event dengan tingkat kehadiran yang memenuhi syarat, sertifikat digital akan diterbitkan secara otomatis. Sertifikat dapat diunduh melalui dashboard Anda dan dilengkapi dengan QR code untuk verifikasi."
        },
        {
            question: "Bagaimana sistem pembayaran di RAMEIN?",
            answer: "RAMEIN terintegrasi dengan sistem pembayaran yang aman. Anda dapat melakukan pembayaran untuk event berbayar melalui berbagai metode pembayaran yang tersedia. Semua transaksi tercatat dengan aman dan Anda akan menerima bukti pembayaran."
        },
        {
            question: "Bisakah saya membatalkan pendaftaran event?",
            answer: "Ya, Anda dapat membatalkan pendaftaran event sesuai dengan kebijakan yang berlaku. Pembatalan dapat dilakukan melalui dashboard Anda. Untuk event berbayar, kebijakan pengembalian dana akan mengikuti aturan yang telah ditetapkan oleh penyelenggara."
        },
        {
            question: "Bagaimana cara mengakses event online?",
            answer: "Untuk event online, Anda akan menerima link meeting melalui email konfirmasi atau dapat mengaksesnya melalui dashboard RAMEIN. Pastikan Anda login ke akun RAMEIN sebelum waktu event dimulai untuk mendapatkan akses yang lancar."
        },
        {
            question: "Apakah ada aplikasi mobile untuk RAMEIN?",
            answer: "RAMEIN adalah Progressive Web App (PWA) yang dapat diinstal di perangkat mobile Anda seperti aplikasi native. Anda dapat mengakses semua fitur RAMEIN melalui browser mobile atau menginstalnya untuk pengalaman yang lebih baik."
        },
        {
            question: "Bagaimana cara menghubungi support jika ada masalah?",
            answer: "Jika Anda mengalami kendala, Anda dapat menghubungi tim support RAMEIN melalui form kontak di website, email, atau melalui informasi kontak yang tersedia di setiap event. Tim kami siap membantu menyelesaikan masalah Anda."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <HelpCircle className="w-8 h-8 text-green-600" />
                        <h2 className="text-3xl font-bold text-gray-900">
                            Frequently Asked Questions
                        </h2>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Temukan jawaban untuk pertanyaan yang sering diajukan tentang platform RAMEIN
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="mb-4"
                        >
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => toggleFAQ(index)}
                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <span className="font-medium text-gray-900 pr-4">
                                        {faq.question}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openIndex === index ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex-shrink-0"
                                    >
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    </motion.div>
                                </button>
                                
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: openIndex === index ? "auto" : 0,
                                        opacity: openIndex === index ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-6 pb-4 pt-2">
                                        <p className="text-gray-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
