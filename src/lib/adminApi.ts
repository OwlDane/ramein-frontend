import { API_ENDPOINTS } from '@/constants';

const API_BASE_URL = API_ENDPOINTS.base;

export interface AdminLoginResponse {
  message: string;
  token: string;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
    isAdmin: boolean;
  };
}

export interface AdminVerifyResponse {
  valid: boolean;
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
    isAdmin: boolean;
  };
}

export interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  totalUsers: number;
  recentEvents: any[];
  participantStats: any[];
}

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

  // Auth methods
  async login(email: string, password: string): Promise<AdminLoginResponse> {
    const response = await fetch(`${API_BASE_URL}/api${API_ENDPOINTS.admin.login}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

  async getProfile(): Promise<{ admin: any }> {
    const response = await fetch(`${API_BASE_URL}/api${API_ENDPOINTS.admin.profile}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<{ admin: any }>(response);
  }

  // Dashboard methods
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<DashboardStats>(response);
  }

  async exportData(format: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/export?format=${format}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    return response.blob();
  }

  // Event management methods
  async getEvents(filters: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  } = {}): Promise<any> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/events?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createEvent(eventData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/events`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });

    return this.handleResponse(response);
  }

  async updateEvent(eventId: string, eventData: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(eventData),
    });

    return this.handleResponse(response);
  }

  async deleteEvent(eventId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async exportEventParticipants(eventId: string, format = 'xlsx'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/api/admin/events/${eventId}/participants/export?format=${format}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Export failed: ${response.status}`);
    }

    return response.blob();
  }

  // User management methods
  async getUsers(filters: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    verified?: boolean;
  } = {}): Promise<any> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/users?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateUserRole(userId: string, role: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    return this.handleResponse(response);
  }

  async toggleUserStatus(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/toggle-status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async deleteUser(userId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Certificate management methods
  async getCertificates(filters: {
    page?: number;
    limit?: number;
    search?: string;
    eventId?: string;
  } = {}): Promise<any> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/api/admin/certificates?${params}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async generateCertificate(participantId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/certificates/generate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ participantId }),
    });

    return this.handleResponse(response);
  }

  async revokeCertificate(certificateId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/admin/certificates/${certificateId}/revoke`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }
}

// Export singleton instance
export const adminApi = new AdminApiService();
export default adminApi;
