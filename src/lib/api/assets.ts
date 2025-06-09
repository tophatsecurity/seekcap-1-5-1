
export interface APIAsset {
  id: string;
  ip?: string;
  mac_address?: string;
  hostname?: string;
  vendor?: string;
  device_type?: string;
  os?: string;
  tags?: string[];
  timestamp_first_seen?: string;
  timestamp_last_seen?: string;
  interfaces?: Array<{
    name: string;
    ip: string;
  }>;
  identifiers?: Array<{
    label: string;
    data: string;
  }>;
  highlights?: Record<string, string[]>;
}

export interface APIAssetsResponse {
  page: number;
  page_size: number;
  total: number;
  results: APIAsset[];
}

export interface APIStatsResponse {
  by_vendor: { buckets: Array<{ key: string; doc_count: number }> };
  by_device_type: { buckets: Array<{ key: string; doc_count: number }> };
  by_os: { buckets: Array<{ key: string; doc_count: number }> };
  by_tag: { buckets: Array<{ key: string; doc_count: number }> };
}

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:8004';

class AssetsAPI {
  private async makeRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getAssets(params?: {
    ip?: string;
    mac?: string;
    hostname?: string;
    vendor?: string;
    device_type?: string;
    os?: string;
    tag?: string;
    interface_name?: string;
    interface_ip?: string;
    data_search?: string;
    search?: string;
    page?: number;
    page_size?: number;
    sort_by?: string;
    sort_order?: string;
  }): Promise<APIAssetsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const query = searchParams.toString();
    const endpoint = `/assets${query ? `?${query}` : ''}`;
    
    return this.makeRequest<APIAssetsResponse>(endpoint);
  }

  async searchAssets(payload: Record<string, any>): Promise<APIAsset[]> {
    return this.makeRequest<APIAsset[]>('/assets/search', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async exportAssets(payload: Record<string, any>): Promise<APIAsset[]> {
    return this.makeRequest<APIAsset[]>('/assets/export', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getAssetStats(): Promise<APIStatsResponse> {
    return this.makeRequest<APIStatsResponse>('/assets/stats');
  }

  async getSchema(): Promise<any> {
    return this.makeRequest<any>('/assets/schema');
  }

  async getSearchableFields(): Promise<{ searchable_fields: string[] }> {
    return this.makeRequest<{ searchable_fields: string[] }>('/assets/fields');
  }

  async getAssetById(id: string): Promise<APIAsset> {
    return this.makeRequest<APIAsset>(`/assets/${id}`);
  }

  async getAssetDetails(id: string): Promise<{
    id: string;
    index: string;
    source: APIAsset;
  }> {
    return this.makeRequest(`/assets/${id}/details`);
  }

  async updateAsset(id: string, updateData: Record<string, any>): Promise<{
    status: string;
    id: string;
  }> {
    return this.makeRequest(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }

  async deleteAsset(id: string): Promise<{
    status: string;
    id: string;
  }> {
    return this.makeRequest(`/assets/${id}`, {
      method: 'DELETE',
    });
  }
}

export const assetsAPI = new AssetsAPI();
