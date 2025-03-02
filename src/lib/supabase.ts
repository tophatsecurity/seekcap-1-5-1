
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export type Asset = {
  mac_address: string;
  src_ip?: string;
  eth_proto?: string;
  icmp?: boolean;
  ip_protocols?: string[];
  tcp_ports?: number[];
  udp_ports?: number[];
  scada_protocols?: string[];
  scada_data?: Record<string, any>;
};

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
      // Insert or update the asset
      await supabase
        .from('assets')
        .upsert({
          mac_address: asset.mac_address,
          src_ip: asset.src_ip,
          eth_proto: asset.eth_proto,
          icmp: asset.icmp
        });

      // Handle IP protocols
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

      // Handle TCP ports
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

      // Handle UDP ports
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

      // Handle SCADA protocols
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

      // Handle SCADA data
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

    if (error) throw error;
    return assets;
  } catch (error) {
    console.error("Error fetching assets:", error);
    return [];
  }
}

export async function fetchAssetDetails(macAddress: string) {
  try {
    // Fetch the base asset
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('*')
      .eq('mac_address', macAddress)
      .single();

    if (assetError) throw assetError;

    // Fetch IP protocols
    const { data: ipProtocols, error: ipError } = await supabase
      .from('ip_protocols')
      .select('protocol')
      .eq('asset_mac', macAddress);
    
    if (ipError) throw ipError;

    // Fetch TCP ports
    const { data: tcpPorts, error: tcpError } = await supabase
      .from('tcp_ports')
      .select('port')
      .eq('asset_mac', macAddress);
    
    if (tcpError) throw tcpError;

    // Fetch UDP ports
    const { data: udpPorts, error: udpError } = await supabase
      .from('udp_ports')
      .select('port')
      .eq('asset_mac', macAddress);
    
    if (udpError) throw udpError;

    // Fetch SCADA protocols
    const { data: scadaProtocols, error: scadaProtocolError } = await supabase
      .from('scada_protocols')
      .select('protocol')
      .eq('asset_mac', macAddress);
    
    if (scadaProtocolError) throw scadaProtocolError;

    // Fetch SCADA data
    const { data: scadaData, error: scadaDataError } = await supabase
      .from('scada_data')
      .select('key, value')
      .eq('asset_mac', macAddress);
    
    if (scadaDataError) throw scadaDataError;

    // Process the results
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
