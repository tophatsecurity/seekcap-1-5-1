
export type AssetType = {
  type: string;
  count: number;
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
