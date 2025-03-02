
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CaptureDevice, CaptureSettings, CredentialSet, ReturnPath } from "./types";

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
      .maybeSingle();

    if (settingsError) throw settingsError;
    if (!settings) return null;

    const { data: devices, error: devicesError } = await supabase
      .from('capture_devices')
      .select('*');

    if (devicesError) throw devicesError;

    const captureSettings: CaptureSettings = {
      capture_directory: settings.capture_directory,
      storage_mode: settings.storage_mode,
      capture_server: settings.capture_server as { hostname: string; ip: string },
      storage_timeout: settings.storage_timeout,
      return_paths: settings.return_paths as {
        scp: ReturnPath;
        ftp: ReturnPath;
        tftp: ReturnPath;
        direct: ReturnPath;
      },
      credentials: settings.credentials as Record<string, CredentialSet>,
      devices: devices || [],
      vendors: settings.vendors as Record<string, { enabled: boolean }>,
      interface_commands: settings.interface_commands as Record<string, string>,
      capture_commands: settings.capture_commands as Record<string, string>,
      stop_capture_commands: settings.stop_capture_commands as Record<string, string>,
      remove_pcap_commands: settings.remove_pcap_commands as Record<string, string>,
      tmp_directories: settings.tmp_directories as Record<string, string>,
      interface_regex: settings.interface_regex as Record<string, string>,
      extract_pcap_commands: settings.extract_pcap_commands as Record<string, Array<{
        method: string;
        command: string;
        storage_path: string;
      }>>,
    };

    return captureSettings;
  } catch (error) {
    console.error("Error fetching capture settings:", error);
    return null;
  }
}

export async function createCaptureDevice(device: CaptureDevice): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('capture_devices')
      .insert({
        name: device.name,
        vendor: device.vendor,
        ip: device.ip,
        port: device.port,
        protocol: device.protocol,
        enabled: device.enabled,
        credential_set: device.credential_set,
        return_path_credential_set: device.return_path_credential_set,
        capture_filter: device.capture_filter
      });

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error creating capture device:", error);
    toast({
      title: "Error creating device",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

export async function updateCaptureDevice(device: CaptureDevice): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('capture_devices')
      .update({
        vendor: device.vendor,
        ip: device.ip,
        port: device.port,
        protocol: device.protocol,
        enabled: device.enabled,
        credential_set: device.credential_set,
        return_path_credential_set: device.return_path_credential_set,
        capture_filter: device.capture_filter,
        config: device.config || null
      })
      .eq('name', device.name);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error updating capture device:", error);
    toast({
      title: "Error updating device",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

export async function deleteCaptureDevice(deviceName: string): Promise<{ success: boolean; error?: any }> {
  try {
    const { error } = await supabase
      .from('capture_devices')
      .delete()
      .eq('name', deviceName);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error("Error deleting capture device:", error);
    toast({
      title: "Error deleting device",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}
