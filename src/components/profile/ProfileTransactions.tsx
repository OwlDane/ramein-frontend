"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  ChevronRight,
  Loader2,
  Eye,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import {
  getMyTransactions,
  formatCurrency,
  getPaymentStatusLabel,
  getPaymentMethodLabel,
  cancelTransaction,
  type Transaction,
} from "@/lib/paymentApi";
import { toast } from "sonner";

interface ProfileTransactionsProps {
  userToken: string;
}

export function ProfileTransactions({ userToken }: ProfileTransactionsProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMyTransactions();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Gagal memuat riwayat transaksi");
    } finally {
      setLoading(false);
    }
  }, []);

  const filterTransactions = useCallback(() => {
    let filtered = [...transactions];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.paymentStatus === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.event?.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, statusFilter]);

  useEffect(() => {
    if (userToken) {
      fetchTransactions();
    }
  }, [userToken, fetchTransactions]);

  useEffect(() => {
    filterTransactions();
  }, [filterTransactions]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "failed":
        return <XCircle className="w-4 h-4" />;
      case "expired":
        return <AlertCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "failed":
        return "bg-red-100 text-red-700 border-red-200";
      case "expired":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "cancelled":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const handleExport = () => {
    toast.info("Fitur export akan segera hadir");
  };

  if (loading) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Memuat transaksi...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Riwayat Transaksi</h2>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-base font-medium mb-2">Belum Ada Transaksi</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Transaksi pembayaran Anda akan muncul di sini
            </p>
            <Button onClick={() => (window.location.href = "/")}>
              Jelajahi Event
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Riwayat Transaksi</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filteredTransactions.length} transaksi ditemukan
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari order ID atau nama event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="paid">Berhasil</option>
                <option value="pending">Menunggu</option>
                <option value="failed">Gagal</option>
                <option value="expired">Kadaluarsa</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card className="shadow-sm">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">
                Tidak ada transaksi yang sesuai dengan pencarian
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTransaction(transaction)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left Section */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {transaction.event?.title || "Event"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Order ID: {transaction.orderId}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {format(
                          new Date(transaction.createdAt),
                          "dd MMM yyyy, HH:mm",
                          { locale: localeId },
                        )}
                      </div>
                      {transaction.paymentMethod && (
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div>
                      <Badge
                        variant="outline"
                        className={`${getStatusBadgeClass(transaction.paymentStatus)} inline-flex items-center gap-1`}
                      >
                        {getStatusIcon(transaction.paymentStatus)}
                        {getPaymentStatusLabel(transaction.paymentStatus)}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">
                        Total Pembayaran
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(transaction.totalAmount)}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Eye className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

// Transaction Detail Modal Component
function TransactionDetailModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelTransaction = async () => {
    if (!confirm('Apakah Anda yakin ingin membatalkan transaksi ini?')) {
      return;
    }

    try {
      setIsCancelling(true);
      await cancelTransaction(transaction.orderId);
      toast.success('Transaksi berhasil dibatalkan');
      onClose();
      // Refresh page to update transaction list
      window.location.reload();
    } catch (error) {
      console.error('Cancel transaction error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal membatalkan transaksi');
    } finally {
      setIsCancelling(false);
    }
  };

  // Check if transaction can be cancelled (only pending transactions)
  const canCancel = transaction.paymentStatus === 'pending';

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Detail Transaksi</h3>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <XCircle className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Status Pembayaran
            </label>
            <div className="mt-2">
              <Badge
                variant="outline"
                className={`${getStatusBadgeClass(transaction.paymentStatus)} text-base px-4 py-2`}
              >
                {getPaymentStatusLabel(transaction.paymentStatus)}
              </Badge>
            </div>
          </div>

          {/* Order Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Order ID
              </label>
              <p className="mt-1 font-mono text-sm">{transaction.orderId}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Tanggal Transaksi
              </label>
              <p className="mt-1">
                {format(
                  new Date(transaction.createdAt),
                  "dd MMMM yyyy, HH:mm",
                  {
                    locale: localeId,
                  },
                )}
              </p>
            </div>
          </div>

          {/* Event Info */}
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Event
            </label>
            <p className="mt-1 font-semibold">
              {transaction.event?.title || "Event"}
            </p>
          </div>

          {/* Payment Method */}
          {transaction.paymentMethod && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Metode Pembayaran
              </label>
              <p className="mt-1">
                {getPaymentMethodLabel(transaction.paymentMethod)}
              </p>
            </div>
          )}

          {/* VA Number */}
          {transaction.vaNumber && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Nomor Virtual Account
              </label>
              <div className="mt-1 flex items-center gap-2">
                <code className="bg-gray-100 px-3 py-2 rounded font-mono">
                  {transaction.vaNumber}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.vaNumber!);
                    toast.success("Nomor VA disalin!");
                  }}
                >
                  Salin
                </Button>
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="border-t pt-4">
            <div className="space-y-2">
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
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total Pembayaran</span>
                <span className="text-primary">
                  {formatCurrency(transaction.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Paid Date */}
          {transaction.paidAt && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Dibayar Pada
              </label>
              <p className="mt-1 text-green-600 font-medium">
                {format(new Date(transaction.paidAt), "dd MMMM yyyy, HH:mm", {
                  locale: localeId,
                })}
              </p>
            </div>
          )}

          {/* Notes */}
          {transaction.notes && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                Catatan
              </label>
              <p className="mt-1 text-sm">{transaction.notes}</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 space-y-3">
          {canCancel && (
            <Button
              variant="destructive"
              className="w-full"
              onClick={handleCancelTransaction}
              disabled={isCancelling}
            >
              {isCancelling ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Membatalkan...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Batalkan Transaksi
                </>
              )}
            </Button>
          )}
          <Button variant="outline" className="w-full" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </div>
    </div>
  );
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-700 border-red-200";
    case "expired":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "cancelled":
      return "bg-gray-100 text-gray-700 border-gray-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}
