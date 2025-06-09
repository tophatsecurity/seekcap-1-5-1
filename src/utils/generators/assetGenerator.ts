
import { Asset } from "@/lib/db/types";

export function generateDetailedSampleAssets(): Asset[] {
  const vendors = [
    "Schneider Electric", "Siemens", "Rockwell Automation", "Allen-Bradley", 
    "ABB", "Emerson", "Honeywell", "GE", "Mitsubishi", "Omron",
    "Phoenix Contact", "Beckhoff", "Wago", "Pepperl+Fuchs", "Pilz",
    "Endress+Hauser", "Yokogawa", "Foxboro", "Wonderware", "Inductive Automation",
    "Red Lion", "Moxa", "Advantech", "B&R", "Tridium", "Johnson Controls",
    "Carrier", "Trane", "Liebert", "APC", "Eaton", "Vertiv", "Panduit",
    "Cisco", "HP", "Dell", "IBM", "Intel", "AMD", "NVIDIA"
  ];

  const deviceTypes = [
    "PLC", "HMI", "SCADA Server", "RTU", "Controller", "Sensor", "Actuator",
    "Drive", "Motor", "Pump", "Valve", "Switch", "Router", "Gateway",
    "Firewall", "Access Point", "Camera", "Monitor", "Workstation", "Server",
    "UPS", "PDU", "Environmental Monitor", "Safety System", "Emergency Stop",
    "Light Tower", "Beacon", "Alarm", "Interlock", "Relay"
  ];

  const protocols = [
    "Modbus TCP", "Modbus RTU", "EtherNet/IP", "Profinet", "Profibus",
    "DeviceNet", "CANopen", "AS-i", "IO-Link", "HART", "Foundation Fieldbus",
    "DNP3", "IEC 61850", "IEC 60870-5-104", "BACnet/IP", "LonWorks",
    "OPC UA", "OPC DA", "DDE", "TCP/IP", "UDP", "HTTP", "HTTPS", "FTP",
    "Telnet", "SSH", "SNMP", "MQTT", "CoAP", "WebSocket"
  ];

  const subnets = [
    "192.168.1", "192.168.2", "192.168.3", "192.168.4", "192.168.5",
    "192.168.10", "192.168.20", "192.168.30", "192.168.50", "192.168.100",
    "10.0.1", "10.0.2", "10.0.3", "10.1.1", "10.1.2", "10.2.1", "10.2.2",
    "172.16.1", "172.16.2", "172.17.1", "172.18.1", "172.19.1"
  ];

  const assets: Asset[] = [];

  for (let i = 0; i < 1819; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const subnet = subnets[Math.floor(Math.random() * subnets.length)];
    const hostId = Math.floor(Math.random() * 254) + 1;
    
    // Generate realistic MAC address
    const macSegments = [];
    for (let j = 0; j < 6; j++) {
      macSegments.push(Math.floor(Math.random() * 256).toString(16).padStart(2, '0'));
    }
    const macAddress = macSegments.join(':');

    // Generate realistic bandwidth based on device type
    let baseBandwidth = 1000000; // 1 Mbps default
    if (deviceType.includes('Server') || deviceType.includes('SCADA')) {
      baseBandwidth = 100000000; // 100 Mbps
    } else if (deviceType.includes('Switch') || deviceType.includes('Router')) {
      baseBandwidth = 1000000000; // 1 Gbps
    } else if (deviceType.includes('HMI') || deviceType.includes('Workstation')) {
      baseBandwidth = 10000000; // 10 Mbps
    } else if (deviceType.includes('Sensor') || deviceType.includes('Actuator')) {
      baseBandwidth = 100000; // 100 Kbps
    }

    const downloadBps = baseBandwidth * (0.5 + Math.random() * 0.8);
    const uploadBps = downloadBps * (0.3 + Math.random() * 0.4);
    const usageMb = (downloadBps + uploadBps) / 8000 * Math.random() * 86400 / 1000000; // Daily usage in MB

    // Generate time stamps
    const lastSeenOffset = Math.random() * 7 * 24 * 60 * 60 * 1000; // Within last week
    const firstSeenOffset = lastSeenOffset + Math.random() * 90 * 24 * 60 * 60 * 1000; // Up to 90 days before last seen

    assets.push({
      mac_address: macAddress,
      name: `${deviceType}-${String(i + 1).padStart(4, '0')}`,
      src_ip: `${subnet}.${hostId}`,
      ip_address: `${subnet}.${hostId}`,
      vendor: vendor,
      device_type: deviceType,
      eth_proto: protocol,
      connection: Math.random() > 0.1 ? 'Connected' : 'Disconnected',
      technology: "Ethernet",
      channel: String(Math.floor(Math.random() * 11) + 1),
      download_bps: Math.floor(downloadBps),
      upload_bps: Math.floor(uploadBps),
      usage_mb: Math.floor(usageMb),
      signal_strength: Math.floor(-30 - Math.random() * 40), // -30 to -70 dBm
      uptime: `${Math.floor(Math.random() * 30)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      last_seen: new Date(Date.now() - lastSeenOffset).toISOString(),
      first_seen: new Date(Date.now() - firstSeenOffset).toISOString(),
      distance: Math.floor(Math.random() * 100) + 1,
      tx_rate: Math.floor(Math.random() * 1000) + 10,
      rx_rate: Math.floor(Math.random() * 1000) + 10,
      ccq: Math.floor(Math.random() * 30) + 70, // 70-100%
      airtime: Math.floor(Math.random() * 50) + 5, // 5-55%
      scada_protocols: Math.random() > 0.7 ? [protocol] : [],
      organizations: { 
        name: `Plant ${String.fromCharCode(65 + Math.floor(i / 200))}`, 
        id: Math.floor(i / 200) + 1,
        description: `Industrial facility ${Math.floor(i / 200) + 1}`
      }
    });
  }

  return assets;
}
