
import { Asset } from '@/lib/db/types';

export const generateSampleAssets = (): Asset[] => {
  // Diverse vendor distribution with realistic percentages
  const vendors = [
    { name: "Siemens", weight: 25 },
    { name: "Allen-Bradley", weight: 20 },
    { name: "Schneider Electric", weight: 15 },
    { name: "ABB", weight: 12 },
    { name: "Emerson", weight: 8 },
    { name: "Honeywell", weight: 6 },
    { name: "Johnson Controls", weight: 4 },
    { name: "Cisco", weight: 3 },
    { name: "HP", weight: 2 },
    { name: "Dell", weight: 2 },
    { name: "Rockwell", weight: 1.5 },
    { name: "GE", weight: 1 },
    { name: "Mitsubishi", weight: 0.3 },
    { name: "Omron", weight: 0.2 }
  ];

  // Industrial device types with SCADA focus
  const deviceTypes = [
    { type: "PLC", weight: 30, isScada: true },
    { type: "HMI", weight: 15, isScada: true },
    { type: "RTU", weight: 10, isScada: true },
    { type: "Switch", weight: 12, isScada: false },
    { type: "Router", weight: 8, isScada: false },
    { type: "Sensor", weight: 8, isScada: false },
    { type: "Actuator", weight: 5, isScada: false },
    { type: "Drive", weight: 4, isScada: false },
    { type: "Controller", weight: 3, isScada: false },
    { type: "Gateway", weight: 2, isScada: false },
    { type: "Workstation", weight: 2, isScada: false },
    { type: "SCADA Server", weight: 1, isScada: true }
  ];

  // SCADA protocols for industrial devices
  const scadaProtocols = ["Modbus TCP", "DNP3", "EtherNet/IP", "PROFINET", "BACnet", "OPC UA"];
  const standardProtocols = ["MQTT", "HTTP", "SNMP", "TCP", "UDP"];
  
  const experiences = ["Excellent", "Good", "Fair", "Poor"];
  const technologies = ["Ethernet", "Wi-Fi", "Fiber", "Serial"];

  // Diverse IP network blocks
  const networkBlocks = [
    { subnet: "10.0.1", count: 45 },
    { subnet: "10.0.2", count: 38 },
    { subnet: "192.168.1", count: 35 },
    { subnet: "192.168.10", count: 28 },
    { subnet: "172.16.5", count: 25 },
    { subnet: "10.1.100", count: 22 },
    { subnet: "192.168.50", count: 18 },
    { subnet: "172.20.10", count: 12 }
  ];

  // Weighted random selection function
  const getWeightedRandom = (items: { weight: number }[]) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= item.weight;
      if (random <= 0) return item;
    }
    return items[0];
  };

  const sampleAssets: Asset[] = [];
  let scadaDeviceCount = 0;
  const targetScadaDevices = 55;

  // Generate 223 assets
  for (let i = 0; i < 223; i++) {
    const vendor = getWeightedRandom(vendors);
    
    // Prioritize SCADA devices if we haven't reached the target
    let deviceType;
    if (scadaDeviceCount < targetScadaDevices) {
      const scadaTypes = deviceTypes.filter(d => d.isScada);
      deviceType = getWeightedRandom(scadaTypes);
      scadaDeviceCount++;
    } else {
      deviceType = getWeightedRandom(deviceTypes);
    }

    // Select network block with weighted distribution
    const networkBlock = getWeightedRandom(networkBlocks);
    const hostId = Math.floor(Math.random() * 200) + 10;
    
    const isScadaDevice = deviceType.isScada;
    const protocol = isScadaDevice 
      ? scadaProtocols[Math.floor(Math.random() * scadaProtocols.length)]
      : standardProtocols[Math.floor(Math.random() * standardProtocols.length)];
    
    const experience = getWeightedRandom([
      { name: "Excellent", weight: 40 },
      { name: "Good", weight: 35 },
      { name: "Fair", weight: 20 },
      { name: "Poor", weight: 5 }
    ]);
    
    const technology = getWeightedRandom([
      { name: "Ethernet", weight: 70 },
      { name: "Fiber", weight: 15 },
      { name: "Wi-Fi", weight: 10 },
      { name: "Serial", weight: 5 }
    ]);
    
    const baseDate = new Date();
    const firstSeen = new Date(baseDate.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
    const lastSeen = new Date(baseDate.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    
    // Generate realistic bandwidth based on device type
    const getBandwidthForDevice = (type: string) => {
      switch (type) {
        case "SCADA Server": return { download: Math.random() * 500000000 + 100000000, upload: Math.random() * 200000000 + 50000000 };
        case "PLC": return { download: Math.random() * 10000000 + 1000000, upload: Math.random() * 5000000 + 500000 };
        case "HMI": return { download: Math.random() * 50000000 + 10000000, upload: Math.random() * 20000000 + 5000000 };
        case "Switch": return { download: Math.random() * 1000000000 + 100000000, upload: Math.random() * 1000000000 + 100000000 };
        case "Router": return { download: Math.random() * 1000000000 + 500000000, upload: Math.random() * 1000000000 + 500000000 };
        default: return { download: Math.random() * 100000000 + 10000000, upload: Math.random() * 50000000 + 5000000 };
      }
    };

    const bandwidth = getBandwidthForDevice(deviceType.type);
    
    sampleAssets.push({
      mac_address: `${vendor.name.substring(0, 2).toUpperCase()}:${i.toString(16).padStart(2, '0').toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}`,
      name: `${deviceType.type.replace(/\s+/g, '-')}-${vendor.name.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      device_type: deviceType.type,
      src_ip: `${networkBlock.subnet}.${hostId}`,
      ip_address: `${networkBlock.subnet}.${hostId}`,
      vendor: vendor.name,
      first_seen: firstSeen.toISOString(),
      last_seen: lastSeen.toISOString(),
      eth_proto: protocol,
      icmp: Math.random() > 0.7,
      experience: experience.name as 'Excellent' | 'Good' | 'Fair' | 'Poor',
      technology: technology.name,
      signal_strength: technology.name === "Wi-Fi" ? Math.floor(Math.random() * 40) - 80 : null,
      channel: technology.name === "Wi-Fi" ? (Math.floor(Math.random() * 11) + 1).toString() : null,
      usage_mb: Math.floor(Math.random() * 10000) + 500,
      download_bps: bandwidth.download,
      upload_bps: bandwidth.upload,
      uptime: `${Math.floor(Math.random() * 365)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      channel_width: technology.name === "Wi-Fi" ? (Math.random() > 0.5 ? "20MHz" : "40MHz") : null,
      noise_floor: technology.name === "Wi-Fi" ? Math.floor(Math.random() * 20) - 100 : null,
      tx_rate: technology.name === "Wi-Fi" ? Math.floor(Math.random() * 150) + 50 : null,
      rx_rate: technology.name === "Wi-Fi" ? Math.floor(Math.random() * 150) + 50 : null,
      tx_power: technology.name === "Wi-Fi" ? Math.floor(Math.random() * 20) + 10 : null,
      distance: Math.floor(Math.random() * 1000) + 10,
      ccq: Math.floor(Math.random() * 100) + 1,
      airtime: technology.name === "Wi-Fi" ? Math.floor(Math.random() * 50) + 1 : null,
      connection: Math.random() > 0.15 ? "Connected" : "Disconnected",
      network: `Network-${networkBlock.subnet.split('.').pop()}`,
      wifi: technology.name === "Wi-Fi" ? `WiFi-${networkBlock.subnet.split('.').pop()}` : null,
    });
  }

  return sampleAssets;
};
