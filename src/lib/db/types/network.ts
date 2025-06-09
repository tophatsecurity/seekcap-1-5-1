
export interface NetworkDevice {
  id?: number;
  name: string;
  device_type: string;
  application?: string;
  status?: string;
  ip_address?: string;
  uplink?: string;
  parent_device?: string;
  ch_24_ghz?: string;
  ch_5_ghz?: string;
  connected?: string;
  usage_24hr?: string;
  download?: string;
  upload?: string;
  mac_address?: string;
  first_seen?: string;
  last_seen?: string;
  port_count?: number;
  organizations?: { name: string; id?: number; description?: string; };
  download_bps?: number;
  upload_bps?: number;
  usage_mb?: number;
  bandwidth_utilization?: number;
}

export interface Port {
  id: string;
  number: number;
  status: 'active' | 'inactive' | 'blocked';
  vlan?: string;
  connectedDevice?: {
    name: string;
    mac: string;
    type: string;
  };
}
