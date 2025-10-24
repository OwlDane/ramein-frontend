"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  XCircle,
  AlertTriangle,
  Home,
  Loader2,
  RefreshCw,
  ArrowLeft,
  Info,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  getTransactionByOrderId,
  formatCurrency,
  type Transaction,
} from "@/lib/paymentApi";

function PaymentErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  const loadTransaction = useCallback(async () => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getTransactionByOrderId(orderId);
      setTransaction(data);
    } catch (error) {
      console.error("Failed to load transaction:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  const handleRetry = () => {
    if (transaction?.eventId) {
      router.push(`/payment/summary?eventId=${transaction.eventId}`);
    } else {
      router.push("/");
    }
  };

  const getErrorMessage = () => {
    if (!transaction) {
      return "Transaksi gagal diproses. Silakan coba lagi.";
    }

    if (transaction.failureReason) {
      return transaction.failureReason;
    }

    switch (transaction.paymentStatus) {
      case "failed":
        return "Pembayaran gagal diproses. Silakan periksa detail pembayaran Anda dan coba lagi.";
      case "expired":
        return "Waktu pembayaran telah habis. Silakan buat transaksi baru.";
      case "cancelled":
        return "Transaksi telah dibatalkan.";
      default:
        return "Terjadi kesalahan pada proses pembayaran.";
    }
  };

  const getErrorTitle = () => {
    if (!transaction) return "Pembayaran Gagal";

    switch (transaction.paymentStatus) {
      case "failed":
        return "Pembayaran Gagal";
      case "expired":
        return "Pembayaran Kadaluarsa";
      case "cancelled":
        return "Pembayaran Dibatalkan";
      default:
        return "Pembayaran Bermasalah";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat detail transaksi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Error Icon & Message */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <XCircle className="w-14 h-14 text-red-600" />
            </div>
            <div className="absolute inset-0 w-24 h-24 rounded-full bg-red-100 animate-pulse"></div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-red-900">
            {getErrorTitle()}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 max-w-md mx-auto">
            {getErrorMessage()}
          </p>

          {/* Order ID Badge */}
          {orderId && (
            <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-6 py-2">
              <span className="text-sm font-medium text-red-700">
                Order ID:
              </span>
              <code className="font-mono text-sm font-bold text-red-900">
                {orderId}
              </code>
            </div>
          )}
        </div>

        {/* Transaction Details (if available) */}
        {transaction && (
          <Card className="shadow-lg mb-6 border-red-200">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detail Transaksi</h2>

              <div className="space-y-3">
                {transaction.event && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event</span>
                    <span className="font-medium text-right">
                      {transaction.event.title}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Total Pembayaran
                  </span>
                  <span className="font-bold text-lg">
                    {formatCurrency(transaction.totalAmount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant="outline"
                    className="bg-red-100 text-red-700 border-red-200"
                  >
                    {transaction.paymentStatus.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex justify-between text-sm pt-3 border-t">
                  <span className="text-muted-foreground">Waktu Pembuatan</span>
                  <span className="font-medium">
                    {format(
                      new Date(transaction.createdAt),
                      "dd MMMM yyyy, HH:mm",
                      { locale: localeId },
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Common Error Reasons */}
        <Card className="shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Kemungkinan Penyebab
            </h2>

            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Saldo tidak mencukupi</p>
                  <p className="text-sm text-muted-foreground">
                    Pastikan saldo di kartu atau rekening Anda mencukupi
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Detail pembayaran tidak valid</p>
                  <p className="text-sm text-muted-foreground">
                    Periksa kembali nomor kartu, CVV, atau tanggal kadaluarsa
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Transaksi ditolak oleh bank</p>
                  <p className="text-sm text-muted-foreground">
                    Hubungi bank Anda untuk mengaktifkan transaksi online
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Koneksi internet terputus</p>
                  <p className="text-sm text-muted-foreground">
                    Pastikan koneksi internet Anda stabil saat melakukan
                    pembayaran
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Waktu pembayaran habis</p>
                  <p className="text-sm text-muted-foreground">
                    Transaksi kadaluarsa setelah 24 jam, silakan buat transaksi
                    baru
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="shadow-lg bg-blue-50 border-blue-200 mb-6">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Butuh Bantuan?
            </h2>

            <div className="space-y-3">
              <p className="text-sm text-blue-900">
                Jika masalah terus berlanjut, Anda dapat:
              </p>

              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>
                    Hubungi customer service kami di WhatsApp: 08123456789
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Email: support@ramein.com</span>
                </li>
                <li className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  <span>Lihat halaman FAQ untuk solusi umum</span>
                </li>
              </ul>

              <Button
                variant="outline"
                className="w-full mt-4 bg-white"
                onClick={() => router.push("/customer-service")}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Hubungi Customer Service
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <Button
            onClick={handleRetry}
            size="lg"
            className="w-full bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Coba Lagi
          </Button>

          <Button
            onClick={() => router.push("/profile?tab=transactions")}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Lihat Transaksi Saya
          </Button>
        </div>

        {/* Back to Home */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>

          <div>
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
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-red-600 mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat...</p>
          </div>
        </div>
      }
    >
      <PaymentErrorContent />
    </Suspense>
  );
}
