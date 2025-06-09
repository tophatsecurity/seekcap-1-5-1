import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";
import { Asset } from "./types";
import { assetsAPI, APIAsset } from "@/lib/api/assets";

// Transform API asset to our Asset type
const transformAPIAsset = (apiAsset: APIAsset): Asset => ({
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

export async function importAssetData(data: Record<string, any>) {
  try {
    const assets = Object.entries(data).map(([mac, details]: [string, any]) => {
      return {
        mac_address: mac,
        src_ip: details.src_ip || null,
        eth_proto: details.eth_proto || null,
        icmp: details.icmp || false,
        ip_protocols: details.ip_protocols || [],
        tcp_ports: details.tcp_ports || [],
        udp_ports: details.udp_ports || [],
        scada_protocols: details.scada_protocols || [],
        scada_data: details.scada_data || {},
        name: details.name || null,
        vendor: details.vendor || null,
        connection: details.connection || null,
        network: details.network || null,
        wifi: details.wifi || null,
        experience: details.experience || null,
        technology: details.technology || null,
        channel: details.channel || null,
        ip_address: details.ip_address || details.src_ip || null,
        download_bps: details.download_bps || details.activity?.download || 0,
        upload_bps: details.upload_bps || details.activity?.upload || 0,
        usage_mb: details.usage_mb || details.activity?.usage || 0,
        uptime: details.uptime || null,
        device_type: details.device_type || null,
        channel_width: details.channel_width || null,
        signal_strength: details.signal_strength || null,
        noise_floor: details.noise_floor || null,
        tx_rate: details.tx_rate || null,
        rx_rate: details.rx_rate || null,
        tx_power: details.tx_power || null,
        distance: details.distance || null,
        ccq: details.ccq || null,
        airtime: details.airtime || null
      };
    });

    for (const asset of assets) {
      await supabase
        .from('assets')
        .upsert({
          mac_address: asset.mac_address,
          src_ip: asset.src_ip,
          eth_proto: asset.eth_proto,
          icmp: asset.icmp,
          name: asset.name,
          vendor: asset.vendor,
          connection: asset.connection,
          network: asset.network,
          wifi: asset.wifi,
          experience: asset.experience,
          technology: asset.technology,
          channel: asset.channel,
          ip_address: asset.ip_address,
          download_bps: asset.download_bps,
          upload_bps: asset.upload_bps,
          usage_mb: asset.usage_mb,
          uptime: asset.uptime,
          device_type: asset.device_type,
          channel_width: asset.channel_width,
          signal_strength: asset.signal_strength,
          noise_floor: asset.noise_floor,
          tx_rate: asset.tx_rate,
          rx_rate: asset.rx_rate,
          tx_power: asset.tx_power,
          distance: asset.distance,
          ccq: asset.ccq,
          airtime: asset.airtime
        });

      if (asset.ip_protocols && asset.ip_protocols.length > 0) {
        for (const protocol of asset.ip_protocols) {
          await supabase
            .from('ip_protocols')
            .upsert({
              asset_mac: asset.mac_address,
              protocol: protocol
            }, { onConflict: 'asset_mac, protocol' });
        }
      }

      if (asset.tcp_ports && asset.tcp_ports.length > 0) {
        for (const port of asset.tcp_ports) {
          await supabase
            .from('tcp_ports')
            .upsert({
              asset_mac: asset.mac_address,
              port: port
            }, { onConflict: 'asset_mac, port' });
        }
      }

      if (asset.udp_ports && asset.udp_ports.length > 0) {
        for (const port of asset.udp_ports) {
          await supabase
            .from('udp_ports')
            .upsert({
              asset_mac: asset.mac_address,
              port: port
            }, { onConflict: 'asset_mac, port' });
        }
      }

      if (asset.scada_protocols && asset.scada_protocols.length > 0) {
        for (const protocol of asset.scada_protocols) {
          await supabase
            .from('scada_protocols')
            .upsert({
              asset_mac: asset.mac_address,
              protocol: protocol
            }, { onConflict: 'asset_mac, protocol' });
        }
      }

      if (asset.scada_data && Object.keys(asset.scada_data).length > 0) {
        for (const [key, value] of Object.entries(asset.scada_data)) {
          await supabase
            .from('scada_data')
            .upsert({
              asset_mac: asset.mac_address,
              key: key,
              value: value as Json
            }, { onConflict: 'asset_mac, key' });
        }
      }
    }

    return { success: true, count: assets.length };
  } catch (error) {
    console.error("Error importing data:", error);
    toast({
      title: "Error importing data",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

export async function fetchAssets() {
  try {
    // First try to get assets from API
    const apiAssets = await fetchAssetsFromAPI();
    if (apiAssets.length > 0) {
      console.log(`Found ${apiAssets.length} assets from API`);
      return apiAssets;
    }

    // Fallback to database assets
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*, organizations(name)')
      .order('last_seen', { ascending: false });

    if (error) {
      console.error("Error in fetchAssets:", error);
      throw error;
    }
    
    if (!assets || assets.length === 0) {
      console.log("No assets found in the database");
    } else {
      console.log(`Found ${assets.length} assets in the database`);
    }
    
    return assets || [];
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
}

export async function fetchAssetDetails(macAddress: string) {
  try {
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('*, organizations(id, name, description)')
      .eq('mac_address', macAddress)
      .single();

    if (assetError) throw assetError;

    const { data: ipProtocols, error: ipError } = await supabase
      .from('ip_protocols')
      .select('protocol')
      .eq('asset_mac', macAddress);
    
    if (ipError) throw ipError;

    const { data: tcpPorts, error: tcpError } = await supabase
      .from('tcp_ports')
      .select('port')
      .eq('asset_mac', macAddress);
    
    if (tcpError) throw tcpError;

    const { data: udpPorts, error: udpError } = await supabase
      .from('udp_ports')
      .select('port')
      .eq('asset_mac', macAddress);
    
    if (udpError) throw udpError;

    const { data: scadaProtocols, error: scadaProtocolError } = await supabase
      .from('scada_protocols')
      .select('protocol')
      .eq('asset_mac', macAddress);
    
    if (scadaProtocolError) throw scadaProtocolError;

    const { data: scadaData, error: scadaDataError } = await supabase
      .from('scada_data')
      .select('key, value')
      .eq('asset_mac', macAddress);
    
    if (scadaDataError) throw scadaDataError;

    return {
      ...asset,
      ip_protocols: ipProtocols.map(p => p.protocol),
      tcp_ports: tcpPorts.map(p => p.port),
      udp_ports: udpPorts.map(p => p.port),
      scada_protocols: scadaProtocols.map(p => p.protocol),
      scada_data: scadaData.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, any>)
    };
  } catch (error) {
    console.error("Error fetching asset details:", error);
    return null;
  }
}

export async function updateAssetOrganization(macAddress: string, organizationId: number | null) {
  try {
    const { error } = await supabase
      .from('assets')
      .update({ organization_id: organizationId })
      .eq('mac_address', macAddress);

    if (error) throw error;
    
    toast({
      title: "Asset updated",
      description: "Organization assignment has been updated.",
    });
    
    return true;
  } catch (error) {
    console.error("Error updating asset organization:", error);
    toast({
      title: "Error updating asset",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

export async function fetchOrganizationAssets(organizationId: number) {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('organization_id', organizationId)
      .order('last_seen', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching assets for organization ${organizationId}:`, error);
    return [];
  }
}

export async function fetchAssetsByIpRange(network: string, netmask: string) {
  try {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .not('src_ip', 'is', null);

    if (error) throw error;
    
    const inRange = assets?.filter(asset => {
      if (!asset.src_ip) return false;
      
      const ipParts = asset.src_ip.split('.').map(part => parseInt(part, 10));
      const networkParts = network.split('.').map(part => parseInt(part, 10));
      const maskParts = netmask.split('.').map(part => parseInt(part, 10));
      
      for (let i = 0; i < 4; i++) {
        if ((ipParts[i] & maskParts[i]) !== (networkParts[i] & maskParts[i])) {
          return false;
        }
      }
      
      return true;
    });
    
    return inRange || [];
  } catch (error) {
    console.error(`Error fetching assets for IP range ${network}/${netmask}:`, error);
    return [];
  }
}

export async function fetchAssetsByVendor(vendor: string) {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .ilike('mac_address', `${vendor}%`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching assets for vendor ${vendor}:`, error);
    return [];
  }
}
