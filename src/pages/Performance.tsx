
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DevicePerformanceCard } from "@/components/performance/DevicePerformanceCard";
import { TopPerformanceResources } from "@/components/performance/TopPerformanceResources";
import { PerformanceMetricsChart } from "@/components/performance/PerformanceMetricsChart";
import { fetchDeviceLoadStats, calculateAverageLoad } from "@/lib/db/performance";
import { DeviceLoadStats, LoadDisplayMode } from "@/lib/db/types";
import { AlertTriangle, AlertCircle, RefreshCw, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample data for demonstration
const generateSampleData = (): DeviceLoadStats[] => {
  const deviceNames = [
    "PLC-001", "HMI-002", "SCADA-003", "RTU-004", "Switch-005",
    "Router-006", "Historian-007", "EWS-008", "Safety-009", "Gateway-010",
    "Controller-011", "Monitor-012", "Sensor-013", "Actuator-014", "Bridge-015"
  ];
  
  return deviceNames.map((name, index) => ({
    id: index + 1,
    device_name: name,
    load_avg_1m: Math.random() * 4 + 0.1,
    load_avg_5m: Math.random() * 3.5 + 0.2,
    load_avg_15m: Math.random() * 3 + 0.3,
    memory_used_percent: Math.random() * 80 + 10,
    storage_used_percent: Math.random() * 70 + 15,
    traffic_in_mbps: Math.random() * 100,
    traffic_out_mbps: Math.random() * 80,
    collection_status: Math.random() > 0.8 ? 'halted' : Math.random() > 0.9 ? 'limited' : 'active',
    status_reason: Math.random() > 0.8 ? 'High CPU usage detected' : undefined,
    timestamp: new Date().toISOString(),
  })) as DeviceLoadStats[];
};

const Performance = () => {
  const [displayMode, setDisplayMode] = useState<LoadDisplayMode>('random');
  const [hoveredDeviceId, setHoveredDeviceId] = useState<number | null>(null);
  const [roundRobinIndex, setRoundRobinIndex] = useState(0);
  const [timeRange, setTimeRange] = useState<'15m' | '1h' | '6h' | '24h'>('1h');
  const [useSampleData, setUseSampleData] = useState(false);
  
  const { 
    data: dbDevices = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['devicePerformanceStats'],
    queryFn: fetchDeviceLoadStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Use sample data if no real data is available or if explicitly requested
  const devices = useSampleData || dbDevices.length === 0 ? generateSampleData() : dbDevices;
  
  const averageLoad = calculateAverageLoad(devices);
  const criticalDevices = devices.filter(d => d.collection_status !== 'active');
  
  // Round robin effect
  useEffect(() => {
    if (displayMode === 'roundrobin' && devices.length > 0) {
      const interval = setInterval(() => {
        setRoundRobinIndex(prev => (prev + 1) % devices.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [displayMode, devices.length]);
  
  // Determine if a device should be highlighted based on mode
  const isDeviceHighlighted = (device: DeviceLoadStats) => {
    if (displayMode === 'hovered') {
      return device.id === hoveredDeviceId;
    } else if (displayMode === 'roundrobin') {
      return devices.indexOf(device) === roundRobinIndex;
    }
    // In random mode, no device is highlighted
    return false;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Performance Monitoring</h1>
          <p className="text-muted-foreground">
            Monitor device performance and resource utilization
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={useSampleData ? "default" : "outline"}
            size="sm"
            onClick={() => setUseSampleData(!useSampleData)}
          >
            {useSampleData ? "Using Sample Data" : "Use Sample Data"}
          </Button>
          
          <Select value={displayMode} onValueChange={(value) => setDisplayMode(value as LoadDisplayMode)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Display Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="random">Default View</SelectItem>
                <SelectItem value="hovered">Hover Focus</SelectItem>
                <SelectItem value="roundrobin">Round Robin</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {criticalDevices.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Resource Issues</AlertTitle>
          <AlertDescription>
            {criticalDevices.length} {criticalDevices.length === 1 ? 'device has' : 'devices have'} collection issues due to resource constraints.
          </AlertDescription>
        </Alert>
      )}
      
      {isLoading && !useSampleData ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-64 bg-muted rounded-lg lg:col-span-2"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:col-span-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : error && !useSampleData ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load device data. Please try again later.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceMetricsChart devices={devices} timeRange={timeRange} />
            </div>
            <div>
              <TopPerformanceResources devices={devices} count={5} />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div>Showing {devices.length} devices {useSampleData && "(Sample Data)"}</div>
            <div>Average System Performance: <span className="font-medium">{averageLoad.toFixed(2)}</span></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {devices.map((device) => (
              <div 
                key={device.id}
                onMouseEnter={() => setHoveredDeviceId(device.id)}
                onMouseLeave={() => setHoveredDeviceId(null)}
              >
                <DevicePerformanceCard 
                  device={device} 
                  averageLoad={averageLoad} 
                  isHovered={isDeviceHighlighted(device)} 
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Performance;
