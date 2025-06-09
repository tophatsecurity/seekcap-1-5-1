import { Asset, NetworkDevice } from '@/lib/db/types';

export const generateDetailedSampleAssets = (): Asset[] => {
  // Weighted vendor distribution favoring Rockwell
  const vendors = [
    { name: "Rockwell Automation", weight: 35 },
    { name: "Allen-Bradley", weight: 25 },
    { name: "Siemens", weight: 15 },
    { name: "Schneider Electric", weight: 8 },
    { name: "ABB", weight: 5 },
    { name: "Emerson", weight: 4 },
    { name: "Honeywell", weight: 3 },
    { name: "Johnson Controls", weight: 2 },
    { name: "Cisco", weight: 1.5 },
    { name: "GE", weight: 1 },
    { name: "Mitsubishi", weight: 0.3 },
    { name: "Omron", weight: 0.2 }
  ];

  const deviceTypes = ["PLC", "HMI", "Switch", "Router", "Sensor", "Actuator", "Drive", "Controller", "Gateway", "Workstation", "RTU", "SCADA Server"];
  
  // Protocol distribution favoring Modbus
  const protocols = [
    { name: "Modbus TCP", weight: 40 },
    { name: "EtherNet/IP", weight: 25 },
    { name: "DNP3", weight: 15 },
    { name: "PROFINET", weight: 8 },
    { name: "BACnet", weight: 4 },
    { name: "OPC UA", weight: 3 },
    { name: "MQTT", weight: 3 },
    { name: "HTTP", weight: 1.5 },
    { name: "SNMP", weight: 0.5 }
  ];
  
  const experiences: ("Excellent" | "Good" | "Fair" | "Poor")[] = ["Excellent", "Good", "Fair", "Poor"];
  const technologies = ["Ethernet", "Wi-Fi", "Fiber", "Serial"];

  // Extended network blocks to accommodate 1812 devices
  const networkBlocks = [
    { subnet: "10.0.1", maxDevices: 250, type: "Production Floor A" },
    { subnet: "10.0.2", maxDevices: 250, type: "Production Floor B" },
    { subnet: "10.0.3", maxDevices: 250, type: "Production Floor C" },
    { subnet: "10.0.4", maxDevices: 250, type: "Production Floor D" },
    { subnet: "192.168.1", maxDevices: 200, type: "Control Systems" },
    { subnet: "192.168.10", maxDevices: 200, type: "SCADA Network" },
    { subnet: "192.168.20", maxDevices: 150, type: "Office Network" },
    { subnet: "172.16.5", maxDevices: 150, type: "Management Network" },
    { subnet: "172.16.6", maxDevices: 112, type: "Remote Monitoring" }
  ];

  const getWeightedRandom = (items: { name: string; weight: number }[]) => {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const item of items) {
      random -= item.weight;
      if (random <= 0) return item;
    }
    return items[0];
  };
  
  const sampleAssets: Asset[] = [];
  let assetIndex = 0;

  networkBlocks.forEach((block) => {
    for (let i = 0; i < block.maxDevices; i++) {
      const vendor = getWeightedRandom(vendors);
      const protocol = getWeightedRandom(protocols);
      const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
      const hostId = Math.floor(Math.random() * 250) + 2; // Start from .2 to avoid gateway conflicts
      const experience = experiences[Math.floor(Math.random() * experiences.length)];
      const technology = technologies[Math.floor(Math.random() * technologies.length)];
      
      const baseDate = new Date();
      const firstSeen = new Date(baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      const lastSeen = new Date(baseDate.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      
      // Generate consistent device naming with vendor prefix
      const vendorPrefix = vendor.name === "Rockwell Automation" ? "RA" : 
                          vendor.name === "Allen-Bradley" ? "AB" : 
                          vendor.name.substring(0, 2).toUpperCase();
      
      sampleAssets.push({
        mac_address: `${vendorPrefix}:${assetIndex.toString(16).padStart(2, '0').toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}`,
        name: `${deviceType.replace(/\s+/g, '-')}-${vendorPrefix}-${String(assetIndex + 1).padStart(4, '0')}`,
        device_type: deviceType,
        src_ip: `${block.subnet}.${hostId}`,
        ip_address: `${block.subnet}.${hostId}`,
        vendor: vendor.name,
        first_seen: firstSeen.toISOString(),
        last_seen: lastSeen.toISOString(),
        eth_proto: protocol.name.includes("TCP") ? "TCP" : protocol.name.includes("UDP") ? "UDP" : "TCP",
        icmp: Math.random() > 0.7,
        experience: experience,
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
        connection: Math.random() > 0.1 ? "Connected" : "Disconnected",
        network: `${block.type}`,
        wifi: technology === "Wi-Fi" ? `WiFi-${block.subnet.split('.').pop()}` : null,
        scada_protocols: protocol.name.includes("Modbus") || protocol.name.includes("DNP3") || protocol.name.includes("EtherNet/IP") ? [protocol.name] : undefined,
        organizations: {
          name: block.type,
          id: Math.floor(Math.random() * 10) + 1
        }
      });
      assetIndex++;
    }
  });

  return sampleAssets;
};

export const generateRealisticNetworkDevices = (): NetworkDevice[] => {
  const switchVendors = [
    { name: "Rockwell Automation", models: ["Stratix 5700", "Stratix 5400", "Stratix 2500", "ArmorStratix 5700"] },
    { name: "Allen-Bradley", models: ["1783-HMS4C4CGN", "1783-BMS06TA", "1783-BMS10CGL", "1783-HMS4EG8CGR"] },
    { name: "Cisco", models: ["Catalyst 9300-24P", "Catalyst 2960-48P", "IE-3400-8T2S"] },
    { name: "Siemens", models: ["SCALANCE X204-2", "SCALANCE X308-2", "SCALANCE XM416-4C"] }
  ];
  
  const routerVendors = [
    { name: "Rockwell Automation", models: ["Allen-Bradley 1783-NATR", "Stratix 5950"] },
    { name: "Cisco", models: ["ISR4431", "IE-3400-8T2S"] }
  ];

  const portConfigurations = [
    { count: 24, type: "24-port" },
    { count: 48, type: "48-port" },
    { count: 16, type: "16-port" },
    { count: 8, type: "8-port" }
  ];
  
  const devices: NetworkDevice[] = [];
  
  // Generate core routers with Rockwell focus
  for (let i = 0; i < 3; i++) {
    const vendor = i < 2 ? routerVendors.find(v => v.name === "Rockwell Automation") || routerVendors[0] : routerVendors[1];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    
    devices.push({
      id: i + 1,
      name: `Core-Router-${vendor.name.includes("Rockwell") ? "RA" : "Cisco"}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Router",
      ip_address: `10.0.0.${i + 1}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:00:00:01`,
      status: Math.random() > 0.05 ? "Online" : "Offline",
      application: `${vendor.name} ${model}`,
      uplink: null,
      parent_device: null,
      connected: Math.floor(Math.random() * 200) + 100,
      experience: ["Excellent", "Good"][Math.floor(Math.random() * 2)] as "Excellent" | "Good" | "Fair" | "Poor",
      download: `${Math.floor(Math.random() * 5000) + 2000}Mbps`,
      upload: `${Math.floor(Math.random() * 2000) + 1000}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 100) + 20}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  // Generate distribution switches with Rockwell/Allen-Bradley focus
  for (let i = 0; i < 12; i++) {
    const vendor = i < 8 ? switchVendors.find(v => v.name.includes("Rockwell") || v.name.includes("Allen-Bradley")) || switchVendors[0] : switchVendors[Math.floor(Math.random() * switchVendors.length)];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    const portConfig = portConfigurations[Math.floor(Math.random() * portConfigurations.length)];
    
    devices.push({
      id: devices.length + 1,
      name: `Dist-Switch-${vendor.name.includes("Rockwell") ? "RA" : vendor.name.includes("Allen") ? "AB" : vendor.name.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Distribution Switch",
      ip_address: `10.0.${Math.floor(i / 4) + 1}.${(i % 4) + 10}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:01:00:01`,
      status: Math.random() > 0.1 ? "Online" : "Offline",
      application: `${vendor.name} ${model} (${portConfig.type})`,
      uplink: devices[i % 3]?.name || devices[0]?.name || null,
      parent_device: devices[i % 3]?.name || devices[0]?.name || null,
      connected: Math.floor(Math.random() * portConfig.count * 0.8) + Math.floor(portConfig.count * 0.2),
      experience: ["Excellent", "Good", "Fair"][Math.floor(Math.random() * 3)] as "Excellent" | "Good" | "Fair" | "Poor",
      download: `${Math.floor(Math.random() * 2000) + 500}Mbps`,
      upload: `${Math.floor(Math.random() * 1000) + 200}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 50) + 10}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      port_count: portConfig.count
    });
  }
  
  // Generate access switches
  for (let i = 0; i < 25; i++) {
    const vendor = i < 18 ? switchVendors.find(v => v.name.includes("Rockwell") || v.name.includes("Allen-Bradley")) || switchVendors[0] : switchVendors[Math.floor(Math.random() * switchVendors.length)];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    const portConfig = portConfigurations.filter(p => p.count <= 24)[Math.floor(Math.random() * 3)];
    const parentSwitch = devices.find(d => d.device_type === "Distribution Switch" && Math.random() > 0.3);
    
    devices.push({
      id: devices.length + 1,
      name: `Access-Switch-${vendor.name.includes("Rockwell") ? "RA" : vendor.name.includes("Allen") ? "AB" : vendor.name.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Access Switch",
      ip_address: `192.168.${Math.floor(i / 12) + 1}.${(i % 12) + 10}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:02:00:01`,
      status: Math.random() > 0.15 ? "Online" : "Offline",
      application: `${vendor.name} ${model} (${portConfig.type})`,
      uplink: parentSwitch?.name || null,
      parent_device: parentSwitch?.name || null,
      connected: Math.floor(Math.random() * portConfig.count * 0.7) + Math.floor(portConfig.count * 0.1),
      experience: ["Good", "Fair", "Poor", "Excellent"][Math.floor(Math.random() * 4)] as "Excellent" | "Good" | "Fair" | "Poor",
      download: `${Math.floor(Math.random() * 500) + 100}Mbps`,
      upload: `${Math.floor(Math.random() * 200) + 50}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 20) + 2}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      port_count: portConfig.count
    });
  }
  
  return devices;
};
