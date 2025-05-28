
import { Asset, NetworkDevice } from '@/lib/db/types';

export const generateDetailedSampleAssets = (): Asset[] => {
  const vendors = ["Siemens", "Allen-Bradley", "Schneider Electric", "ABB", "Emerson", "Honeywell", "Johnson Controls", "Cisco", "HP", "Dell", "Rockwell", "GE", "Mitsubishi", "Omron"];
  const deviceTypes = ["PLC", "HMI", "Switch", "Router", "Sensor", "Actuator", "Drive", "Controller", "Gateway", "Workstation", "RTU", "SCADA Server"];
  const protocols = ["Modbus TCP", "DNP3", "EtherNet/IP", "PROFINET", "BACnet", "OPC UA", "MQTT", "HTTP", "SNMP"];
  const experiences = ["Excellent", "Good", "Fair", "Poor"];
  const technologies = ["Ethernet", "Wi-Fi", "Fiber", "Serial"];
  
  const sampleAssets: Asset[] = [];

  for (let i = 0; i < 25; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const subnet = Math.floor(Math.random() * 4) + 1;
    const hostId = Math.floor(Math.random() * 200) + 10;
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const experience = experiences[Math.floor(Math.random() * experiences.length)];
    const technology = technologies[Math.floor(Math.random() * technologies.length)];
    
    const baseDate = new Date();
    const firstSeen = new Date(baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const lastSeen = new Date(baseDate.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    
    sampleAssets.push({
      mac_address: `${vendor.substring(0, 2).toUpperCase()}:${i.toString(16).padStart(2, '0').toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}`,
      name: `${deviceType.replace(/\s+/g, '-')}-${vendor.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      device_type: deviceType,
      src_ip: `192.168.${subnet}.${hostId}`,
      ip_address: `192.168.${subnet}.${hostId}`,
      vendor: vendor,
      first_seen: firstSeen.toISOString(),
      last_seen: lastSeen.toISOString(),
      eth_proto: Math.random() > 0.5 ? "TCP" : "UDP",
      icmp: Math.random() > 0.7,
      experience: experience as 'Excellent' | 'Good' | 'Fair' | 'Poor',
      technology: technology,
      signal_strength: technology === "Wi-Fi" ? Math.floor(Math.random() * 40) - 80 : null,
      channel: technology === "Wi-Fi" ? (Math.floor(Math.random() * 11) + 1).toString() : null,
      usage_mb: Math.floor(Math.random() * 5000) + 100,
      download_bps: Math.floor(Math.random() * 1000000000) + 1000000,
      upload_bps: Math.floor(Math.random() * 500000000) + 500000,
      uptime: `${Math.floor(Math.random() * 365)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      channel_width: technology === "Wi-Fi" ? (Math.random() > 0.5 ? "20MHz" : "40MHz") : null,
      noise_floor: technology === "Wi-Fi" ? Math.floor(Math.random() * 20) - 100 : null,
      tx_rate: technology === "Wi-Fi" ? Math.floor(Math.random() * 150) + 50 : null,
      rx_rate: technology === "Wi-Fi" ? Math.floor(Math.random() * 150) + 50 : null,
      tx_power: technology === "Wi-Fi" ? Math.floor(Math.random() * 20) + 10 : null,
      distance: Math.floor(Math.random() * 1000) + 10,
      ccq: Math.floor(Math.random() * 100) + 1,
      airtime: technology === "Wi-Fi" ? Math.floor(Math.random() * 50) + 1 : null,
      connection: Math.random() > 0.3 ? "Connected" : "Disconnected",
      network: `Network-${subnet}`,
      wifi: technology === "Wi-Fi" ? `WiFi-${subnet}` : null,
    });
  }

  return sampleAssets;
};

export const generateRealisticNetworkDevices = (): NetworkDevice[] => {
  const switchVendors = [
    { name: "Cisco", models: ["Catalyst 9300-24P", "Catalyst 2960-48P", "Nexus 9348GC-FXP", "Catalyst 3850-12X48U"] },
    { name: "Juniper", models: ["EX3400-24P", "EX4300-48P", "QFX5100-48S", "EX2300-24T"] },
    { name: "Arista", models: ["7050SX-64", "7280SR-48C6", "7050QX-32S", "7160-48YC6"] }
  ];
  
  const routerVendors = [
    { name: "Cisco", models: ["ISR4431", "ASR1001-X", "ISR4321"] },
    { name: "Juniper", models: ["MX204", "SRX300", "ACX5048"] }
  ];

  const portConfigurations = [
    { count: 24, type: "24-port" },
    { count: 48, type: "48-port" },
    { count: 12, type: "12-port" },
    { count: 32, type: "32-port" },
    { count: 64, type: "64-port" }
  ];
  
  const devices: NetworkDevice[] = [];
  
  // Generate core routers
  for (let i = 0; i < 2; i++) {
    const vendor = routerVendors[Math.floor(Math.random() * routerVendors.length)];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    
    devices.push({
      id: i + 1,
      name: `Core-Router-${vendor.name}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Router",
      ip_address: `10.0.0.${i + 1}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:00:00:01`,
      status: Math.random() > 0.1 ? "Online" : "Offline",
      application: `${vendor.name} ${model}`,
      uplink: null,
      parent_device: null,
      connected: Math.floor(Math.random() * 100) + 50,
      experience: ["Excellent", "Good"][Math.floor(Math.random() * 2)],
      download: `${Math.floor(Math.random() * 5000) + 1000}Mbps`,
      upload: `${Math.floor(Math.random() * 2000) + 500}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 50) + 10}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  // Generate distribution switches
  for (let i = 0; i < 4; i++) {
    const vendor = switchVendors[Math.floor(Math.random() * switchVendors.length)];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    const portConfig = portConfigurations[Math.floor(Math.random() * portConfigurations.length)];
    
    devices.push({
      id: devices.length + 1,
      name: `Dist-Switch-${vendor.name}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Distribution Switch",
      ip_address: `10.0.1.${i + 10}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:01:00:01`,
      status: Math.random() > 0.15 ? "Online" : "Offline",
      application: `${vendor.name} ${model} (${portConfig.type})`,
      uplink: devices[0]?.name || null,
      parent_device: devices[0]?.name || null,
      connected: Math.floor(Math.random() * portConfig.count * 0.8) + Math.floor(portConfig.count * 0.2),
      experience: ["Excellent", "Good", "Fair"][Math.floor(Math.random() * 3)],
      download: `${Math.floor(Math.random() * 2000) + 500}Mbps`,
      upload: `${Math.floor(Math.random() * 1000) + 200}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 25) + 5}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      port_count: portConfig.count
    });
  }
  
  // Generate access switches
  for (let i = 0; i < 8; i++) {
    const vendor = switchVendors[Math.floor(Math.random() * switchVendors.length)];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    const portConfig = portConfigurations.filter(p => p.count <= 48)[Math.floor(Math.random() * 3)];
    const parentSwitch = devices.find(d => d.device_type === "Distribution Switch");
    
    devices.push({
      id: devices.length + 1,
      name: `Access-Switch-${vendor.name}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Access Switch",
      ip_address: `192.168.${Math.floor(i / 4) + 1}.${(i % 4) + 10}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:02:00:01`,
      status: Math.random() > 0.2 ? "Online" : "Offline",
      application: `${vendor.name} ${model} (${portConfig.type})`,
      uplink: parentSwitch?.name || null,
      parent_device: parentSwitch?.name || null,
      connected: Math.floor(Math.random() * portConfig.count * 0.7) + Math.floor(portConfig.count * 0.1),
      experience: ["Good", "Fair", "Poor"][Math.floor(Math.random() * 3)],
      download: `${Math.floor(Math.random() * 500) + 100}Mbps`,
      upload: `${Math.floor(Math.random() * 200) + 50}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 10) + 2}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      port_count: portConfig.count
    });
  }
  
  return devices;
};
