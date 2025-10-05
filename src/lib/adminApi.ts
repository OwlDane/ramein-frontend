import { API_ENDPOINTS } from '@/constants';
import { RecentEvent, ParticipantStat } from '@/types/admin';

const API_BASE_URL = API_ENDPOINTS.base;

// ---- Types ----
export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
  isAdmin: boolean;
}

export interface AdminLoginResponse {
  message: string;
  token: string;
  admin: Admin;
}

export interface AdminVerifyResponse {
  valid: boolean;
  admin: Admin;
}

export interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  totalUsers: number;
  recentEvents: RecentEvent[];
  participantStats: ParticipantStat[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  verified: boolean;
  status: 'active' | 'inactive';
}

export interface Certificate {
  id: string;
  eventId: string;
  participantId: string;
  issuedAt: string;
  revoked: boolean;
}

// ---- Service ----
class AdminApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('ramein_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // ---- Auth ----
  async login(email: string, password: string): Promise<AdminLoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api${API_ENDPOINTS.admin.login}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return this.handleResponse<AdminLoginResponse>(response);
  }

  async verifySession(): Promise<AdminVerifyResponse> {
    const response = await fetch(`${API_BASE_URL}/api${API_ENDPOINTS.admin.verify}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<AdminVerifyResponse>(response);
  }

  async logout(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api${API_ENDPOINTS.admin.logout}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async getProfile(): Promise<{ admin: Admin }> {
    const response = await fetch(`${API_BASE_URL}/api${API_ENDPOINTS.admin.profile}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ admin: Admin }>(response);
  }

  // ---- Dashboard ----
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<DashboardStats>(response);
  }

  async exportData(format: string): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/dashboard/export?format=${format}`,
      { headers: this.getAuthHeaders() }
    );
    if (!response.ok) throw new Error(`Export failed: ${response.status}`);
    return response.blob();
  }

  // ---- Events ----
  async getEvents(filters: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  } = {}): Promise<PaginatedResponse<Event>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, value.toString());
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/events?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PaginatedResponse<Event>>(response);
  }

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/admin/events`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return this.handleResponse<Event>(response);
  }

  async updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    return this.handleResponse<Event>(response);
  }

  async deleteEvent(eventId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async exportEventParticipants(eventId: string, format = 'xlsx'): Promise<Blob> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/events/${eventId}/participants/export?format=${format}`,
      { headers: this.getAuthHeaders() }
    );
    if (!response.ok) throw new Error(`Export failed: ${response.status}`);
    return response.blob();
  }

  // ---- Users ----
  async getUsers(filters: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    verified?: boolean;
  } = {}): Promise<PaginatedResponse<User>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, value.toString());
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PaginatedResponse<User>>(response);
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role }),
    });
    return this.handleResponse<User>(response);
  }

  async toggleUserStatus(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/toggle-status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<User>(response);
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // ---- Certificates ----
  async getCertificates(filters: {
    page?: number;
    limit?: number;
    search?: string;
    eventId?: string;
  } = {}): Promise<PaginatedResponse<Certificate>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, value.toString());
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/certificates?${params}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<PaginatedResponse<Certificate>>(response);
  }

  async generateCertificate(participantId: string): Promise<Certificate> {
    const response = await fetch(`${API_BASE_URL}/api/admin/certificates/generate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ participantId }),
    });
    return this.handleResponse<Certificate>(response);
  }

  async revokeCertificate(certificateId: string): Promise<Certificate> {
    const response = await fetch(
      `${API_BASE_URL}/api/admin/certificates/${certificateId}/revoke`,
      { method: 'PUT', headers: this.getAuthHeaders() }
    );
    return this.handleResponse<Certificate>(response);
  }
}

// Export singleton instance
export const adminApi = new AdminApiService();
export default adminApi;
