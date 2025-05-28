import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { NetworkDevice } from "./types";

export async function fetchNetworkDevices(): Promise<NetworkDevice[]> {
  try {
    const { data, error } = await supabase
      .from('network_devices')
      .select('*, organizations(name)') as { data: any[], error: any };

    if (error) {
      console.error("Error in fetchNetworkDevices:", error);
      throw error;
    }
    
    console.log(`Found ${data?.length || 0} network devices in the database`);
    
    const typedData: NetworkDevice[] = data ? data.map(item => ({
      id: item.id,
      name: item.name,
      device_type: item.device_type,
      application: item.application,
      status: item.status,
      ip_address: item.ip_address,
      uplink: item.uplink,
      parent_device: item.parent_device,
      ch_24_ghz: item.ch_24_ghz,
      ch_5_ghz: item.ch_5_ghz,
      connected: item.connected,
      experience: item.experience,
      usage_24hr: item.usage_24hr,
      download: item.download,
      upload: item.upload,
      mac_address: item.mac_address,
      first_seen: item.first_seen,
      last_seen: item.last_seen,
      port_count: item.port_count,
      organizations: item.organizations
    })) : [];
    
    return typedData;
  } catch (error) {
    console.error("Error fetching network devices:", error);
    return [];
  }
}

export async function fetchNetworkDeviceDetail(id: number): Promise<NetworkDevice | null> {
  try {
    const { data, error } = await supabase
      .from('network_devices')
      .select('*, organizations(id, name, description)') as { data: any, error: any };

    if (error) throw error;
    
    if (!data) return null;
    
    const device: NetworkDevice = {
      id: data.id,
      name: data.name,
      device_type: data.device_type,
      application: data.application,
      status: data.status,
      ip_address: data.ip_address,
      uplink: data.uplink,
      parent_device: data.parent_device,
      ch_24_ghz: data.ch_24_ghz,
      ch_5_ghz: data.ch_5_ghz,
      connected: data.connected,
      experience: data.experience,
      usage_24hr: data.usage_24hr,
      download: data.download,
      upload: data.upload,
      mac_address: data.mac_address,
      first_seen: data.first_seen,
      last_seen: data.last_seen,
      port_count: data.port_count,
      organizations: data.organizations
    };
    
    return device;
  } catch (error) {
    console.error(`Error fetching network device details for id ${id}:`, error);
    return null;
  }
}

export async function fetchNetworkDeviceByMac(macAddress: string): Promise<NetworkDevice | null> {
  try {
    const { data, error } = await supabase
      .from('network_devices')
      .select('*, organizations(id, name, description)')
      .eq('mac_address', macAddress)
      .single() as { data: any, error: any };

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned" which is ok
    
    if (!data) return null;
    
    const device: NetworkDevice = {
      id: data.id,
      name: data.name,
      device_type: data.device_type,
      application: data.application,
      status: data.status,
      ip_address: data.ip_address,
      uplink: data.uplink,
      parent_device: data.parent_device,
      ch_24_ghz: data.ch_24_ghz,
      ch_5_ghz: data.ch_5_ghz,
      connected: data.connected,
      experience: data.experience,
      usage_24hr: data.usage_24hr,
      download: data.download,
      upload: data.upload,
      mac_address: data.mac_address,
      first_seen: data.first_seen,
      last_seen: data.last_seen,
      port_count: data.port_count,
      organizations: data.organizations
    };
    
    return device;
  } catch (error) {
    console.error(`Error fetching network device details for MAC ${macAddress}:`, error);
    return null;
  }
}

export async function createNetworkDevice(device: NetworkDevice) {
  try {
    const { data, error } = await supabase
      .from('network_devices')
      .insert({
        name: device.name,
        device_type: device.device_type,
        application: device.application,
        status: device.status,
        ip_address: device.ip_address,
        uplink: device.uplink,
        parent_device: device.parent_device,
        ch_24_ghz: device.ch_24_ghz,
        ch_5_ghz: device.ch_5_ghz,
        connected: device.connected,
        experience: device.experience,
        usage_24hr: device.usage_24hr,
        download: device.download,
        upload: device.upload,
        mac_address: device.mac_address
      })
      .select() as { data: any, error: any };

    if (error) throw error;
    
    toast({
      title: "Device added",
      description: `Successfully added ${device.name}`,
    });
    
    return { success: true, data };
  } catch (error) {
    console.error("Error creating network device:", error);
    toast({
      title: "Error adding device",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

export async function updateNetworkDevice(device: NetworkDevice) {
  if (!device.id) {
    toast({
      title: "Error updating device",
      description: "Device ID is required",
      variant: "destructive",
    });
    return { success: false, error: "Device ID is required" };
  }

  try {
    const { error } = await supabase
      .from('network_devices')
      .update({
        name: device.name,
        device_type: device.device_type,
        application: device.application,
        status: device.status,
        ip_address: device.ip_address,
        uplink: device.uplink,
        parent_device: device.parent_device,
        ch_24_ghz: device.ch_24_ghz,
        ch_5_ghz: device.ch_5_ghz,
        connected: device.connected,
        experience: device.experience,
        usage_24hr: device.usage_24hr,
        download: device.download,
        upload: device.upload,
        mac_address: device.mac_address
      })
      .eq('id', device.id);

    if (error) throw error;
    
    toast({
      title: "Device updated",
      description: `Successfully updated ${device.name}`,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating network device:", error);
    toast({
      title: "Error updating device",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

export async function deleteNetworkDevice(id: number) {
  try {
    const { error } = await supabase
      .from('network_devices')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast({
      title: "Device deleted",
      description: "Network device has been removed",
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting network device:", error);
    toast({
      title: "Error deleting device",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

export async function importNetworkDevices(devices: NetworkDevice[]) {
  try {
    // Process in batches to avoid exceeding request size limits
    const batchSize = 20;
    let successCount = 0;

    for (let i = 0; i < devices.length; i += batchSize) {
      const batch = devices.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('network_devices')
        .upsert(batch.map(device => ({
          name: device.name,
          device_type: device.device_type,
          application: device.application,
          status: device.status,
          ip_address: device.ip_address,
          uplink: device.uplink,
          parent_device: device.parent_device,
          ch_24_ghz: device.ch_24_ghz,
          ch_5_ghz: device.ch_5_ghz,
          connected: device.connected,
          experience: device.experience,
          usage_24hr: device.usage_24hr,
          download: device.download,
          upload: device.upload,
          mac_address: device.mac_address
        })), { onConflict: 'mac_address' }) as { error: any };

      if (error) throw error;
      successCount += batch.length;
    }
    
    toast({
      title: "Import successful",
      description: `Successfully imported ${successCount} network devices`,
    });
    
    return { success: true, count: successCount };
  } catch (error) {
    console.error("Error importing network devices:", error);
    toast({
      title: "Error importing devices",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

// Function to sync assets with network_devices
export async function syncAssetsWithNetworkDevices() {
  try {
    // Get all assets
    const { data: assets, error: assetsError } = await supabase
      .from('assets')
      .select('*');
      
    if (assetsError) throw assetsError;
    
    if (!assets || assets.length === 0) {
      console.log("No assets found to sync with network devices");
      return { success: true, count: 0 };
    }
    
    // For each asset, create a network device if it doesn't exist
    const devicesToUpsert = assets.map(asset => ({
      name: `Device ${asset.mac_address.slice(-6)}`,
      device_type: asset.eth_proto || "Unknown",
      application: "Network",
      status: "Up to date",
      ip_address: asset.src_ip,
      mac_address: asset.mac_address,
      first_seen: asset.first_seen,
      last_seen: asset.last_seen
    }));
    
    const result = await importNetworkDevices(devicesToUpsert);
    return result;
  } catch (error) {
    console.error("Error syncing assets with network devices:", error);
    return { success: false, error };
  }
}
