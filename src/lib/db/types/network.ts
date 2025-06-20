
export interface NetworkDevice {
  id?: number;
  name: string;
  device_type: string;
  ip_address?: string;
  mac_address?: string;
  status?: string;
  parent_device?: string;
  uplink?: string;
  ch_24_ghz?: string;
  ch_5_ghz?: string;
  experience?: string;
  download?: string;
  upload?: string;
  usage_24hr?: string;
  application?: string;
  connected?: number;
  first_seen?: string;
  last_seen?: string;
  organization_id?: number;
  // Additional properties used by components
  port_count?: number;
  download_bps?: number;
  upload_bps?: number;
  usage_mb?: number;
  bandwidth_utilization?: number;
  organizations?: {
    id: number;
    name: string;
    description?: string;
  };
}

export interface NetworkConnection {
  id?: number;
  source_device_id: number;
  target_device_id: number;
  connection_type: 'physical' | 'logical' | 'wireless';
  port?: string;
  bandwidth?: string;
  status?: 'active' | 'inactive' | 'down';
  created_at?: string;
  updated_at?: string;
}

export interface NetworkPort {
  id?: number;
  device_id: number;
  port_number: string;
  port_type: 'ethernet' | 'fiber' | 'wireless';
  status: 'up' | 'down' | 'disabled';
  speed?: string;
  duplex?: 'full' | 'half';
  vlan?: string;
  description?: string;
}

export interface VLANInfo {
  id?: number;
  vlan_id: number;
  name: string;
  description?: string;
  network_id?: number;
  created_at?: string;
  updated_at?: string;
}

// Port interface for DevicePortView
export interface Port {
  id: string;
  number: number;
  status: 'active' | 'inactive' | 'blocked';
  vlan?: string;
  connectedDevice?: {
    name: string;
    mac: string;
    ip?: string;
    type: string;
    bandwidth?: number;
    technology?: string;
  };
}
