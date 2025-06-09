
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
