import { STORAGE_KEYS } from "@/constants";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Get auth token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(STORAGE_KEYS.token);
  }
  return null;
};

/**
 * Create headers with auth token
 */
const createHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Payment summary data type
 */
export interface PaymentSummary {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    category: string;
    price: number;
  };
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  pricing: {
    amount: number;
    adminFee: number;
    totalAmount: number;
    isFree: boolean;
  };
}

/**
 * Transaction data type
 */
export interface Transaction {
  id: string;
  userId: string;
  eventId: string;
  participantId?: string;
  orderId: string;
  transactionId?: string;
  amount: number;
  adminFee: number;
  totalAmount: number;
  paymentStatus:
    | "pending"
    | "paid"
    | "failed"
    | "expired"
    | "cancelled"
    | "refunded";
  paymentMethod?: string;
  paymentType?: string;
  vaNumber?: string;
  bankName?: string;
  snapToken?: string;
  snapUrl?: string;
  paidAt?: string;
  expiredAt?: string;
  midtransResponse?: Record<string, unknown>;
  failureReason?: string;
  notes?: string;
  isRefunded: boolean;
  refundedAt?: string;
  refundReason?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    [key: string]: unknown;
  };
  event?: {
    id: string;
    title: string;
    [key: string]: unknown;
  };
  participant?: {
    id: string;
    [key: string]: unknown;
  };
}

/**
 * Transaction statistics type
 */
export interface TransactionStatistics {
  total: number;
  paid: number;
  pending: number;
  failed: number;
  totalRevenue: number;
}

/**
 * Get payment summary before checkout
 */
export async function getPaymentSummary(
  eventId: string,
): Promise<PaymentSummary> {
  const response = await fetch(`${API_URL}/payment/summary`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify({ eventId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get payment summary");
  }

  return data.data;
}

/**
 * Create new transaction
 */
export async function createTransaction(eventId: string): Promise<Transaction> {
  const response = await fetch(`${API_URL}/payment/create`, {
    method: "POST",
    headers: createHeaders(),
    body: JSON.stringify({ eventId }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create transaction");
  }

  return data.data;
}

/**
 * Get transaction by order ID
 */
export async function getTransactionByOrderId(
  orderId: string,
): Promise<Transaction> {
  const response = await fetch(
    `${API_URL}/payment/transaction/${orderId}`,
    {
      method: "GET",
      headers: createHeaders(),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get transaction");
  }

  return data.data;
}

/**
 * Get transaction by ID
 */
export async function getTransactionById(id: string): Promise<Transaction> {
  const response = await fetch(`${API_URL}/payment/${id}`, {
    method: "GET",
    headers: createHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get transaction");
  }

  return data.data;
}

/**
 * Check transaction status from Midtrans
 */
export async function checkTransactionStatus(
  orderId: string,
): Promise<Transaction> {
  const response = await fetch(`${API_URL}/payment/status/${orderId}`, {
    method: "GET",
    headers: createHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to check transaction status");
  }

  return data.data;
}

/**
 * Get user's transactions
 */
export async function getMyTransactions(): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/payment/my-transactions`, {
    method: "GET",
    headers: createHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get transactions");
  }

  return data.data;
}

/**
 * Cancel transaction
 */
export async function cancelTransaction(orderId: string): Promise<Transaction> {
  const response = await fetch(`${API_URL}/payment/cancel/${orderId}`, {
    method: "POST",
    headers: createHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel transaction");
  }

  return data.data;
}

/**
 * Get event transactions (Admin only)
 */
export async function getEventTransactions(
  eventId: string,
): Promise<Transaction[]> {
  const response = await fetch(`${API_URL}/payment/event/${eventId}`, {
    method: "GET",
    headers: createHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get event transactions");
  }

  return data.data;
}

/**
 * Get all transactions (Admin only)
 */
export async function getAllTransactions(filters?: {
  status?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}): Promise<{ transactions: Transaction[]; total: number }> {
  const params = new URLSearchParams();

  if (filters?.status) params.append("status", filters.status);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.offset) params.append("offset", filters.offset.toString());

  const queryString = params.toString();
  const url = `${API_URL}/payment/admin/all${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: createHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get all transactions");
  }

  return {
    transactions: data.data,
    total: data.total,
  };
}

/**
 * Get transaction statistics (Admin only)
 */
export async function getTransactionStatistics(
  eventId?: string,
): Promise<TransactionStatistics> {
  const params = new URLSearchParams();
  if (eventId) params.append("eventId", eventId);

  const queryString = params.toString();
  const url = `${API_URL}/payment/admin/statistics${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    method: "GET",
    headers: createHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to get transaction statistics");
  }

  return data.data;
}

/**
 * Format currency to Indonesian Rupiah
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get payment status badge color
 */
export function getPaymentStatusColor(status: string): string {
  const colors: { [key: string]: string } = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
    cancelled: "bg-gray-100 text-gray-800",
    refunded: "bg-blue-100 text-blue-800",
  };

  return colors[status] || "bg-gray-100 text-gray-800";
}

/**
 * Get payment status label
 */
export function getPaymentStatusLabel(status: string): string {
  const labels: { [key: string]: string } = {
    pending: "Menunggu Pembayaran",
    paid: "Sudah Dibayar",
    failed: "Gagal",
    expired: "Kadaluarsa",
    cancelled: "Dibatalkan",
    refunded: "Dikembalikan",
  };

  return labels[status] || status;
}

/**
 * Get payment method label
 */
export function getPaymentMethodLabel(method: string): string {
  const labels: { [key: string]: string } = {
    credit_card: "Kartu Kredit",
    bank_transfer: "Transfer Bank",
    gopay: "GoPay",
    shopeepay: "ShopeePay",
    qris: "QRIS",
    ovo: "OVO",
    dana: "DANA",
    bca_va: "BCA Virtual Account",
    bni_va: "BNI Virtual Account",
    bri_va: "BRI Virtual Account",
    mandiri_va: "Mandiri Virtual Account",
    permata_va: "Permata Virtual Account",
    cimb_va: "CIMB Virtual Account",
    free: "Gratis",
  };

  return labels[method] || method;
}

const paymentApi = {
  getPaymentSummary,
  createTransaction,
  getTransactionByOrderId,
  getTransactionById,
  checkTransactionStatus,
  getMyTransactions,
  cancelTransaction,
  getEventTransactions,
  getAllTransactions,
  getTransactionStatistics,
  formatCurrency,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getPaymentMethodLabel,
};

export default paymentApi;
