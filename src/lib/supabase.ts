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

export type CaptureDevice = {
  name: string;
  vendor: string;
  ip: string;
  port: number;
  protocol: string;
  enabled: boolean;
  credential_set: string;
  return_path_credential_set: string;
  capture_filter: string;
};

export type CredentialSet = {
  user: string;
  password: string;
  enable_required: boolean;
  enable_password?: string;
};

export type ReturnPath = {
  enabled: boolean;
  base_path: string;
  ip?: string;
  host?: string;
  port?: number;
  credentials?: string;
};

export type CaptureSettings = {
  capture_directory: string;
  storage_mode: string;
  capture_server: {
    hostname: string;
    ip: string;
  };
  storage_timeout: number;
  return_paths: {
    scp: ReturnPath;
    ftp: ReturnPath;
    tftp: ReturnPath;
    direct: ReturnPath;
  };
  credentials: Record<string, CredentialSet>;
  devices: CaptureDevice[];
  vendors: Record<string, { enabled: boolean }>;
  interface_commands: Record<string, string>;
  capture_commands: Record<string, string>;
  stop_capture_commands: Record<string, string>;
  remove_pcap_commands: Record<string, string>;
  tmp_directories: Record<string, string>;
  interface_regex: Record<string, string>;
  extract_pcap_commands: Record<string, Array<{
    method: string;
    command: string;
    storage_path: string;
  }>>;
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

export async function importCaptureSettings(data: CaptureSettings) {
  try {
    const { error: settingsError } = await supabase
      .from('capture_settings')
      .upsert({
        id: 1,
        capture_directory: data.capture_directory,
        storage_mode: data.storage_mode,
        capture_server: data.capture_server,
        storage_timeout: data.storage_timeout,
        return_paths: data.return_paths,
        credentials: data.credentials,
        vendors: data.vendors,
        interface_commands: data.interface_commands,
        capture_commands: data.capture_commands,
        stop_capture_commands: data.stop_capture_commands,
        remove_pcap_commands: data.remove_pcap_commands,
        tmp_directories: data.tmp_directories,
        interface_regex: data.interface_regex,
        extract_pcap_commands: data.extract_pcap_commands
      });

    if (settingsError) throw settingsError;

    for (const device of data.devices) {
      const { error: deviceError } = await supabase
        .from('capture_devices')
        .upsert({
          name: device.name,
          vendor: device.vendor,
          ip: device.ip,
          port: device.port,
          protocol: device.protocol,
          enabled: device.enabled,
          credential_set: device.credential_set,
          return_path_credential_set: device.return_path_credential_set,
          capture_filter: device.capture_filter
        }, { onConflict: 'name' });

      if (deviceError) throw deviceError;
    }

    return { success: true };
  } catch (error) {
    console.error("Error importing capture settings:", error);
    toast({
      title: "Error importing capture settings",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

export async function fetchCaptureSettings(): Promise<CaptureSettings | null> {
  try {
    const { data: settings, error: settingsError } = await supabase
      .from('capture_settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (settingsError) throw settingsError;

    const { data: devices, error: devicesError } = await supabase
      .from('capture_devices')
      .select('*');

    if (devicesError) throw devicesError;

    const captureSettings: CaptureSettings = {
      ...settings,
      devices: devices || []
    };

    return captureSettings;
  } catch (error) {
    console.error("Error fetching capture settings:", error);
    return null;
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
