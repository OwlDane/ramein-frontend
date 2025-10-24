'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Eye,
  RefreshCw,
  Filter,
  Calendar,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import {
  getAllTransactions,
  getTransactionStatistics,
  formatCurrency,
  getPaymentStatusLabel,
  getPaymentMethodLabel,
  Transaction,
  TransactionStatistics,
} from '@/lib/paymentApi';
import { toast } from 'sonner';

export function AdminPaymentManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [statistics, setStatistics] = useState<TransactionStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const itemsPerPage = 10;

  // Load data
  const loadData = async () => {
    try {
      setIsLoading(true);

      // Get statistics
      const stats = await getTransactionStatistics();
      setStatistics(stats);

      // Get transactions with filters
      const filters: {
        status?: string;
        startDate?: string;
        endDate?: string;
        limit: number;
        offset: number;
      } = {
        limit: itemsPerPage,
        offset: (currentPage - 1) * itemsPerPage,
      };

      if (statusFilter !== 'all') {
        filters.status = statusFilter;
      }
      if (startDate) {
        filters.startDate = startDate;
      }
      if (endDate) {
        filters.endDate = endDate;
      }

      const { transactions: txs, total } = await getAllTransactions(filters);
      setTransactions(txs);
      setTotalTransactions(total);
    } catch (error: any) {
      console.error('Failed to load data:', error);
      
      // Check if it's an auth error
      if (error.message?.includes('token') || error.message?.includes('Session expired')) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
        // Redirect to admin login after a short delay
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else {
        toast.error('Gagal memuat data pembayaran');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, statusFilter, startDate, endDate]);

  // Filter transactions by search query
  const filteredTransactions = transactions.filter((tx) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      tx.orderId.toLowerCase().includes(query) ||
      tx.user?.name.toLowerCase().includes(query) ||
      tx.user?.email.toLowerCase().includes(query) ||
      tx.event?.title.toLowerCase().includes(query)
    );
  });

  // Export to CSV
  const handleExport = () => {
    if (transactions.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const headers = [
      'Order ID',
      'Tanggal',
      'User',
      'Email',
      'Event',
      'Jumlah',
      'Admin Fee',
      'Total',
      'Status',
      'Metode Pembayaran',
    ];

    const csvData = filteredTransactions.map((tx) => [
      tx.orderId,
      new Date(tx.createdAt).toLocaleString('id-ID'),
      tx.user?.name || '-',
      tx.user?.email || '-',
      tx.event?.title || '-',
      tx.amount,
      tx.adminFee,
      tx.totalAmount,
      getPaymentStatusLabel(tx.paymentStatus),
      tx.paymentMethod ? getPaymentMethodLabel(tx.paymentMethod) : '-',
    ]);

    const csv = [headers, ...csvData].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transaksi-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Data berhasil diekspor');
  };

  // View transaction detail
  const handleViewDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  // Get status badge variant
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      paid: 'default',
      pending: 'secondary',
      failed: 'destructive',
      expired: 'outline',
      cancelled: 'outline',
      refunded: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="whitespace-nowrap">
        {getPaymentStatusLabel(status)}
      </Badge>
    );
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalTransactions / itemsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statistics ? formatCurrency(statistics.totalRevenue) : '-'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Dari {statistics?.total || 0} transaksi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Berhasil</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.paid || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics && statistics.total > 0
                ? `${((statistics.paid / statistics.total) * 100).toFixed(1)}% dari total`
                : '0% dari total'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Pembayaran</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.pending || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Transaksi pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaksi Gagal</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics?.failed || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {statistics && statistics.total > 0
                ? `${((statistics.failed / statistics.total) * 100).toFixed(1)}% dari total`
                : '0% dari total'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <CardTitle>Daftar Transaksi</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Monitor dan kelola transaksi pembayaran
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari order ID, user, event..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="paid">Berhasil</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Gagal</SelectItem>
                <SelectItem value="expired">Kadaluarsa</SelectItem>
                <SelectItem value="cancelled">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                placeholder="Dari tanggal"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                placeholder="Sampai tanggal"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Active Filters Info */}
          {(statusFilter !== 'all' || startDate || endDate || searchQuery) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">
                  Filter aktif: {statusFilter !== 'all' && `Status: ${getPaymentStatusLabel(statusFilter)}`}
                  {startDate && ` | Dari: ${new Date(startDate).toLocaleDateString('id-ID')}`}
                  {endDate && ` | Sampai: ${new Date(endDate).toLocaleDateString('id-ID')}`}
                  {searchQuery && ` | Pencarian: "${searchQuery}"`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatusFilter('all');
                    setStartDate('');
                    setEndDate('');
                    setSearchQuery('');
                  }}
                >
                  Reset
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Transaction Table */}
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Metode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Tidak ada transaksi yang ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell className="font-mono text-sm">{tx.orderId}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(tx.createdAt).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{tx.user?.name || '-'}</span>
                          <span className="text-xs text-muted-foreground">{tx.user?.email || '-'}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">
                        {tx.event?.title || '-'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(tx.totalAmount)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {tx.paymentMethod ? getPaymentMethodLabel(tx.paymentMethod) : '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.paymentStatus)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetail(tx)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, totalTransactions)} dari {totalTransactions}{' '}
                transaksi
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Transaksi</DialogTitle>
            <DialogDescription>Informasi lengkap transaksi pembayaran</DialogDescription>
          </DialogHeader>

          {selectedTransaction && (
            <div className="space-y-6">
              {/* Transaction Info */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono font-medium">{selectedTransaction.orderId}</span>

                  <span className="text-muted-foreground">Transaction ID:</span>
                  <span className="font-mono text-sm">
                    {selectedTransaction.transactionId || '-'}
                  </span>

                  <span className="text-muted-foreground">Status:</span>
                  <div>{getStatusBadge(selectedTransaction.paymentStatus)}</div>

                  <span className="text-muted-foreground">Tanggal Dibuat:</span>
                  <span>
                    {new Date(selectedTransaction.createdAt).toLocaleString('id-ID')}
                  </span>

                  {selectedTransaction.paidAt && (
                    <>
                      <span className="text-muted-foreground">Tanggal Dibayar:</span>
                      <span>
                        {new Date(selectedTransaction.paidAt).toLocaleString('id-ID')}
                      </span>
                    </>
                  )}

                  {selectedTransaction.expiredAt && (
                    <>
                      <span className="text-muted-foreground">Kadaluarsa:</span>
                      <span>
                        {new Date(selectedTransaction.expiredAt).toLocaleString('id-ID')}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* User Info */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Informasi User
                </h4>
                <div className="grid gap-2 text-sm bg-muted p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama:</span>
                    <span className="font-medium">{selectedTransaction.user?.name || '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{selectedTransaction.user?.email || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Event Info */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Informasi Event
                </h4>
                <div className="grid gap-2 text-sm bg-muted p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Event:</span>
                    <span className="font-medium">{selectedTransaction.event?.title || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Detail Pembayaran
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Harga Event:</span>
                    <span>{formatCurrency(selectedTransaction.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Biaya Admin:</span>
                    <span>{formatCurrency(selectedTransaction.adminFee)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedTransaction.totalAmount)}</span>
                  </div>

                  {selectedTransaction.paymentMethod && (
                    <div className="flex justify-between pt-2">
                      <span className="text-muted-foreground">Metode Pembayaran:</span>
                      <span className="font-medium">
                        {getPaymentMethodLabel(selectedTransaction.paymentMethod)}
                      </span>
                    </div>
                  )}

                  {selectedTransaction.vaNumber && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">VA Number:</span>
                      <span className="font-mono font-medium">
                        {selectedTransaction.vaNumber}
                      </span>
                    </div>
                  )}

                  {selectedTransaction.bankName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bank:</span>
                      <span className="font-medium">{selectedTransaction.bankName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedTransaction.notes && (
                <div>
                  <h4 className="font-semibold mb-2">Catatan</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                    {selectedTransaction.notes}
                  </p>
                </div>
              )}

              {/* Failure Reason */}
              {selectedTransaction.failureReason && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Alasan Gagal:</strong> {selectedTransaction.failureReason}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
