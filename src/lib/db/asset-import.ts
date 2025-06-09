
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

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

      // Handle related data
      await Promise.all([
        processProtocols(asset.mac_address, asset.ip_protocols),
        processTcpPorts(asset.mac_address, asset.tcp_ports),
        processUdpPorts(asset.mac_address, asset.udp_ports),
        processScadaProtocols(asset.mac_address, asset.scada_protocols),
        processScadaData(asset.mac_address, asset.scada_data)
      ]);
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

async function processProtocols(macAddress: string, protocols: string[]) {
  if (protocols && protocols.length > 0) {
    for (const protocol of protocols) {
      await supabase
        .from('ip_protocols')
        .upsert({
          asset_mac: macAddress,
          protocol: protocol
        }, { onConflict: 'asset_mac, protocol' });
    }
  }
}

async function processTcpPorts(macAddress: string, ports: number[]) {
  if (ports && ports.length > 0) {
    for (const port of ports) {
      await supabase
        .from('tcp_ports')
        .upsert({
          asset_mac: macAddress,
          port: port
        }, { onConflict: 'asset_mac, port' });
    }
  }
}

async function processUdpPorts(macAddress: string, ports: number[]) {
  if (ports && ports.length > 0) {
    for (const port of ports) {
      await supabase
        .from('udp_ports')
        .upsert({
          asset_mac: macAddress,
          port: port
        }, { onConflict: 'asset_mac, port' });
    }
  }
}

async function processScadaProtocols(macAddress: string, protocols: string[]) {
  if (protocols && protocols.length > 0) {
    for (const protocol of protocols) {
      await supabase
        .from('scada_protocols')
        .upsert({
          asset_mac: macAddress,
          protocol: protocol
        }, { onConflict: 'asset_mac, protocol' });
    }
  }
}

async function processScadaData(macAddress: string, scadaData: Record<string, any>) {
  if (scadaData && Object.keys(scadaData).length > 0) {
    for (const [key, value] of Object.entries(scadaData)) {
      await supabase
        .from('scada_data')
        .upsert({
          asset_mac: macAddress,
          key: key,
          value: value as Json
        }, { onConflict: 'asset_mac, key' });
    }
  }
}
