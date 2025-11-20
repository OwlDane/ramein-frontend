"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Shield,
  AlertCircle,
  ArrowLeft,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  getPaymentSummary,
  createTransaction,
  formatCurrency,
  type PaymentSummary,
} from "@/lib/paymentApi";
import { toast } from "sonner";

// Xendit uses direct invoice URLs, no need for Snap popup

function PaymentSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const loadSummary = useCallback(async () => {
    if (!eventId) {
      toast.error("Event ID tidak ditemukan");
      router.push("/");
      return;
    }

    try {
      setLoading(true);
      const data = await getPaymentSummary(eventId);
      setSummary(data);
    } catch (error) {
      console.error("Failed to load summary:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal memuat data pembayaran",
      );
      router.push("/");
    } finally {
      setLoading(false);
    }
  }, [eventId, router]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handlePayment = async () => {
    if (!summary || !eventId) return;

    try {
      setProcessing(true);

      const transaction = await createTransaction(eventId);

      // If free event, redirect to success immediately
      if (transaction.paymentStatus === "paid") {
        toast.success("Pendaftaran berhasil!");
        router.push(`/payment/success?order_id=${transaction.orderId}`);
        return;
      }

      // For paid events, Xendit will redirect automatically via invoiceUrl
      // The createTransaction function handles the redirect
      // This code is just a fallback
      if (transaction.invoiceUrl) {
        toast.info("Mengarahkan ke halaman pembayaran...");
        window.location.href = transaction.invoiceUrl;
      } else {
        throw new Error("Invoice URL tidak tersedia");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error instanceof Error ? error.message : "Gagal memproses pembayaran",
      );
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Konfirmasi Pembayaran</h1>
            <p className="text-muted-foreground">
              Periksa kembali detail pesanan Anda sebelum melanjutkan
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Event & User Details */}
            <div className="space-y-6">
              {/* Event Information */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-gray-800">Detail Event</h2>
                  </div>

                  <div className="space-y-4">
                    {/* Event Title */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <h3 className="text-2xl font-bold mb-3 text-gray-900">
                        {summary.event.title}
                      </h3>
                      {summary.event.category && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                          {summary.event.category}
                        </Badge>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Tanggal</p>
                            <p className="font-semibold text-gray-900">
                              {format(
                                parseISO(summary.event.date),
                                "EEEE, dd MMMM yyyy",
                                {
                                  locale: localeId,
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Clock className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Waktu</p>
                            <p className="font-semibold text-gray-900">{summary.event.time} WIB</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Lokasi</p>
                            <p className="font-semibold text-gray-900">{summary.event.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Information */}
              <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
                    <h2 className="text-lg font-semibold text-gray-800">Informasi Peserta</h2>
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                          <p className="font-semibold text-gray-900">{summary.user.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p className="font-semibold text-gray-900">{summary.user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                          <Phone className="w-5 h-5 text-teal-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">No. Handphone</p>
                          <p className="font-semibold text-gray-900">{summary.user.phone || 'Tidak tersedia'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Right Column - Price Summary */}
            <div>
              <div className="sticky top-6 space-y-6">
                <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50 to-white">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
                      <h2 className="text-xl font-bold text-gray-800">Ringkasan Pembayaran</h2>
                    </div>

                    <div className="space-y-4">
                      {/* Price Breakdown */}
                      <div className="space-y-4 pb-4 border-b">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-muted-foreground">Harga Event</span>
                          </div>
                          <span className="font-medium text-lg">
                            {formatCurrency(summary.pricing.amount)}
                          </span>
                        </div>

                        {!summary.pricing.isFree && (
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-muted-foreground">Biaya Admin</span>
                              <div className="text-xs text-muted-foreground/70">
                                1.5% dari harga ticket
                              </div>
                            </div>
                            <span className="font-medium text-lg">
                              {formatCurrency(summary.pricing.adminFee)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Total */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-green-800">Total</span>
                          <span className="text-3xl font-bold text-green-600">
                            {formatCurrency(summary.pricing.totalAmount)}
                          </span>
                        </div>
                        {!summary.pricing.isFree && (
                          <div className="text-xs text-green-700 mt-1">
                            Sudah termasuk biaya admin 1.5%
                          </div>
                        )}
                      </div>

                      {/* Free Event Notice */}
                      {summary.pricing.isFree && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-green-700">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-medium">Event Gratis!</span>
                          </div>
                        </div>
                      )}

                      {/* Payment Button */}
                      <Button
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={handlePayment}
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Memproses...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5 mr-2" />
                            {summary.pricing.isFree
                              ? "Daftar Sekarang"
                              : "Bayar Sekarang"}
                          </>
                        )}
                      </Button>

                      {/* Payment Methods Info */}
                      {!summary.pricing.isFree && (
                        <div className="pt-4 border-t">
                          <p className="text-xs text-muted-foreground text-center mb-3">
                            Metode pembayaran yang tersedia:
                          </p>
                          <div className="flex flex-wrap justify-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              Credit Card
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              GoPay
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              QRIS
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Bank Transfer
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Terms Notice */}
                      <div className="pt-4 border-t">
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <p>
                            Dengan melanjutkan, Anda menyetujui{" "}
                            <a
                              href="/terms"
                              className="text-primary hover:underline"
                            >
                              Syarat & Ketentuan
                            </a>{" "}
                            dan{" "}
                            <a
                              href="/privacy"
                              className="text-primary hover:underline"
                            >
                              Kebijakan Privasi
                            </a>{" "}
                            kami.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Information Card */}
                <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-blue-800">Informasi Penting</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/70 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-blue-900 mb-1">E-Ticket Digital</h4>
                            <p className="text-sm text-blue-700">
                              Setelah pembayaran berhasil, e-ticket akan dikirim ke email Anda
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/70 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-green-900 mb-1">Pembayaran Aman</h4>
                            <p className="text-sm text-green-700">
                              Transaksi diproses dengan enkripsi SSL 256-bit
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/70 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-purple-900 mb-1">Kebijakan Pembatalan</h4>
                            <p className="text-sm text-purple-700">
                              Pembatalan dapat dilakukan hingga 24 jam sebelum event
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentSummaryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Memuat...</p>
          </div>
        </div>
      }
    >
      <PaymentSummaryContent />
    </Suspense>
  );
}
