"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  AlertCircle,
  Copy,
  RefreshCw,
  Home,
  Loader2,
  CreditCard,
  ArrowRight,
  Info,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  checkTransactionStatus,
  formatCurrency,
  getPaymentMethodLabel,
  type Transaction,
} from "@/lib/paymentApi";
import { toast } from "sonner";

function PaymentPendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

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

      // If status changed to paid, redirect to success
      if (data.paymentStatus === "paid") {
        router.push(`/payment/success?order_id=${orderId}`);
      }
    } catch (error) {
      console.error("Failed to load transaction:", error);
      toast.error("Gagal memuat detail transaksi");
    } finally {
      setLoading(false);
    }
  }, [orderId, router]);

  const updateTimeLeft = useCallback(() => {
    if (!transaction?.expiredAt) return;

    const now = new Date().getTime();
    const expiry = new Date(transaction.expiredAt).getTime();
    const distance = expiry - now;

    if (distance < 0) {
      setTimeLeft("Kadaluarsa");
      return;
    }

    const hours = Math.floor(distance / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setTimeLeft(
      `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
    );
  }, [transaction?.expiredAt]);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  useEffect(() => {
    if (transaction?.expiredAt) {
      const interval = setInterval(() => {
        updateTimeLeft();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [transaction?.expiredAt, updateTimeLeft]);

  const handleCheckStatus = async () => {
    if (!orderId) return;

    try {
      setChecking(true);
      const data = await checkTransactionStatus(orderId);
      setTransaction(data);

      if (data.paymentStatus === "paid") {
        toast.success("Pembayaran berhasil!");
        router.push(`/payment/success?order_id=${orderId}`);
      } else if (data.paymentStatus === "pending") {
        toast.info("Pembayaran masih menunggu konfirmasi");
      } else {
        toast.error(`Status pembayaran: ${data.paymentStatus}`);
      }
    } catch (error) {
      console.error("Failed to check status:", error);
      toast.error("Gagal memeriksa status pembayaran");
    } finally {
      setChecking(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} berhasil disalin!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mx-auto mb-4" />
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
              <AlertCircle className="w-8 h-8 text-red-600" />
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
    <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Pending Icon & Message */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
              <Clock className="w-14 h-14 text-yellow-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-yellow-100 animate-pulse"></div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-yellow-900">
            Menunggu Pembayaran
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Selesaikan pembayaran Anda sebelum waktu habis
          </p>

          {/* Timer */}
          {timeLeft && timeLeft !== "Kadaluarsa" && (
            <div className="inline-flex items-center gap-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg px-6 py-3 mb-4">
              <Clock className="w-5 h-5 text-yellow-700" />
              <div className="text-left">
                <p className="text-xs text-yellow-600 font-medium">
                  Selesaikan dalam
                </p>
                <p className="text-2xl font-bold text-yellow-900 font-mono">
                  {timeLeft}
                </p>
              </div>
            </div>
          )}

          {/* Order ID Badge */}
          <div className="inline-flex items-center gap-2 bg-white border rounded-full px-6 py-2">
            <span className="text-sm font-medium text-muted-foreground">
              Order ID:
            </span>
            <code className="font-mono text-sm font-bold">
              {transaction.orderId}
            </code>
            <button
              onClick={() => copyToClipboard(transaction.orderId, "Order ID")}
              className="text-primary hover:text-primary/80"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Payment Instructions */}
        {transaction.vaNumber && (
          <Card className="shadow-lg mb-6 border-2 border-yellow-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-yellow-600" />
                Informasi Pembayaran
              </h2>

              <div className="space-y-4">
                {/* Bank Name */}
                {transaction.bankName && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Bank
                    </label>
                    <p className="text-lg font-bold uppercase mt-1">
                      {transaction.bankName}
                    </p>
                  </div>
                )}

                {/* VA Number */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Nomor Virtual Account
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 bg-yellow-50 border-2 border-yellow-300 rounded-lg px-4 py-3 text-xl font-bold font-mono">
                      {transaction.vaNumber}
                    </code>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() =>
                        copyToClipboard(transaction.vaNumber!, "Nomor VA")
                      }
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Jumlah Pembayaran
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    <p className="flex-1 bg-yellow-50 border-2 border-yellow-300 rounded-lg px-4 py-3 text-2xl font-bold text-yellow-900">
                      {formatCurrency(transaction.totalAmount)}
                    </p>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() =>
                        copyToClipboard(
                          transaction.totalAmount.toString(),
                          "Jumlah",
                        )
                      }
                    >
                      <Copy className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Transfer sesuai nominal di atas agar otomatis terverifikasi
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Steps */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Cara Pembayaran
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">
                    Buka aplikasi mobile banking atau ATM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pilih menu transfer atau pembayaran
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Masukkan nomor Virtual Account</p>
                  <p className="text-sm text-muted-foreground">
                    Salin nomor VA di atas dan paste ke aplikasi
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Masukkan jumlah pembayaran</p>
                  <p className="text-sm text-muted-foreground">
                    Transfer sesuai nominal yang tertera di atas
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <p className="font-medium">
                    Konfirmasi dan selesaikan pembayaran
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Status akan otomatis terupdate setelah pembayaran berhasil
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Detail Transaksi</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Event</span>
                <span className="font-medium text-right">
                  {transaction.event?.title || "Event"}
                </span>
              </div>

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
                <span>Total</span>
                <span className="text-yellow-600">
                  {formatCurrency(transaction.totalAmount)}
                </span>
              </div>

              {transaction.paymentMethod && (
                <div className="flex justify-between text-sm pt-3 border-t">
                  <span className="text-muted-foreground">
                    Metode Pembayaran
                  </span>
                  <span className="font-medium">
                    {getPaymentMethodLabel(transaction.paymentMethod)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Waktu Pembuatan</span>
                <span className="font-medium">
                  {format(
                    new Date(transaction.createdAt),
                    "dd MMMM yyyy, HH:mm",
                    { locale: localeId },
                  )}
                </span>
              </div>

              {transaction.expiredAt && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Berlaku Hingga</span>
                  <span className="font-medium text-red-600">
                    {format(
                      new Date(transaction.expiredAt),
                      "dd MMMM yyyy, HH:mm",
                      { locale: localeId },
                    )}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="shadow-lg bg-blue-50 border-blue-200 mb-6">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-900">
                  Penting untuk diperhatikan:
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Transfer sesuai nominal agar otomatis terverifikasi</li>
                  <li>
                    Pembayaran akan otomatis dikonfirmasi dalam 5-10 menit
                  </li>
                  <li>Jangan tutup halaman ini sampai pembayaran selesai</li>
                  <li>Simpan bukti transfer untuk referensi</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleCheckStatus}
            disabled={checking}
            size="lg"
            className="w-full"
          >
            {checking ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Memeriksa...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Cek Status Pembayaran
              </>
            )}
          </Button>

          <Button
            onClick={() => router.push("/profile?tab=transactions")}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Lihat Transaksi Saya
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Back to Home */}
        <div className="text-center">
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

export default function PaymentPendingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-yellow-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat...</p>
          </div>
        </div>
      }
    >
      <PaymentPendingContent />
    </Suspense>
  );
}
