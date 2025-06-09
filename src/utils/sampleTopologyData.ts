import { Asset, NetworkDevice } from "@/lib/db/types";
import { generateDetailedSampleAssets as generateAssets } from "./generators/assetGenerator";

export function generateDetailedSampleAssets(): Asset[] {
  return generateAssets();
}

export function generateRealisticNetworkDevices(): NetworkDevice[] {
  // Generate network infrastructure to support 1819 assets
  const devices: NetworkDevice[] = [];
  
  // Core routers (3)
  for (let i = 0; i < 3; i++) {
    devices.push({
      id: i + 1,
      name: `Core-Router-${String(i + 1).padStart(2, '0')}`,
      device_type: "Router",
      ip_address: `10.0.0.${i + 1}`,
      status: "Online",
      download: "10 Gbps",
      upload: "10 Gbps",
      usage_24hr: `${50 + i * 10} GB`,
      port_count: 48,
      download_bps: 10000000000,
      upload_bps: 10000000000,
      usage_mb: (50 + i * 10) * 1000,
      bandwidth_utilization: 60 + Math.random() * 20,
      parent_device: undefined,
      experience: "Excellent",
      organizations: { name: "Network Infrastructure", id: 1 }
    });
  }

  // Distribution switches (15)
  for (let i = 0; i < 15; i++) {
    const parentRouter = Math.floor(i / 5);
    devices.push({
      id: i + 4,
      name: `Dist-Switch-${String(i + 1).padStart(2, '0')}`,
      device_type: "Switch",
      ip_address: `192.168.${Math.floor(i / 5) + 1}.${(i % 5) + 10}`,
      status: Math.random() > 0.05 ? "Online" : "Offline",
      download: `${800 + Math.random() * 400} Mbps`,
      upload: `${600 + Math.random() * 300} Mbps`,
      usage_24hr: `${20 + Math.random() * 15} GB`,
      port_count: 48,
      download_bps: (800 + Math.random() * 400) * 1000000,
      upload_bps: (600 + Math.random() * 300) * 1000000,
      usage_mb: (20 + Math.random() * 15) * 1000,
      bandwidth_utilization: 40 + Math.random() * 40,
      parent_device: `Core-Router-${String(parentRouter + 1).padStart(2, '0')}`,
      experience: Math.random() > 0.2 ? "Good" : "Fair",
      organizations: { name: "Network Infrastructure", id: 1 }
    });
  }

  // Access switches (60)
  for (let i = 0; i < 60; i++) {
    const parentDist = Math.floor(i / 4);
    devices.push({
      id: i + 19,
      name: `Access-Switch-${String(i + 1).padStart(3, '0')}`,
      device_type: "Switch",
      ip_address: `192.168.${Math.floor(parentDist / 5) + 1}.${100 + (i % 154)}`,
      status: Math.random() > 0.02 ? "Online" : "Offline",
      download: `${100 + Math.random() * 200} Mbps`,
      upload: `${80 + Math.random() * 120} Mbps`,
      usage_24hr: `${5 + Math.random() * 10} GB`,
      port_count: 24,
      download_bps: (100 + Math.random() * 200) * 1000000,
      upload_bps: (80 + Math.random() * 120) * 1000000,
      usage_mb: (5 + Math.random() * 10) * 1000,
      bandwidth_utilization: 20 + Math.random() * 50,
      parent_device: `Dist-Switch-${String(parentDist + 1).padStart(2, '0')}`,
      experience: Math.random() > 0.3 ? "Good" : "Fair",
      organizations: { name: "Network Infrastructure", id: 1 }
    });
  }

  // Access points (25)
  for (let i = 0; i < 25; i++) {
    const parentSwitch = Math.floor(i * 2.4); // Distribute across access switches
    devices.push({
      id: i + 79,
      name: `AccessPoint-${String(i + 1).padStart(3, '0')}`,
      device_type: "Access Point",
      ip_address: `192.168.${Math.floor(i / 8) + 1}.${200 + i}`,
      status: Math.random() > 0.03 ? "Online" : "Offline",
      download: `${300 + Math.random() * 200} Mbps`,
      upload: `${200 + Math.random() * 150} Mbps`,
      usage_24hr: `${8 + Math.random() * 12} GB`,
      port_count: 2,
      download_bps: (300 + Math.random() * 200) * 1000000,
      upload_bps: (200 + Math.random() * 150) * 1000000,
      usage_mb: (8 + Math.random() * 12) * 1000,
      bandwidth_utilization: 30 + Math.random() * 40,
      parent_device: `Access-Switch-${String(parentSwitch + 1).padStart(3, '0')}`,
      ch_24_ghz: String(Math.floor(Math.random() * 11) + 1),
      ch_5_ghz: String([36, 40, 44, 48, 149, 153, 157, 161][Math.floor(Math.random() * 8)]),
      experience: Math.random() > 0.25 ? "Good" : "Fair",
      organizations: { name: "Network Infrastructure", id: 1 }
    });
  }

  return devices;
}
