
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CaptureSettings, AutoDiscoverySettings, FailSafeSettings } from "../types";
import { Json } from "@/integrations/supabase/types";

export async function importCaptureSettings(data: CaptureSettings) {
  try {
    const { error: settingsError } = await supabase
      .from('capture_settings')
      .upsert({
        id: 1,
        capture_directory: data.capture_directory,
        storage_mode: data.storage_mode,
        capture_server: data.capture_server as unknown as Json,
        storage_timeout: data.storage_timeout,
        return_paths: data.return_paths as unknown as Json,
        credentials: data.credentials as unknown as Json,
        vendors: data.vendors as Json,
        interface_commands: data.interface_commands as Json,
        capture_commands: data.capture_commands as Json,
        stop_capture_commands: data.stop_capture_commands as Json,
        remove_pcap_commands: data.remove_pcap_commands as Json,
        tmp_directories: data.tmp_directories as Json,
        interface_regex: data.interface_regex as Json,
        extract_pcap_commands: data.extract_pcap_commands as unknown as Json,
        auto_discovery: data.auto_discovery as unknown as Json || null,
        fail_safe: data.fail_safe as unknown as Json || null
      });

    if (settingsError) throw settingsError;

    toast({
      title: "Capture settings imported",
      description: `Successfully imported settings and vendor profiles`,
    });

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

    const typedDevices = devices ? devices.map((dev: any) => ({
      name: dev.name,
      vendor: dev.vendor,
      ip: dev.ip,
      port: dev.port,
      protocol: dev.protocol,
      enabled: dev.enabled,
      credential_set: dev.credential_set,
      return_path_credential_set: dev.return_path_credential_set,
      capture_filter: dev.capture_filter,
      id: dev.id,
      config: dev.config ? {
        username: dev.config.username,
        password: dev.config.password,
        certificate: dev.config.certificate,
        enable_required: dev.config.enable_required,
        enable_password: dev.config.enable_password,
        auto_discovery: dev.config.auto_discovery,
        advanced: dev.config.advanced ? {
          raw_scada: dev.config.advanced.raw_scada,
          scada_protocols: dev.config.advanced.scada_protocols,
          interfaces: dev.config.advanced.interfaces
        } : undefined
      } : null
    })) : [];

    const captureSettings: CaptureSettings = {
      capture_directory: settings.capture_directory,
      storage_mode: settings.storage_mode,
      capture_server: settings.capture_server as { hostname: string; ip: string },
      storage_timeout: settings.storage_timeout,
      return_paths: settings.return_paths as any,
      credentials: settings.credentials as any,
      devices: typedDevices,
      vendors: settings.vendors as Record<string, { enabled: boolean }>,
      interface_commands: settings.interface_commands as Record<string, string>,
      capture_commands: settings.capture_commands as Record<string, string>,
      stop_capture_commands: settings.stop_capture_commands as Record<string, string>,
      remove_pcap_commands: settings.remove_pcap_commands as Record<string, string>,
      tmp_directories: settings.tmp_directories as Record<string, string>,
      interface_regex: settings.interface_regex as Record<string, string>,
      extract_pcap_commands: settings.extract_pcap_commands as any,
      auto_discovery: settings.auto_discovery as unknown as AutoDiscoverySettings | undefined,
      fail_safe: settings.fail_safe as unknown as FailSafeSettings | undefined
    };

    return captureSettings;
  } catch (error) {
    console.error("Error fetching capture settings:", error);
    return null;
  }
}

export async function updateAutoDiscoverySettings(settings: AutoDiscoverySettings): Promise<{ success: boolean; error?: any }> {
  try {
    const { data: captureSettings, error: fetchError } = await supabase
      .from('capture_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    if (!captureSettings) {
      throw new Error("Capture settings not found");
    }
    
    const { error: updateError } = await supabase
      .from('capture_settings')
      .update({
        auto_discovery: settings as unknown as Json
      })
      .eq('id', 1);
      
    if (updateError) throw updateError;
    
    toast({
      title: "Auto discovery settings updated",
      description: `Successfully updated auto discovery configuration`,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating auto discovery settings:", error);
    toast({
      title: "Error updating settings",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}

export async function updateFailSafeSettings(settings: FailSafeSettings): Promise<{ success: boolean; error?: any }> {
  try {
    const { data: captureSettings, error: fetchError } = await supabase
      .from('capture_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
      
    if (fetchError) throw fetchError;
    if (!captureSettings) {
      throw new Error("Capture settings not found");
    }
    
    const { error: updateError } = await supabase
      .from('capture_settings')
      .update({
        fail_safe: settings as unknown as Json
      })
      .eq('id', 1);
      
    if (updateError) throw updateError;
    
    toast({
      title: "Fail safe settings updated",
      description: `Successfully updated fail safe configuration`,
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error updating fail safe settings:", error);
    toast({
      title: "Error updating settings",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}
