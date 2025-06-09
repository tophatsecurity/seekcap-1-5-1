
import { assetsAPI, APIAsset } from "@/lib/api/assets";
import { Asset } from "./types";

// Transform API asset to our Asset type
export const transformAPIAsset = (apiAsset: APIAsset): Asset => ({
  mac_address: apiAsset.mac_address || apiAsset.id || '',
  name: apiAsset.hostname || 'Unknown',
  device_type: apiAsset.device_type || 'Unknown',
  src_ip: apiAsset.ip || null,
  ip_address: apiAsset.ip || null,
  vendor: apiAsset.vendor || 'Unknown',
  first_seen: apiAsset.timestamp_first_seen || new Date().toISOString(),
  last_seen: apiAsset.timestamp_last_seen || new Date().toISOString(),
  eth_proto: null,
  icmp: false,
  experience: 'Fair' as const,
  technology: null,
  signal_strength: null,
  channel: null,
  usage_mb: 0,
  download_bps: 0,
  upload_bps: 0,
  uptime: null,
  channel_width: null,
  noise_floor: null,
  tx_rate: null,
  rx_rate: null,
  tx_power: null,
  distance: null,
  ccq: null,
  airtime: null,
  connection: null,
  network: null,
  wifi: null,
});

export async function fetchAssetsFromAPI(): Promise<Asset[]> {
  try {
    const response = await assetsAPI.getAssets({ page_size: 1000 });
    return response.results.map(transformAPIAsset);
  } catch (error) {
    console.error("Error fetching assets from API:", error);
    return [];
  }
}
