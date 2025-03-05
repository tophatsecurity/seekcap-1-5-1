
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

const Performance = () => {
  const [displayMode, setDisplayMode] = useState<LoadDisplayMode>('random');
  const [hoveredDeviceId, setHoveredDeviceId] = useState<number | null>(null);
  const [roundRobinIndex, setRoundRobinIndex] = useState(0);
  const [timeRange, setTimeRange] = useState<'15m' | '1h' | '6h' | '24h'>('1h');
  
  const { 
    data: devices = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['devicePerformanceStats'],
    queryFn: fetchDeviceLoadStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
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
      
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="h-64 bg-muted rounded-lg lg:col-span-2"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:col-span-3">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : error ? (
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
            <div>Showing {devices.length} devices</div>
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
