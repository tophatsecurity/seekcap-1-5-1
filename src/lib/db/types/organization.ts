
export interface Organization {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

export interface OrganizationIpRange {
  id: number;
  organization_id: number;
  network: string;
  netmask: string;
  description?: string;
}

export interface OrganizationVendor {
  id: number;
  organization_id: number;
  vendor: string;
  description?: string;
}
