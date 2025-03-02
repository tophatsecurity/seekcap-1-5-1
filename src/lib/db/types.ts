
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
};

export type CredentialSet = {
  user: string;
  password: string;
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
};
