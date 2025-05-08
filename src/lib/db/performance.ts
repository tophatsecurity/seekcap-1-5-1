
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DeviceLoadStats } from "./types";

export async function fetchDeviceLoadStats(): Promise<DeviceLoadStats[]> {
  try {
    // Fetch from the database
    const { data, error } = await supabase
      .from('device_load_stats')
      .select('*')
      .order('device_name', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching device performance stats:", error);
    toast({
      title: "Error fetching performance data",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return [];
  }
}

export function isAboveAverageLoad(loadValue: number, averageLoad: number): boolean {
  return loadValue > averageLoad * 1.2; // 20% above average
}

export function calculateAverageLoad(devices: DeviceLoadStats[]): number {
  if (devices.length === 0) return 0;
  const totalLoad = devices.reduce((sum, device) => sum + device.load_avg_1m, 0);
  return totalLoad / devices.length;
}

// Function to update device performance stats
export async function updateDeviceLoadStats(device: DeviceLoadStats): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('device_load_stats')
      .update({
        load_avg_1m: device.load_avg_1m,
        load_avg_5m: device.load_avg_5m,
        load_avg_15m: device.load_avg_15m,
        memory_used_percent: device.memory_used_percent,
        storage_used_percent: device.storage_used_percent,
        traffic_in_mbps: device.traffic_in_mbps,
        traffic_out_mbps: device.traffic_out_mbps,
        collection_status: device.collection_status,
        status_reason: device.status_reason
      })
      .eq('id', device.id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error("Error updating device performance stats:", error);
    toast({
      title: "Error updating performance data",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

// Function to fetch device metrics summary
export async function fetchDeviceMetricsSummary() {
  try {
    const { data, error } = await supabase
      .from('device_metrics_summary')
      .select('*');
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error("Error fetching device metrics summary:", error);
    toast({
      title: "Error fetching metrics summary",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return [];
  }
}
