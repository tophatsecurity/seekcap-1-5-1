import { Asset, OuiInfo, Protocol, Subnet, ScadaInfo } from "@/lib/types";

// Weighted selection utility
interface WeightedItem {
  weight: number;
  [key: string]: any;
}

function weightedRandom<T extends WeightedItem>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }
  
  return items[items.length - 1];
}

// Define vendor data with weights
const vendorData = [
  { name: 'Cisco Systems', weight: 25 },
  { name: 'Siemens', weight: 20 },
  { name: 'Schneider Electric', weight: 15 },
  { name: 'Rockwell Automation', weight: 12 },
  { name: 'ABB', weight: 10 },
  { name: 'Honeywell', weight: 8 },
  { name: 'Emerson', weight: 5 },
  { name: 'Yokogawa', weight: 3 },
  { name: 'General Electric', weight: 2 }
];

// Define subnet data with weights
const subnetData = [
  { subnet: '192.168.1.0/24', weight: 30, name: 'Office Network' },
  { subnet: '10.0.1.0/24', weight: 25, name: 'Production Network' },
  { subnet: '172.16.1.0/24', weight: 20, name: 'Control Network' },
  { subnet: '192.168.100.0/24', weight: 15, name: 'Management Network' },
  { subnet: '10.10.1.0/24', weight: 10, name: 'SCADA Network' }
];

// Define device types
const deviceTypes = [
  'PLC', 'HMI', 'RTU', 'Gateway', 'Switch', 'Router', 
  'Workstation', 'Server', 'Sensor', 'Controller'
];

const scadaProtocols = [
  'Modbus TCP', 'DNP3', 'IEC 61850', 'OPC UA', 'Profinet', 
  'EtherNet/IP', 'BACnet', 'HART'
];

const generateMacAddress = () => {
  return Array.from({ length: 6 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join(':');
};

const generateIpFromSubnet = (subnet: string) => {
  const [network] = subnet.split('/');
  const [a, b, c] = network.split('.').map(Number);
  const host = Math.floor(Math.random() * 254) + 1;
  return `${a}.${b}.${c}.${host}`;
};

export const generateSampleAssets = (count: number = 223): Asset[] => {
  const assets: Asset[] = [];
  
  for (let i = 0; i < count; i++) {
    const vendor = weightedRandom(vendorData);
    const subnet = weightedRandom(subnetData);
    const isScada = i < 55; // First 55 are SCADA devices
    
    const deviceType = isScada ? 
      ['PLC', 'HMI', 'RTU', 'Gateway', 'Controller'][Math.floor(Math.random() * 5)] :
      deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    
    const experience: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 
      ['Excellent', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 4)] as 'Excellent' | 'Good' | 'Fair' | 'Poor';
    
    assets.push({
      mac_address: generateMacAddress(),
      src_ip: generateIpFromSubnet(subnet.subnet),
      ip_address: generateIpFromSubnet(subnet.subnet),
      name: `${deviceType}-${String(i + 1).padStart(3, '0')}`,
      vendor: vendor.name,
      device_type: deviceType,
      connection: Math.random() > 0.3 ? 'Ethernet' : 'WiFi',
      network: subnet.name,
      experience,
      technology: isScada ? 'Industrial' : 'IT',
      channel: Math.random() > 0.5 ? '2.4GHz' : '5GHz',
      download_bps: Math.floor(Math.random() * 1000000),
      upload_bps: Math.floor(Math.random() * 500000),
      usage_mb: Math.floor(Math.random() * 10000),
      signal_strength: Math.floor(Math.random() * 100) - 100,
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date().toISOString(),
      scada_protocols: isScada ? [scadaProtocols[Math.floor(Math.random() * scadaProtocols.length)]] : undefined,
      organizations: {
        name: subnet.name,
        id: Math.floor(Math.random() * 10) + 1
      }
    });
  }
  
  return assets;
};

export const generateDetailedSampleAssets = (count: number = 223): Asset[] => {
  const assets: Asset[] = [];

  for (let i = 0; i < count; i++) {
    const vendor = weightedRandom(vendorData);
    const subnet = weightedRandom(subnetData);
    const isScada = i < 55; // First 55 are SCADA devices

    const deviceType = isScada ?
      ['PLC', 'HMI', 'RTU', 'Gateway', 'Controller'][Math.floor(Math.random() * 5)] :
      deviceTypes[Math.floor(Math.random() * deviceTypes.length)];

    const experience: 'Excellent' | 'Good' | 'Fair' | 'Poor' =
      ['Excellent', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 4)] as 'Excellent' | 'Good' | 'Fair' | 'Poor';

    const eth_proto = ['IPv4', 'IPv6', 'ARP'][Math.floor(Math.random() * 3)];
    const ip_protocols = ['TCP', 'UDP', 'ICMP'].filter(() => Math.random() > 0.5);
    const tcp_ports = Array.from({ length: Math.floor(Math.random() * 5) }, () => Math.floor(Math.random() * 65535));
    const udp_ports = Array.from({ length: Math.floor(Math.random() * 3) }, () => Math.floor(Math.random() * 65535));
    const scada_data = isScada ? {
      protocol: scadaProtocols[Math.floor(Math.random() * scadaProtocols.length)],
      data_points: Math.floor(Math.random() * 100)
    } : undefined;

    assets.push({
      mac_address: generateMacAddress(),
      src_ip: generateIpFromSubnet(subnet.subnet),
      ip_address: generateIpFromSubnet(subnet.subnet),
      name: `${deviceType}-${String(i + 1).padStart(3, '0')}`,
      vendor: vendor.name,
      device_type: deviceType,
      connection: Math.random() > 0.3 ? 'Ethernet' : 'WiFi',
      network: subnet.name,
      experience,
      technology: isScada ? 'Industrial' : 'IT',
      channel: Math.random() > 0.5 ? '2.4GHz' : '5GHz',
      download_bps: Math.floor(Math.random() * 1000000),
      upload_bps: Math.floor(Math.random() * 500000),
      usage_mb: Math.floor(Math.random() * 10000),
      signal_strength: Math.floor(Math.random() * 100) - 100,
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date().toISOString(),
      scada_protocols: isScada ? [scadaProtocols[Math.floor(Math.random() * scadaProtocols.length)]] : undefined,
      organizations: {
        name: subnet.name,
        id: Math.floor(Math.random() * 10) + 1
      },
      eth_proto,
      ip_protocols,
      tcp_ports,
      udp_ports,
      scada_data,
      icmp: Math.random() > 0.8,
    });
  }

  return assets;
};

export const generateRealisticNetworkDevices = (count: number = 23): any[] => {
  const devices: any[] = [];

  for (let i = 0; i < count; i++) {
    const vendor = weightedRandom(vendorData);
    const subnet = weightedRandom(subnetData);
    const isScada = i < 5; // First few are SCADA devices

    const deviceType = isScada ?
      ['PLC', 'HMI', 'RTU', 'Gateway', 'Controller'][Math.floor(Math.random() * 5)] :
      ['Switch', 'Router', 'Access Point'][Math.floor(Math.random() * 3)];

    const experience: 'Excellent' | 'Good' | 'Fair' | 'Poor' =
      ['Excellent', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 4)] as 'Excellent' | 'Good' | 'Fair' | 'Poor';

    devices.push({
      name: `${deviceType}-${String(i + 1).padStart(3, '0')}`,
      device_type: deviceType,
      ip_address: generateIpFromSubnet(subnet.subnet),
      mac_address: generateMacAddress(),
      vendor: vendor.name,
      status: Math.random() > 0.2 ? 'active' : 'inactive',
      connected: Math.floor(Math.random() * 50),
      experience,
      usage_24hr: `${Math.floor(Math.random() * 100)} GB`,
      download: `${Math.floor(Math.random() * 50)} GB`,
      upload: `${Math.floor(Math.random() * 50)} GB`,
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date().toISOString(),
      organizations: {
        name: subnet.name,
        id: Math.floor(Math.random() * 10) + 1
      },
      download_bps: Math.floor(Math.random() * 1000000),
      upload_bps: Math.floor(Math.random() * 500000),
      usage_mb: Math.floor(Math.random() * 10000),
      bandwidth_utilization: Math.floor(Math.random() * 100),
      port_count: Math.floor(Math.random() * 24) + 1,
    });
  }

  return devices;
};

export const generateAssetTypes = (assets: Asset[]) => {
  const typeCount = assets.reduce((acc, asset) => {
    const type = asset.device_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(typeCount).map(([type, count]) => ({
    type,
    count
  }));
};

export const generateProtocols = (assets: Asset[]): Protocol[] => {
  const protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'SSH', 'FTP', 'SMTP', 'DNS'];
  return protocols.map(protocol => ({
    protocol,
    count: Math.floor(Math.random() * 50) + 10
  }));
};

export const generateSubnets = (): Subnet[] => {
  return subnetData.map(subnet => ({
    subnet: subnet.subnet,
    count: Math.floor(Math.random() * 50) + 10
  }));
};

export const generateScadaInfo = (assets: Asset[]): ScadaInfo[] => {
  const scadaAssets = assets.filter(asset => asset.scada_protocols && asset.scada_protocols.length > 0);
  const protocolCount = scadaAssets.reduce((acc, asset) => {
    asset.scada_protocols?.forEach(protocol => {
      acc[protocol] = (acc[protocol] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(protocolCount).map(([protocol, devices]) => ({
    protocol,
    devices
  }));
};

export const generateOuiInfo = (assets: Asset[]): OuiInfo[] => {
  const vendorCount = assets.reduce((acc, asset) => {
    const vendor = asset.vendor || 'Unknown';
    acc[vendor] = (acc[vendor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(vendorCount).map(([vendor, count]) => ({
    vendor,
    count
  }));
};
