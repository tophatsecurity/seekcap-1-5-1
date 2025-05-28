
export const generateSampleAssets = () => {
  const vendors = ["Siemens", "Allen-Bradley", "Schneider Electric", "ABB", "Emerson", "Honeywell", "Johnson Controls", "Cisco", "HP", "Dell"];
  const deviceTypes = ["PLC", "HMI", "Switch", "Router", "Sensor", "Actuator", "Drive", "Controller", "Gateway", "Workstation"];
  const sampleAssets = [];

  for (let i = 0; i < 50; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const subnet = Math.floor(Math.random() * 4) + 1;
    const hostId = Math.floor(Math.random() * 200) + 10;
    
    sampleAssets.push({
      mac_address: `AA:BB:CC:DD:EE:${i.toString(16).padStart(2, '0').toUpperCase()}`,
      name: `${deviceType}-${String(i + 1).padStart(3, '0')}`,
      device_type: deviceType.toLowerCase(),
      src_ip: `192.168.${subnet}.${hostId}`,
      vendor: vendor,
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      eth_proto: Math.random() > 0.5 ? "TCP" : "UDP",
      icmp: Math.random() > 0.7,
      experience: ["Good", "Fair", "Poor"][Math.floor(Math.random() * 3)],
      technology: Math.random() > 0.5 ? "Ethernet" : "Wi-Fi",
      signal_strength: Math.floor(Math.random() * 40) - 80,
      channel: Math.random() > 0.5 ? "6" : "11",
      usage_mb: Math.floor(Math.random() * 1000),
      download_bps: Math.floor(Math.random() * 1000000000) + 1000000,
      upload_bps: Math.floor(Math.random() * 500000000) + 500000,
    });
  }

  return sampleAssets;
};
