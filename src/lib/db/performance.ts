
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { DeviceLoadStats } from "./types";

// This would normally fetch from the database
// For demo, we'll generate mock data
export async function fetchDeviceLoadStats(): Promise<DeviceLoadStats[]> {
  try {
    // In a real implementation, this would be a database call:
    // const { data, error } = await supabase
    //   .from('device_load_stats')
    //   .select('*')
    //   .order('device_name', { ascending: true });
    
    // For the demo, we'll generate mock data
    const mockData = generateMockPerformanceData();
    
    return mockData;
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

// Helper function to generate mock data
function generateMockPerformanceData(): DeviceLoadStats[] {
  const deviceCount = Math.floor(Math.random() * 5) + 8; // 8-12 devices
  const devices = [];
  
  for (let i = 1; i <= deviceCount; i++) {
    const loadAvg1m = Math.random() * 4;
    const isOverloaded = loadAvg1m > 2.5;
    const isHighLoad = loadAvg1m > 1.5;
    
    let collectionStatus: 'active' | 'halted' | 'limited' = 'active';
    let statusReason: string | undefined = undefined;
    
    if (isOverloaded) {
      collectionStatus = Math.random() > 0.5 ? 'halted' : 'limited';
      statusReason = collectionStatus === 'halted' 
        ? 'Collection halted due to high CPU load' 
        : 'Collection limited due to resource constraints';
    }
    
    devices.push({
      id: i,
      device_name: `Device-${i.toString().padStart(2, '0')}`,
      load_avg_1m: loadAvg1m,
      load_avg_5m: loadAvg1m - (Math.random() * 0.5),
      load_avg_15m: loadAvg1m - (Math.random() * 0.8),
      memory_used_percent: Math.min(95, Math.floor(Math.random() * 80) + (isHighLoad ? 15 : 0)),
      storage_used_percent: Math.min(98, Math.floor(Math.random() * 70) + (isHighLoad ? 10 : 0)),
      traffic_in_mbps: Math.floor(Math.random() * 100),
      traffic_out_mbps: Math.floor(Math.random() * 80),
      collection_status: collectionStatus,
      status_reason: statusReason,
      timestamp: new Date().toISOString()
    });
  }
  
  return devices;
}

export function isAboveAverageLoad(loadValue: number, averageLoad: number): boolean {
  return loadValue > averageLoad * 1.2; // 20% above average
}

export function calculateAverageLoad(devices: DeviceLoadStats[]): number {
  if (devices.length === 0) return 0;
  const totalLoad = devices.reduce((sum, device) => sum + device.load_avg_1m, 0);
  return totalLoad / devices.length;
}
