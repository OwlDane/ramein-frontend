"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Download,
  Home,
  Loader2,
  Share2,
  Award,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  checkTransactionStatus,
  formatCurrency,
  type Transaction,
} from "@/lib/paymentApi";
import { toast } from "sonner";
import confetti from "canvas-confetti";

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const triggerConfetti = useCallback(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#22c55e", "#10b981", "#059669"],
      });

      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#22c55e", "#10b981", "#059669"],
      });
    }, 250);
  }, []);

  const loadTransaction = useCallback(async () => {
    if (!orderId) {
      toast.error("Order ID tidak ditemukan");
      router.push("/");
      return;
    }

    try {
      setLoading(true);
      const data = await checkTransactionStatus(orderId);
      setTransaction(data);
    } catch (error) {
      console.error("Failed to load transaction:", error);
      toast.error("Gagal memuat detail transaksi");
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  useEffect(() => {
    loadTransaction();
    triggerConfetti();
  }, [loadTransaction, triggerConfetti]);

  const handleShare = () => {
    if (navigator.share && transaction?.event) {
      navigator
        .share({
          title: "Saya mendaftar event!",
          text: `Saya telah mendaftar ${transaction.event.title}`,
          url: window.location.origin,
        })
        .catch(() => {});
    } else {
      toast.info("Share tidak tersedia di browser ini");
    }
  };

  const handleDownloadReceipt = () => {
    toast.info("Fitur download receipt akan segera hadir");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat detail transaksi...</p>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Transaksi Tidak Ditemukan
            </h2>
            <p className="text-muted-foreground mb-6">
              Transaksi dengan order ID tersebut tidak ditemukan
            </p>
            <Button onClick={() => router.push("/")}>
              <Home className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Success Icon & Message */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="w-14 h-14 text-green-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-green-100 animate-ping opacity-75"></div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-green-900">
            Pembayaran Berhasil!
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {transaction.amount === 0
              ? "Pendaftaran Anda telah berhasil"
              : "Terima kasih atas pembayaran Anda"}
          </p>

          {/* Order ID Badge */}
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-2">
            <span className="text-sm font-medium text-green-700">
              Order ID:
            </span>
            <code className="font-mono text-sm font-bold text-green-900">
              {transaction.orderId}
            </code>
          </div>
        </div>

        {/* Transaction Details */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Detail Event
            </h2>

            <div className="space-y-4">
              {/* Event Name */}
              <div>
                <h3 className="text-2xl font-bold mb-2">
                  {transaction.event?.title || "Event"}
                </h3>
                <Badge variant="secondary" className="mb-4">
                  Terdaftar
                </Badge>
              </div>

              {/* Event Info */}
              {transaction.event && (
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-5 h-5 flex-shrink-0" />
                    <span>Tanggal event akan muncul di detail</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <span>Waktu event akan muncul di detail</span>
                  </div>
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Lokasi event akan muncul di detail</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Ringkasan Pembayaran</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Harga Event</span>
                <span className="font-medium">
                  {formatCurrency(transaction.amount)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Biaya Admin</span>
                <span className="font-medium">
                  {formatCurrency(transaction.adminFee)}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t font-bold text-lg">
                <span>Total Dibayar</span>
                <span className="text-green-600">
                  {formatCurrency(transaction.totalAmount)}
                </span>
              </div>

              {transaction.paidAt && (
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Dibayar Pada</span>
                    <span className="font-medium text-green-600">
                      {format(
                        new Date(transaction.paidAt),
                        "dd MMMM yyyy, HH:mm",
                        {
                          locale: localeId,
                        },
                      )}
                    </span>
                  </div>
                </div>
              )}

              {transaction.paymentMethod && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Metode Pembayaran
                  </span>
                  <span className="font-medium capitalize">
                    {transaction.paymentMethod.replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-white border-blue-200 mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Langkah Selanjutnya
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">
                    Pembayaran berhasil diproses
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Selesaikan pendaftaran untuk mendapatkan token kehadiran
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Simpan order ID untuk referensi</p>
                  <p className="text-sm text-muted-foreground">
                    Order ID: {transaction?.orderId}
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">
                    E-Ticket akan dikirim setelah pendaftaran
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Anda akan menerima token kehadiran via email
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Button
            variant="outline"
            onClick={handleDownloadReceipt}
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>

          <Button variant="outline" onClick={handleShare} className="w-full">
            <Share2 className="w-4 h-4 mr-2" />
            Bagikan
          </Button>

          <Button
            onClick={() => router.push("/profile")}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Lihat Event Saya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Complete Registration Button */}
        {transaction && transaction.event && (
          <Card className="shadow-lg bg-gradient-to-br from-green-50 to-white border-green-200 mb-6">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-3 text-green-800">
                Selesaikan Pendaftaran Anda
              </h3>
              <p className="text-sm text-green-700 mb-4">
                Pembayaran berhasil! Klik tombol di bawah untuk menyelesaikan pendaftaran dan mendapatkan token kehadiran.
              </p>
              <Button
                onClick={() => router.push(`/events/${transaction.event?.id}`)}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Selesaikan Pendaftaran
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="text-muted-foreground"
          >
            <Home className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat...</p>
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
