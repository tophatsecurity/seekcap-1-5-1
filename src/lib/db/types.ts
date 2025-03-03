
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
};

export type CaptureDevice = {
  name: string;
  vendor: string;
  ip: string;
  port: number;
  protocol: string;
  enabled: boolean;
  credential_set: string;
  return_path_credential_set: string;
  capture_filter: string;
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
};

export type CredentialSet = {
  user: string;
  password?: string;
  certificate?: string;
  enable_required: boolean;
  enable_password?: string;
};

export type ReturnPath = {
  enabled: boolean;
  base_path: string;
  ip?: string;
  host?: string;
  port?: number;
  credentials?: string;
};

export type CaptureSettings = {
  capture_directory: string;
  storage_mode: string;
  capture_server: {
    hostname: string;
    ip: string;
  };
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
};

export type AutoDiscoverySettings = {
  enabled: boolean;
  target_layers: ("datalink" | "network" | "transport" | "application")[];
  start_layer: "datalink" | "network" | "transport" | "application";
  discovery_interval: number; // in minutes
  max_devices: number;
  discovery_protocols: {
    cdp: boolean; // Cisco Discovery Protocol
    lldp: boolean; // Link Layer Discovery Protocol
    arp: boolean; // Address Resolution Protocol
    snmp: boolean; // Simple Network Management Protocol
    netbios: boolean; // NetBIOS
    mdns: boolean; // Multicast DNS
  };
  subnet_scan: boolean;
  subnet_scan_range?: string; // CIDR notation
  port_scan_enabled: boolean;
  port_scan_ports?: number[];
  credentials_to_try: string[]; // References to credential_set names
};

export type OuiInfo = {
  vendor: string;
  count: number;
};

export type JsonTreeNode = {
  key: string;
  value: any;
  type: string;
  children?: JsonTreeNode[];
  isExpanded?: boolean;
};

// Organization related types
export type Organization = {
  id: number;
  name: string;
  description?: string;
  created_at: string;
};

export type OrganizationIpRange = {
  id: number;
  organization_id: number;
  network: string;
  netmask: string;
  description?: string;
};

export type OrganizationVendor = {
  id: number;
  organization_id: number;
  vendor: string;
  description?: string;
};

// NetworkDevice type for the comprehensive network device information
export type NetworkDevice = {
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
  connected?: number;
  experience?: string;
  usage_24hr?: string;
  download?: string;
  upload?: string;
  mac_address?: string;
  last_seen?: string;
  first_seen?: string;
  organization_id?: number;
  organizations?: { name: string; id?: number; description?: string; };
};
