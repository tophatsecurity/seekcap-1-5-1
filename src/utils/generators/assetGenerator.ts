
import { Asset } from "@/lib/db/types";
import { vendorData, weightedRandom } from "./vendorData";
import { subnetData, deviceTypes, generateMacAddress, generateIpFromSubnet } from "./networkData";
import { scadaProtocols } from "./protocolData";

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
