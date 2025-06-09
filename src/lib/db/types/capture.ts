
import { Json } from "@/integrations/supabase/types";

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
  user?: string; // Alternative field name used in some components
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
  // Additional fields used by components
  cpu_limit?: number;
  bandwidth_limit_mbps?: number;
  measure_method?: 'average' | 'peak';
  excluded_switches?: {
    names: string[];
    ip_ranges: string[];
  };
  excluded_mac_addresses?: string[];
  relay_switches?: Array<{
    name: string;
    ip: string;
  }>;
  notify_on_low_resources?: boolean;
  notify_on_peak?: boolean;
  reboot_wait_minutes?: number;
  uptime_alert_threshold_minutes?: number;
  connection_up_required?: boolean;
  port_types?: {
    access?: boolean;
    trunk?: boolean;
    hybrid?: boolean;
  };
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
  fail_safe?: FailSafeSettings;
  // Legacy compatibility fields
  max_file_size_mb?: number;
  rotation_interval_minutes?: number;
  retention_days?: number;
  compression_enabled?: boolean;
  auto_start?: boolean;
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
