import { Asset, OuiInfo, Protocol, Subnet, ScadaInfo } from "@/lib/db/types";

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

// Define vendor data with weights favoring Rockwell
const vendorData = [
  { name: 'Rockwell Automation', weight: 35 },
  { name: 'Allen-Bradley', weight: 25 },
  { name: 'Siemens', weight: 15 },
  { name: 'Schneider Electric', weight: 8 },
  { name: 'ABB', weight: 5 },
  { name: 'Honeywell', weight: 4 },
  { name: 'Emerson', weight: 3 },
  { name: 'General Electric', weight: 2 },
  { name: 'Yokogawa', weight: 2 },
  { name: 'Cisco Systems', weight: 1 }
];

// Define subnet data with weights for industrial networks
const subnetData = [
  { subnet: '10.0.1.0/24', weight: 20, name: 'Production Floor A' },
  { subnet: '10.0.2.0/24', weight: 20, name: 'Production Floor B' },
  { subnet: '10.0.3.0/24', weight: 15, name: 'Production Floor C' },
  { subnet: '192.168.1.0/24', weight: 15, name: 'Control Systems' },
  { subnet: '192.168.10.0/24', weight: 10, name: 'SCADA Network' },
  { subnet: '172.16.1.0/24', weight: 8, name: 'Management Network' },
  { subnet: '192.168.100.0/24', weight: 7, name: 'Office Network' },
  { subnet: '10.10.1.0/24', weight: 5, name: 'Remote Monitoring' }
];

// Define device types with industrial focus
const deviceTypes = [
  'PLC', 'HMI', 'RTU', 'Gateway', 'Switch', 'Router', 
  'Controller', 'Drive', 'Sensor', 'Actuator', 'Workstation', 'Server'
];

// Protocol data favoring Modbus
const scadaProtocols = [
  { name: 'Modbus TCP', weight: 40 },
  { name: 'EtherNet/IP', weight: 25 },
  { name: 'DNP3', weight: 15 },
  { name: 'PROFINET', weight: 8 },
  { name: 'BACnet', weight: 4 },
  { name: 'OPC UA', weight: 3 },
  { name: 'IEC 61850', weight: 3 },
  { name: 'HART', weight: 2 }
];

const generateMacAddress = (vendorName: string) => {
  const vendorPrefix = vendorName === "Rockwell Automation" ? "RA" : 
                      vendorName === "Allen-Bradley" ? "AB" : 
                      vendorName.substring(0, 2).toUpperCase();
  return `${vendorPrefix}:${Array.from({ length: 5 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join(':')}`;
};

const generateIpFromSubnet = (subnet: string) => {
  const [network] = subnet.split('/');
  const [a, b, c] = network.split('.').map(Number);
  const host = Math.floor(Math.random() * 250) + 2; // Avoid .0, .1, .255
  return `${a}.${b}.${c}.${host}`;
};

export const generateSampleAssets = (count: number = 1812): Asset[] => {
  const assets: Asset[] = [];
  
  for (let i = 0; i < count; i++) {
    const vendor = weightedRandom(vendorData);
    const subnet = weightedRandom(subnetData);
    const protocol = weightedRandom(scadaProtocols);
    const isScada = i < 1000; // First 1000 are SCADA devices
    
    const deviceType = isScada ? 
      ['PLC', 'HMI', 'RTU', 'Gateway', 'Controller', 'Drive'][Math.floor(Math.random() * 6)] :
      deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    
    const experienceOptions: ('Excellent' | 'Good' | 'Fair' | 'Poor')[] = ['Excellent', 'Good', 'Fair', 'Poor'];
    const experience = experienceOptions[Math.floor(Math.random() * experienceOptions.length)];
    
    const vendorPrefix = vendor.name === "Rockwell Automation" ? "RA" : 
                        vendor.name === "Allen-Bradley" ? "AB" : 
                        vendor.name.substring(0, 2).toUpperCase();
    
    const asset: Asset = {
      mac_address: generateMacAddress(vendor.name),
      src_ip: generateIpFromSubnet(subnet.subnet),
      ip_address: generateIpFromSubnet(subnet.subnet),
      name: `${deviceType}-${vendorPrefix}-${String(i + 1).padStart(4, '0')}`,
      vendor: vendor.name,
      device_type: deviceType,
      connection: Math.random() > 0.2 ? 'Connected' : 'Disconnected',
      network: subnet.name,
      experience,
      technology: isScada ? 'Industrial Ethernet' : 'Standard Ethernet',
      channel: Math.random() > 0.7 ? '2.4GHz' : '5GHz',
      download_bps: Math.floor(Math.random() * 1000000000) + 100000,
      upload_bps: Math.floor(Math.random() * 500000000) + 50000,
      usage_mb: Math.floor(Math.random() * 10000) + 100,
      signal_strength: Math.floor(Math.random() * 100) - 100,
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date().toISOString(),
      scada_protocols: isScada ? [protocol.name] : undefined,
      organizations: {
        name: subnet.name,
        id: Math.floor(Math.random() * 10) + 1
      },
      eth_proto: protocol.name.includes("TCP") ? "TCP" : protocol.name.includes("UDP") ? "UDP" : "TCP",
      icmp: Math.random() > 0.8,
      uptime: `${Math.floor(Math.random() * 365)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      ccq: Math.floor(Math.random() * 100) + 1,
      distance: Math.floor(Math.random() * 1000) + 10,
      airtime: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 1 : null,
      wifi: Math.random() > 0.8 ? `WiFi-${subnet.subnet.split('.')[2]}` : null
    };
    
    assets.push(asset);
  }
  
  return assets;
};

export const generateDetailedSampleAssets = (count: number = 1812): Asset[] => {
  const assets: Asset[] = [];

  for (let i = 0; i < count; i++) {
    const vendor = weightedRandom(vendorData);
    const subnet = weightedRandom(subnetData);
    const protocol = weightedRandom(scadaProtocols);
    const isScada = i < 1000; // First 1000 are SCADA devices

    const deviceType = isScada ?
      ['PLC', 'HMI', 'RTU', 'Gateway', 'Controller', 'Drive'][Math.floor(Math.random() * 6)] :
      deviceTypes[Math.floor(Math.random() * deviceTypes.length)];

    const experienceOptions: ('Excellent' | 'Good' | 'Fair' | 'Poor')[] = ['Excellent', 'Good', 'Fair', 'Poor'];
    const experience = experienceOptions[Math.floor(Math.random() * experienceOptions.length)];

    const vendorPrefix = vendor.name === "Rockwell Automation" ? "RA" : 
                        vendor.name === "Allen-Bradley" ? "AB" : 
                        vendor.name.substring(0, 2).toUpperCase();

    const eth_proto = protocol.name.includes("TCP") ? "TCP" : protocol.name.includes("UDP") ? "UDP" : "TCP";
    const ip_protocols = ['TCP', 'UDP', 'ICMP'].filter(() => Math.random() > 0.5);
    const tcp_ports = Array.from({ length: Math.floor(Math.random() * 5) }, () => Math.floor(Math.random() * 65535));
    const udp_ports = Array.from({ length: Math.floor(Math.random() * 3) }, () => Math.floor(Math.random() * 65535));
    const scada_data = isScada ? {
      protocol: protocol.name,
      data_points: Math.floor(Math.random() * 500) + 50
    } : undefined;

    const asset: Asset = {
      mac_address: generateMacAddress(vendor.name),
      src_ip: generateIpFromSubnet(subnet.subnet),
      ip_address: generateIpFromSubnet(subnet.subnet),
      name: `${deviceType}-${vendorPrefix}-${String(i + 1).padStart(4, '0')}`,
      vendor: vendor.name,
      device_type: deviceType,
      connection: Math.random() > 0.1 ? 'Connected' : 'Disconnected',
      network: subnet.name,
      experience,
      technology: isScada ? 'Industrial Ethernet' : 'Standard Ethernet',
      channel: Math.random() > 0.7 ? '2.4GHz' : '5GHz',
      download_bps: Math.floor(Math.random() * 1000000000) + 100000,
      upload_bps: Math.floor(Math.random() * 500000000) + 50000,
      usage_mb: Math.floor(Math.random() * 10000) + 100,
      signal_strength: Math.floor(Math.random() * 100) - 100,
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date().toISOString(),
      scada_protocols: isScada ? [protocol.name] : undefined,
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
      uptime: `${Math.floor(Math.random() * 365)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      ccq: Math.floor(Math.random() * 100) + 1,
      distance: Math.floor(Math.random() * 1000) + 10,
      airtime: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 1 : null,
      wifi: Math.random() > 0.8 ? `WiFi-${subnet.subnet.split('.')[2]}` : null
    };

    assets.push(asset);
  }

  return assets;
};

export const generateRealisticNetworkDevices = (count: number = 40): Asset[] => {
  const devices: Asset[] = [];

  for (let i = 0; i < count; i++) {
    const vendor = weightedRandom(vendorData);
    const subnet = weightedRandom(subnetData);
    const isScada = i < 10; // First few are SCADA devices

    const deviceType = isScada ?
      ['PLC', 'HMI', 'RTU', 'Gateway', 'Controller'][Math.floor(Math.random() * 5)] :
      ['Switch', 'Router', 'Access Point'][Math.floor(Math.random() * 3)];

    const experienceOptions: ('Excellent' | 'Good' | 'Fair' | 'Poor')[] = ['Excellent', 'Good', 'Fair', 'Poor'];
    const experience = experienceOptions[Math.floor(Math.random() * experienceOptions.length)];

    const vendorPrefix = vendor.name === "Rockwell Automation" ? "RA" : 
                        vendor.name === "Allen-Bradley" ? "AB" : 
                        vendor.name.substring(0, 2).toUpperCase();

    const asset: Asset = {
      mac_address: generateMacAddress(vendor.name),
      src_ip: generateIpFromSubnet(subnet.subnet),
      ip_address: generateIpFromSubnet(subnet.subnet),
      name: `${deviceType}-${vendorPrefix}-${String(i + 1).padStart(3, '0')}`,
      device_type: deviceType,
      vendor: vendor.name,
      connection: Math.random() > 0.1 ? 'Connected' : 'Disconnected',
      network: subnet.name,
      experience,
      technology: 'Industrial Ethernet',
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date().toISOString(),
      organizations: {
        name: subnet.name,
        id: Math.floor(Math.random() * 10) + 1
      },
      download_bps: Math.floor(Math.random() * 1000000000) + 100000,
      upload_bps: Math.floor(Math.random() * 500000000) + 50000,
      usage_mb: Math.floor(Math.random() * 10000) + 100,
    };

    devices.push(asset);
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
  const protocols = ['Modbus TCP', 'EtherNet/IP', 'DNP3', 'PROFINET', 'OPC UA', 'BACnet', 'TCP', 'UDP'];
  return protocols.map(protocol => ({
    protocol,
    count: Math.floor(Math.random() * 200) + 50
  }));
};

export const generateSubnets = (): Subnet[] => {
  return subnetData.map(subnet => ({
    subnet: subnet.subnet,
    count: Math.floor(Math.random() * 300) + 100
  }));
};

export const generateScadaInfo = (assets: Asset[]): ScadaInfo[] => {
  const scadaAssets = assets.filter(asset => 'scada_protocols' in asset && asset.scada_protocols && asset.scada_protocols.length > 0);
  const protocolCount = scadaAssets.reduce((acc, asset) => {
    if ('scada_protocols' in asset && asset.scada_protocols) {
      asset.scada_protocols.forEach(protocol => {
        acc[protocol] = (acc[protocol] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(protocolCount).map(([protocol, devices]) => ({
    protocol,
    devices: devices as number
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
    count: count as number
  }));
};
