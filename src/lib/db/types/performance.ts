
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
