
import { OuiInfo } from "../types";
import { getOuiVendor } from "../oui-lookup";

export function getOuiStats(macAddresses: string[]): OuiInfo[] {
  const vendorCounts: Record<string, number> = {};
  
  macAddresses.forEach(mac => {
    const vendor = getOuiVendor(mac);
    if (vendor !== "Unknown") { // Filter out Unknown vendors
      vendorCounts[vendor] = (vendorCounts[vendor] || 0) + 1;
    }
  });
  
  return Object.entries(vendorCounts)
    .map(([vendor, count]) => ({ vendor, count }))
    .sort((a, b) => b.count - a.count);
}
