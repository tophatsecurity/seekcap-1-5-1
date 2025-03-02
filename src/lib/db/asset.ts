
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";
import { Asset } from "./types";

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
        scada_data: details.scada_data || {}
      };
    });

    for (const asset of assets) {
      await supabase
        .from('assets')
        .upsert({
          mac_address: asset.mac_address,
          src_ip: asset.src_ip,
          eth_proto: asset.eth_proto,
          icmp: asset.icmp
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
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
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
      .select('*')
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
