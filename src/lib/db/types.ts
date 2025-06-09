

import { Json } from "@/integrations/supabase/types";

export type Asset = {
  mac_address: string;
  src_ip?: string;
  eth_proto?: string;
  icmp?: boolean;
  ip_protocols?: string[];
  tcp_ports?: number[];
  udp_ports?: number[];
  scada_protocols?: string[];
  scada_data?: Record<string, any>;
  organization_id?: number;
  first_seen?: string;
  last_seen?: string;
  name?: string;
  vendor?: string;
  connection?: string;
  network?: string;
  wifi?: string;
  technology?: string;
  channel?: string;
  ip_address?: string;
  activity?: {
    download?: number;
    upload?: number;
    usage?: number;
  };
  download_bps?: number;
  upload_bps?: number;
  usage_mb?: number;
  uptime?: string;
  device_type?: string;
  channel_width?: string;
  signal_strength?: number;
  noise_floor?: number;
  tx_rate?: number;
  rx_rate?: number;
  tx_power?: number;
  distance?: number;
  ccq?: number;
  airtime?: number;
  organizations?: { name: string; id?: number; description?: string; };
};

export type Protocol = {
  protocol: string;
  count: number;
};

export type Subnet = {
  subnet: string;
  count: number;
};

export type ScadaInfo = {
  protocol: string;
  devices: number;
};

export type OuiInfo = {
  vendor: string;
  count: number;
};

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}

// Enhanced PCAP file type with additional properties
export interface EnhancedPcapFile {
  id: number;
  file_name: string;
  file_size_bytes: number;
  device_id: number | null;
  capture_start: string;
  capture_end: string | null;
  status: 'capturing' | 'completed' | 'failed' | 'processing';
  packet_count: number | null;
  storage_path: string;
  created_at: string;
  device?: {
    name: string;
    vendor: string;
  };
  protocols_detected: string[];
  server_location: string;
}

export interface ActiveCapture {
  id: number;
  switch: string;
  port: string;
  packetCount: number;
  duration: string;
  status: string;
  assignmentType: string;
}

export interface SystemLimit {
  id: number;
  parameter: string;
  currentValue: string;
  warningThreshold: string;
  criticalThreshold: string;
  status: string;
}

export interface CaptureAssignment {
  id: number;
  name: string;
  switches: string[];
  ports: string[];
  type: string;
  status: string;
  rotationInterval?: string;
  threshold?: string;
  protocols?: string[];
  alertOnNew?: boolean;
  minThreshold?: string;
  manualControl?: boolean;
}

// Network Device types
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

// Performance monitoring types
export interface DeviceLoadStats {
  id: number;
  device_name: string;
  load_avg_1m: number;
  load_avg_5m: number;
  load_avg_15m: number;
  memory_used_percent: number;
  storage_used_percent: number;
  traffic_in_mbps: number;
  traffic_out_mbps: number;
  collection_status: 'active' | 'halted' | 'limited';
  status_reason?: string;
  timestamp: string;
}

export type LoadDisplayMode = 'random' | 'hovered' | 'roundrobin';

// Organization types
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

// Capture device types - Updated to match component expectations
export interface CaptureDevice {
  id?: number;
  name: string;
  vendor: string;
  ip: string;
  port: number;
  protocol: string;
  enabled: boolean;
  credential_set: string;
  return_path_credential_set: string;
  capture_filter?: string;
  config?: {
    username?: string;
    password?: string;
    certificate?: string;
    enable_required?: boolean;
    enable_password?: string;
    auto_discovery?: boolean;
    advanced?: {
      raw_scada?: string;
      scada_protocols?: string[];
      interfaces?: string[];
    };
  };
  // Supabase fields
  ip_address?: string;
  status?: 'active' | 'inactive' | 'error';
  credential_set_id?: number;
  device_type?: 'tap' | 'span' | 'mirror';
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CredentialSet {
  id?: number;
  name: string;
  username: string;
  password: string;
  ssh_key?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ReturnPath {
  id?: number;
  name?: string;
  destination_ip: string;
  destination_port: number;
  protocol: 'tcp' | 'udp';
  enabled: boolean;
}

export interface AutoDiscoverySettings {
  id?: number;
  enabled: boolean;
  target_layers: ('datalink' | 'network' | 'transport' | 'application')[];
  start_layer: 'datalink' | 'network' | 'transport' | 'application';
  discovery_interval: number;
  max_devices: number;
  discovery_protocols: {
    cdp: boolean;
    lldp: boolean;
    arp: boolean;
    snmp: boolean;
    netbios: boolean;
    mdns: boolean;
  };
  subnet_scan: boolean;
  subnet_scan_range?: string;
  port_scan_enabled: boolean;
  port_scan_ports?: number[];
  credentials_to_try: string[];
  // Legacy fields for compatibility
  scan_interval_minutes?: number;
  ip_ranges?: string[];
  protocols?: string[];
  port_ranges?: string[];
}

export interface FailSafeSettings {
  id?: number;
  enabled: boolean;
  cpu_threshold: number;
  memory_threshold: number;
  disk_threshold: number;
  network_threshold: number;
  action: 'stop' | 'throttle' | 'alert';
}

export interface CaptureSettings {
  id?: number;
  capture_directory: string;
  storage_mode: string;
  capture_server: { hostname: string; ip: string };
  storage_timeout: number;
  return_paths: {
    scp: ReturnPath;
    ftp: ReturnPath;
    tftp: ReturnPath;
    direct: ReturnPath;
  };
  credentials: Record<string, CredentialSet>;
  devices: CaptureDevice[];
  vendors: Record<string, { enabled: boolean }>;
  interface_commands: Record<string, string>;
  capture_commands: Record<string, string>;
  stop_capture_commands: Record<string, string>;
  remove_pcap_commands: Record<string, string>;
  tmp_directories: Record<string, string>;
  interface_regex: Record<string, string>;
  extract_pcap_commands: Record<string, Array<{
    method: string;
    command: string;
    storage_path: string;
  }>>;
  auto_discovery?: AutoDiscoverySettings;
  // Legacy compatibility fields
  max_file_size_mb?: number;
  rotation_interval_minutes?: number;
  retention_days?: number;
  compression_enabled?: boolean;
  auto_start?: boolean;
}

