
import { EnhancedPcapFile, ActiveCapture, SystemLimit, CaptureAssignment } from '@/lib/types';

export const generateSamplePcapFiles = (): EnhancedPcapFile[] => {
  const files: EnhancedPcapFile[] = [];
  const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP', 'DNS', 'SSH', 'FTP', 'SMTP', 'SNMP', 'Modbus', 'DNP3'];
  const devices = ['SW-Core-01', 'SW-Access-02', 'SW-DMZ-01', 'Router-Main', 'FW-Edge-01'];
  
  for (let i = 1; i <= 25; i++) {
    const captureStart = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const captureEnd = new Date(captureStart.getTime() + Math.random() * 24 * 60 * 60 * 1000);
    const packetCount = Math.floor(Math.random() * 100000) + 1000;
    const fileSize = Math.floor(Math.random() * 500000000) + 1000000;
    const device = devices[Math.floor(Math.random() * devices.length)];
    const detectedProtocols = protocols.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 2);
    
    files.push({
      id: i,
      file_name: `capture_${device.toLowerCase()}_${captureStart.toISOString().split('T')[0]}_${i.toString().padStart(3, '0')}.pcap`,
      file_size_bytes: fileSize,
      device_id: i,
      capture_start: captureStart.toISOString(),
      capture_end: captureEnd.toISOString(),
      status: ['completed', 'capturing', 'processing', 'failed'][Math.floor(Math.random() * 4)] as any,
      packet_count: packetCount,
      storage_path: `/var/captures/${device.toLowerCase()}/capture_${i.toString().padStart(3, '0')}.pcap`,
      created_at: captureStart.toISOString(),
      device: {
        name: device,
        vendor: ['Cisco', 'Juniper', 'HP', 'Dell', 'Fortinet'][Math.floor(Math.random() * 5)]
      },
      protocols_detected: detectedProtocols,
      server_location: ['Primary Storage Server', 'Backup Storage Server', 'Edge Server'][Math.floor(Math.random() * 3)]
    });
  }
  
  return files.sort((a, b) => new Date(b.capture_start).getTime() - new Date(a.capture_start).getTime());
};

export const generateActiveCaptures = (): ActiveCapture[] => [
  {
    id: 1,
    switch: "SW-Core-01",
    port: "GigE0/1",
    packetCount: 15420,
    duration: "00:23:15",
    status: "capturing",
    assignmentType: "Most Active"
  },
  {
    id: 2,
    switch: "SW-Access-02",
    port: "Fa0/12",
    packetCount: 8932,
    duration: "00:18:42",
    status: "capturing",
    assignmentType: "Protocol Hover"
  },
  {
    id: 3,
    switch: "SW-Core-01",
    port: "GigE0/24",
    packetCount: 45231,
    duration: "01:12:08",
    status: "processing",
    assignmentType: "Rotate"
  }
];

export const generateSystemLimits = (): SystemLimit[] => [
  {
    id: 1,
    parameter: "CPU Usage",
    currentValue: "65%",
    warningThreshold: "80%",
    criticalThreshold: "95%",
    status: "normal"
  },
  {
    id: 2,
    parameter: "Memory Usage",
    currentValue: "72%",
    warningThreshold: "85%",
    criticalThreshold: "95%",
    status: "normal"
  },
  {
    id: 3,
    parameter: "Bandwidth Utilization",
    currentValue: "1.2 Gbps",
    warningThreshold: "8 Gbps",
    criticalThreshold: "9.5 Gbps",
    status: "normal"
  },
  {
    id: 4,
    parameter: "Storage Space",
    currentValue: "450 GB",
    warningThreshold: "800 GB",
    criticalThreshold: "900 GB",
    status: "normal"
  },
  {
    id: 5,
    parameter: "Fulfillment Time",
    currentValue: "2.3 sec",
    warningThreshold: "30 sec",
    criticalThreshold: "60 sec",
    status: "normal"
  }
];

export const generateCaptureAssignments = (): CaptureAssignment[] => [
  {
    id: 1,
    name: "Core Network Monitoring",
    switches: ["SW-Core-01", "SW-Core-02"],
    ports: ["GigE0/1-24"],
    type: "Rotate",
    rotationInterval: "15 min",
    status: "active"
  },
  {
    id: 2,
    name: "High Traffic Analysis",
    switches: ["SW-Access-01", "SW-Access-02", "SW-Access-03"],
    ports: ["All Active"],
    type: "Most Active",
    threshold: "100 Mbps",
    status: "active"
  },
  {
    id: 3,
    name: "Protocol Inspection",
    switches: ["SW-DMZ-01"],
    ports: ["Fa0/1-12"],
    type: "Protocol Hover",
    protocols: ["HTTP", "HTTPS", "SSH"],
    status: "paused"
  },
  {
    id: 4,
    name: "New Device Detection",
    switches: ["SW-Access-*"],
    ports: ["All"],
    type: "New Ports",
    alertOnNew: true,
    status: "active"
  },
  {
    id: 5,
    name: "Baseline Monitoring",
    switches: ["SW-Edge-01"],
    ports: ["Fa0/20-24"],
    type: "Least Active",
    minThreshold: "1 Mbps",
    status: "active"
  },
  {
    id: 6,
    name: "Manual Override",
    switches: ["SW-Lab-01"],
    ports: ["GigE0/1"],
    type: "Hover",
    manualControl: true,
    status: "standby"
  }
];
