
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CaptureDevice } from "../types";
import { Json } from "@/integrations/supabase/types";

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
        capture_filter: device.capture_filter,
        config: device.config || null
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
