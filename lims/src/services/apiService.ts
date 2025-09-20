const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Support APIs
  async getSupportTickets(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/support/tickets/${queryString}`);
  }

  async createSupportTicket(data: any) {
    return this.request('/support/tickets/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSupportTicket(id: number, data: any) {
    return this.request(`/support/tickets/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async assignSupportTicket(id: number, assignedTo: number) {
    return this.request(`/support/tickets/${id}/assign/`, {
      method: 'POST',
      body: JSON.stringify({ assigned_to: assignedTo }),
    });
  }

  async resolveSupportTicket(id: number) {
    return this.request(`/support/tickets/${id}/resolve/`, {
      method: 'POST',
    });
  }

  async closeSupportTicket(id: number) {
    return this.request(`/support/tickets/${id}/close/`, {
      method: 'POST',
    });
  }

  async getSupportTicketMessages(ticketId: number) {
    return this.request(`/support/tickets/${ticketId}/messages/`);
  }

  async addSupportTicketMessage(ticketId: number, message: string, isInternal = false) {
    return this.request(`/support/tickets/${ticketId}/add_message/`, {
      method: 'POST',
      body: JSON.stringify({ message, is_internal: isInternal }),
    });
  }

  // Equipment APIs
  async getEquipment(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/equipment/equipment/${queryString}`);
  }

  async createEquipment(data: any) {
    return this.request('/equipment/equipment/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEquipment(id: number, data: any) {
    return this.request(`/equipment/equipment/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async calibrateEquipment(id: number, data: any) {
    return this.request(`/equipment/equipment/${id}/calibrate/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async maintainEquipment(id: number, data: any) {
    return this.request(`/equipment/equipment/${id}/maintain/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEquipmentStatus(id: number, status: string) {
    return this.request(`/equipment/equipment/${id}/update_status/`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  // Inventory APIs
  async getInventoryItems(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/inventory/items/${queryString}`);
  }

  async createInventoryItem(data: any) {
    return this.request('/inventory/items/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateInventoryItem(id: number, data: any) {
    return this.request(`/inventory/items/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async approveInventoryItem(id: number) {
    return this.request(`/inventory/items/${id}/approve/`, {
      method: 'POST',
    });
  }

  async rejectInventoryItem(id: number) {
    return this.request(`/inventory/items/${id}/reject/`, {
      method: 'POST',
    });
  }

  async adjustInventoryQuantity(id: number, quantity: number, transactionType = 'adjustment', notes = '') {
    return this.request(`/inventory/items/${id}/adjust_quantity/`, {
      method: 'POST',
      body: JSON.stringify({ quantity, transaction_type: transactionType, notes }),
    });
  }

  async getInventoryCategories() {
    return this.request('/inventory/categories/');
  }

  async getSuppliers() {
    return this.request('/inventory/suppliers/');
  }

  async getReorderRequests(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/inventory/reorders/${queryString}`);
  }

  async approveReorderRequest(id: number) {
    return this.request(`/inventory/reorders/${id}/approve/`, {
      method: 'POST',
    });
  }

  async rejectReorderRequest(id: number) {
    return this.request(`/inventory/reorders/${id}/reject/`, {
      method: 'POST',
    });
  }

  // Analytics APIs
  async getLabAnalytics(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/analytics/lab-analytics/${queryString}`);
  }

  async getAnalyticsSummary(tenant?: string, days = 30) {
    const params = new URLSearchParams();
    if (tenant) params.append('tenant', tenant);
    params.append('days', days.toString());
    return this.request(`/analytics/lab-analytics/summary/?${params.toString()}`);
  }

  async getSystemLogs(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/analytics/system-logs/${queryString}`);
  }

  // Notification APIs
  async getNotifications(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/notifications/notifications/${queryString}`);
  }

  async markNotificationRead(id: number) {
    return this.request(`/notifications/notifications/${id}/mark_read/`, {
      method: 'POST',
    });
  }

  async markAllNotificationsRead(tenant?: string) {
    return this.request('/notifications/notifications/mark_all_read/', {
      method: 'POST',
      body: JSON.stringify({ tenant }),
    });
  }

  async getUnreadNotificationCount(tenant?: string) {
    const queryString = tenant ? `?tenant=${tenant}` : '';
    return this.request(`/notifications/notifications/unread_count/${queryString}`);
  }

  // FAQ APIs
  async getFAQs(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/faq/faqs/${queryString}`);
  }

  async getFAQCategories() {
    return this.request('/faq/categories/');
  }

  async searchFAQs(query: string, category?: string) {
    const params = new URLSearchParams({ q: query });
    if (category) params.append('category', category);
    return this.request(`/faq/faqs/search/?${params.toString()}`);
  }

  async submitFAQFeedback(faqId: number, isHelpful: boolean, comment = '') {
    return this.request('/faq/feedback/', {
      method: 'POST',
      body: JSON.stringify({
        faq: faqId,
        is_helpful: isHelpful,
        comment,
      }),
    });
  }

  // File Management APIs
  async getFiles(params?: Record<string, any>) {
    const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
    return this.request(`/files/files/${queryString}`);
  }

  async uploadFile(file: File, metadata: any) {
    const formData = new FormData();
    formData.append('file', file);
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key]);
    });

    return this.request('/files/files/', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async downloadFile(id: number) {
    const response = await fetch(`${API_BASE_URL}/files/files/${id}/download/`);
    if (!response.ok) throw new Error('Download failed');
    return response.blob();
  }

  async shareFile(fileId: number, sharedWith: number, permission = 'read', expiresAt?: string) {
    return this.request('/files/shares/', {
      method: 'POST',
      body: JSON.stringify({
        file: fileId,
        shared_with: sharedWith,
        permission,
        expires_at: expiresAt,
      }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
