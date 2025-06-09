
import { toast } from "@/hooks/use-toast";
import { CaptureSettings } from "../types";
import { importCaptureSettings } from "./settings";

export async function importVendorConfiguration(configData: any) {
  try {
    const captureSettings: CaptureSettings = {
      capture_directory: configData.capture_directory,
      storage_mode: configData.storage_mode,
      capture_server: configData.capture_server,
      storage_timeout: configData.storage_timeout,
      return_paths: configData.return_paths,
      credentials: configData.credentials,
      devices: configData.devices || [],
      vendors: configData.vendors,
      interface_commands: configData.interface_commands,
      capture_commands: configData.capture_commands,
      stop_capture_commands: configData.stop_capture_commands,
      remove_pcap_commands: configData.remove_pcap_commands,
      tmp_directories: configData.tmp_directories,
      interface_regex: configData.interface_regex,
      extract_pcap_commands: configData.extract_pcap_commands,
      auto_discovery: configData.auto_discovery
    };

    const result = await importCaptureSettings(captureSettings);
    
    return result;
  } catch (error) {
    console.error("Error importing vendor configuration:", error);
    toast({
      title: "Error importing vendor configuration",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { success: false, error };
  }
}
