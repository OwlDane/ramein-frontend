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
import Script from "next/script";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess: (result: unknown) => void;
          onPending: (result: unknown) => void;
          onError: (error: unknown) => void;
          onClose: () => void;
        },
      ) => void;
    };
  }
}

function PaymentSummaryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [snapScriptLoaded, setSnapScriptLoaded] = useState(false);

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

    // Check if Snap script is loaded for paid events
    if (!summary.pricing.isFree && !snapScriptLoaded) {
      toast.error("Payment gateway sedang dimuat, mohon tunggu...");
      return;
    }

    try {
      setProcessing(true);

      const transaction = await createTransaction(eventId);

      // If free event, redirect to success immediately
      if (transaction.paymentStatus === "paid") {
        toast.success("Pendaftaran berhasil!");
        router.push(`/payment/success?order_id=${transaction.orderId}`);
        return;
      }

      // For paid events, open Midtrans Snap
      if (transaction.snapToken && window.snap) {
        window.snap.pay(transaction.snapToken, {
          onSuccess: function (result: unknown) {
            console.log("Payment success:", result);
            router.push(`/payment/success?order_id=${transaction.orderId}`);
          },
          onPending: function (result: unknown) {
            console.log("Payment pending:", result);
            router.push(`/payment/pending?order_id=${transaction.orderId}`);
          },
          onError: function (error: unknown) {
            console.error("Payment error:", error);
            router.push(`/payment/error?order_id=${transaction.orderId}`);
          },
          onClose: function () {
            console.log("Payment popup closed");
            setProcessing(false);
          },
        });
      } else {
        throw new Error("Payment gateway tidak tersedia");
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
      {/* Load Midtrans Snap Script */}
      <Script
        src={process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL}
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
        onLoad={() => setSnapScriptLoaded(true)}
      />

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
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

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Event & User Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Event Information */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Detail Event</h2>

                  <div className="space-y-4">
                    {/* Event Title */}
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {summary.event.title}
                      </h3>
                      {summary.event.category && (
                        <Badge variant="secondary">
                          {summary.event.category}
                        </Badge>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="space-y-3 pt-4 border-t">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="w-5 h-5 flex-shrink-0" />
                        <span>
                          {format(
                            parseISO(summary.event.date),
                            "EEEE, dd MMMM yyyy",
                            {
                              locale: localeId,
                            },
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock className="w-5 h-5 flex-shrink-0" />
                        <span>{summary.event.time}</span>
                      </div>

                      <div className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <span>{summary.event.location}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* User Information */}
              <Card className="shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Informasi Peserta
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Nama Lengkap
                        </p>
                        <p className="font-medium">{summary.user.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{summary.user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          No. Handphone
                        </p>
                        <p className="font-medium">{summary.user.phone}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="shadow-sm border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-900 mb-1">
                        Transaksi Aman
                      </h3>
                      <p className="text-sm text-blue-700">
                        Pembayaran Anda dilindungi dengan enkripsi tingkat bank.
                        Kami tidak menyimpan informasi kartu kredit Anda.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Price Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <Card className="shadow-md border-2">
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                      Ringkasan Pembayaran
                    </h2>

                    <div className="space-y-4">
                      {/* Price Breakdown */}
                      <div className="space-y-3 pb-4 border-b">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Harga Event
                          </span>
                          <span className="font-medium">
                            {formatCurrency(summary.pricing.amount)}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Biaya Admin
                          </span>
                          <span className="font-medium">
                            {formatCurrency(summary.pricing.adminFee)}
                          </span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-baseline pt-2">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(summary.pricing.totalAmount)}
                        </span>
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
                        className="w-full h-12 text-base"
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
