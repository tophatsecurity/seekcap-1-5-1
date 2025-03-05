
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DeviceLoadStats } from "@/lib/db/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, HardDrive, Server, SignalHigh, AlertTriangle } from "lucide-react";
import { calculateAverageLoad } from "@/lib/db/performance";

interface TopPerformanceResourcesProps {
  devices: DeviceLoadStats[];
  count?: number;
}

export function TopPerformanceResources({ devices, count = 3 }: TopPerformanceResourcesProps) {
  const sortedByCpu = [...devices].sort((a, b) => b.load_avg_1m - a.load_avg_1m);
  const sortedByMemory = [...devices].sort((a, b) => b.memory_used_percent - a.memory_used_percent);
  const sortedByStorage = [...devices].sort((a, b) => b.storage_used_percent - a.storage_used_percent);
  const sortedByTraffic = [...devices].sort((a, b) => 
    (b.traffic_in_mbps + b.traffic_out_mbps) - (a.traffic_in_mbps + a.traffic_out_mbps)
  );
  
  const averageLoad = calculateAverageLoad(devices);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <span>Top Resource Usage</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cpu">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="cpu" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">CPU</span>
            </TabsTrigger>
            <TabsTrigger value="memory" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              <span className="hidden sm:inline">Memory</span>
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              <span className="hidden sm:inline">Storage</span>
            </TabsTrigger>
            <TabsTrigger value="traffic" className="flex items-center gap-2">
              <SignalHigh className="h-4 w-4" />
              <span className="hidden sm:inline">Traffic</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="cpu" className="space-y-4 mt-4">
            {sortedByCpu.slice(0, count).map((device) => (
              <div key={device.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{device.device_name}</div>
                  <div className={device.load_avg_1m > averageLoad * 1.2 ? "text-red-500 font-medium" : ""}>
                    {device.load_avg_1m.toFixed(2)}
                  </div>
                </div>
                <Progress 
                  value={Math.min(100, (device.load_avg_1m / 4) * 100)} 
                  className={device.load_avg_1m > averageLoad * 1.2 ? 'bg-red-200' : ''}
                />
              </div>
            ))}
            <div className="text-xs text-muted-foreground text-right pt-2">
              System Average: {averageLoad.toFixed(2)}
            </div>
          </TabsContent>
          
          <TabsContent value="memory" className="space-y-4 mt-4">
            {sortedByMemory.slice(0, count).map((device) => (
              <div key={device.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{device.device_name}</div>
                  <div className={device.memory_used_percent > 80 ? "text-amber-500 font-medium" : ""}>
                    {device.memory_used_percent}%
                  </div>
                </div>
                <Progress 
                  value={device.memory_used_percent} 
                  className={device.memory_used_percent > 80 ? 'bg-amber-200' : ''}
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="storage" className="space-y-4 mt-4">
            {sortedByStorage.slice(0, count).map((device) => (
              <div key={device.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{device.device_name}</div>
                  <div className={device.storage_used_percent > 80 ? "text-amber-500 font-medium" : ""}>
                    {device.storage_used_percent}%
                  </div>
                </div>
                <Progress 
                  value={device.storage_used_percent} 
                  className={device.storage_used_percent > 80 ? 'bg-amber-200' : ''}
                />
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="traffic" className="space-y-4 mt-4">
            {sortedByTraffic.slice(0, count).map((device) => (
              <div key={device.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-medium">{device.device_name}</div>
                  <div>
                    {device.traffic_in_mbps + device.traffic_out_mbps} Mbps
                  </div>
                </div>
                <div className="flex gap-1 text-xs text-muted-foreground">
                  <span>In: {device.traffic_in_mbps} Mbps</span>
                  <span>|</span>
                  <span>Out: {device.traffic_out_mbps} Mbps</span>
                </div>
                <Progress 
                  value={Math.min(100, ((device.traffic_in_mbps + device.traffic_out_mbps) / 200) * 100)} 
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
