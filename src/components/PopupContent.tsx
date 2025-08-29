import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PopupContentProps {
    type: 'about' | 'contact' | 'faq' | 'privacy' | 'terms';
    isOpen: boolean;
    onClose: () => void;
}

export function PopupContent({ type, isOpen, onClose }: PopupContentProps) {
    const content = {
        about: {
            title: 'Tentang Kami',
            content: (
                <div className="space-y-4 text-sm">
                    <p>
                        Ramein adalah platform event terdepan yang menghubungkan peserta dengan pengalaman berkualitas tinggi. 
                        Kami berkomitmen untuk memberikan layanan terbaik dalam mengelola dan menyelenggarakan berbagai jenis event.
                    </p>
                    <p>
                        Didirikan dengan visi untuk memudahkan akses ke berbagai event menarik, Ramein telah menjadi pilihan utama 
                        bagi ribuan peserta dan penyelenggara event di seluruh Indonesia.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="text-center p-3 bg-accent/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">1000+</div>
                            <div className="text-xs text-muted-foreground">Event Terselenggara</div>
                        </div>
                        <div className="text-center p-3 bg-accent/50 rounded-lg">
                            <div className="text-2xl font-bold text-primary">50K+</div>
                            <div className="text-xs text-muted-foreground">Peserta Puas</div>
                        </div>
                    </div>
                </div>
            )
        },
        contact: {
            title: 'Hubungi Kami',
            content: (
                <div className="space-y-4 text-sm">
                    <p>
                        Kami siap membantu Anda dengan pertanyaan, saran, atau kerjasama. 
                        Jangan ragu untuk menghubungi tim kami yang ramah dan profesional.
                    </p>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                📧
                            </div>
                            <div>
                                <div className="font-medium">Email</div>
                                <div className="text-muted-foreground text-xs">hello@ramein.com</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                📞
                            </div>
                            <div>
                                <div className="font-medium">Telepon</div>
                                <div className="text-muted-foreground text-xs">+62 21 1234 5678</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                                📍
                            </div>
                            <div>
                                <div className="font-medium">Alamat</div>
                                <div className="text-muted-foreground text-xs">Jakarta, Indonesia</div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        faq: {
            title: 'FAQ - Pertanyaan Umum',
            content: (
                <div className="space-y-4 text-sm">
                    <div className="space-y-3">
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Bagaimana cara mendaftar event?</div>
                            <div className="text-muted-foreground text-xs">
                                Anda dapat mendaftar event dengan membuat akun terlebih dahulu, kemudian pilih event yang diinginkan dan ikuti proses pendaftaran yang tersedia.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Apakah ada biaya pendaftaran?</div>
                            <div className="text-muted-foreground text-xs">
                                Biaya pendaftaran bervariasi tergantung pada jenis event. Beberapa event gratis, sementara yang lain memerlukan biaya pendaftaran.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Bagaimana jika event dibatalkan?</div>
                            <div className="text-muted-foreground text-xs">
                                Jika event dibatalkan, kami akan memberikan notifikasi dan pengembalian dana sesuai dengan kebijakan yang berlaku.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Apakah saya bisa membatalkan pendaftaran?</div>
                            <div className="text-muted-foreground text-xs">
                                Ya, Anda dapat membatalkan pendaftaran sesuai dengan syarat dan ketentuan yang berlaku untuk setiap event.
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        privacy: {
            title: 'Kebijakan Privasi',
            content: (
                <div className="space-y-4 text-sm">
                    <p>
                        Kebijakan Privasi ini menjelaskan bagaimana Ramein mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.
                    </p>
                    <div className="space-y-3">
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Informasi yang Kami Kumpulkan</div>
                            <div className="text-muted-foreground text-xs">
                                Kami mengumpulkan informasi seperti nama, email, nomor telepon, dan data lain yang diperlukan untuk layanan kami.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Penggunaan Informasi</div>
                            <div className="text-muted-foreground text-xs">
                                Informasi Anda digunakan untuk menyediakan layanan, komunikasi, dan peningkatan pengalaman pengguna.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Keamanan Data</div>
                            <div className="text-muted-foreground text-xs">
                                Kami menerapkan standar keamanan tinggi untuk melindungi informasi pribadi Anda dari akses yang tidak sah.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Hak Anda</div>
                            <div className="text-muted-foreground text-xs">
                                Anda memiliki hak untuk mengakses, memperbarui, atau menghapus informasi pribadi Anda sesuai dengan hukum yang berlaku.
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        terms: {
            title: 'Ketentuan Layanan',
            content: (
                <div className="space-y-4 text-sm">
                    <p>
                        Ketentuan Layanan ini mengatur penggunaan platform Ramein dan layanan yang kami sediakan.
                    </p>
                    <div className="space-y-3">
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Penggunaan Platform</div>
                            <div className="text-muted-foreground text-xs">
                                Pengguna harus menggunakan platform sesuai dengan ketentuan yang berlaku dan tidak melakukan aktivitas yang merugikan.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Tanggung Jawab</div>
                            <div className="text-muted-foreground text-xs">
                                Ramein bertanggung jawab atas layanan yang disediakan, namun tidak bertanggung jawab atas tindakan pihak ketiga.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Pembayaran dan Pengembalian</div>
                            <div className="text-muted-foreground text-xs">
                                Pembayaran dilakukan sesuai dengan harga yang ditentukan. Pengembalian dana mengikuti kebijakan yang berlaku.
                            </div>
                        </div>
                        <div className="p-3 bg-accent/50 rounded-lg">
                            <div className="font-medium mb-2">Perubahan Ketentuan</div>
                            <div className="text-muted-foreground text-xs">
                                Kami berhak mengubah ketentuan ini sewaktu-waktu dengan pemberitahuan terlebih dahulu kepada pengguna.
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    };

    const currentContent = content[type];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-foreground">
                        {currentContent.title}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {currentContent.content}
                </div>
            </DialogContent>
        </Dialog>
    );
}
