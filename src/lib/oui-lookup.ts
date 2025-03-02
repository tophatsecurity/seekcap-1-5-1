
// Basic OUI (Organizationally Unique Identifier) mapping
// This is a simplified version - in a production app, you'd use a complete database
const ouiMapping: Record<string, string> = {
  "00:00:0C": "Cisco Systems",
  "00:01:42": "Cisco Systems",
  "00:03:6B": "Cisco Systems",
  "00:04:9A": "Cisco Systems",
  "00:05:9A": "Cisco Systems",
  "00:0A:41": "Cisco Systems",
  "00:0A:8A": "Cisco Systems",
  "00:0C:85": "Cisco Systems",
  "00:0D:65": "Cisco Systems",
  "00:0E:D6": "Cisco Systems",
  "00:50:F0": "Cisco Systems",
  "00:1A:A1": "Cisco Systems",
  "00:40:96": "Cisco Systems",
  "00:60:09": "Cisco Systems",
  "00:80:C7": "Cisco Systems",
  "00:11:24": "Apple",
  "00:14:51": "Apple",
  "00:16:CB": "Apple",
  "00:17:F2": "Apple",
  "00:1B:63": "Apple",
  "00:1C:B3": "Apple",
  "00:1D:4F": "Apple",
  "00:1E:52": "Apple",
  "00:1E:C2": "Apple",
  "00:19:5B": "D-Link Corporation",
  "00:1C:F0": "D-Link Corporation",
  "00:1E:58": "D-Link Corporation",
  "00:21:91": "D-Link Corporation",
  "00:22:B0": "D-Link Corporation",
  "00:24:01": "D-Link Corporation",
  "00:26:5A": "D-Link Corporation",
  "00:18:4D": "Netgear",
  "00:1B:2F": "Netgear",
  "00:1E:2A": "Netgear",
  "00:1F:33": "Netgear",
  "00:22:3F": "Netgear",
  "00:24:B2": "Netgear",
  "00:26:F2": "Netgear",
  "00:11:22": "Siemens",
  "00:0E:8C": "Siemens",
  "00:11:33": "Siemens",
  "00:90:40": "Siemens",
  "08:00:06": "Siemens",
  "00:40:7F": "Schneider Electric",
  "00:01:68": "Schneider Electric",
  "00:11:A9": "Schneider Electric",
  "00:E0:3C": "Schneider Electric",
  "00:0E:CF": "Profibus Nutzerorganisation e.V.",
  "00:0F:6C": "ADDI-DATA GmbH",
  "00:20:4C": "Mitsubishi Electric",
  "00:01:29": "DFI Inc.",
  "00:1D:9C": "Rockwell Automation",
  "00:1D:9E": "Rockwell Automation",
  "00:1D:9F": "Rockwell Automation",
  "00:1D:A0": "Rockwell Automation",
  "00:1D:A1": "Rockwell Automation",
  "00:1C:DF": "Belkin International Inc.",
  "08:00:27": "Oracle VirtualBox",
  "0A:00:27": "Oracle VirtualBox",
  "00:50:56": "VMware",
  "00:0C:29": "VMware",
  "00:05:69": "VMware",
  "00:1C:14": "VMware",
  "00:0F:FF": "Control4",
  "00:00:01": "Unknown",
};

export function getOuiVendor(macAddress: string): string {
  // Normalize MAC address format (convert to XX:XX:XX format for OUI)
  const normalizedMac = macAddress.toUpperCase().replace(/[^0-9A-F]/g, '');
  
  // Format as XX:XX:XX to match our mapping
  const oui = `${normalizedMac.slice(0, 2)}:${normalizedMac.slice(2, 4)}:${normalizedMac.slice(4, 6)}`;
  
  return ouiMapping[oui] || "Unknown";
}

import { OuiInfo } from "./types";

export function getOuiStats(macAddresses: string[]): OuiInfo[] {
  const vendorCounts: Record<string, number> = {};
  
  macAddresses.forEach(mac => {
    if (!mac) return; // Skip empty MAC addresses
    
    const vendor = getOuiVendor(mac);
    if (vendor !== "Unknown") { // Filter out Unknown vendors
      vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
    }
  });
  
  return Object.entries(vendorCounts)
    .map(([vendor, count]) => ({ vendor, count }))
    .sort((a, b) => b.count - a.count);
}
