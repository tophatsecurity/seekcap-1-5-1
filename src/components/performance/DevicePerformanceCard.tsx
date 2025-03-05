
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DeviceLoadStats } from "@/lib/db/types";
import { isAboveAverageLoad } from "@/lib/db/performance";
import { AlertTriangle, Check, HardDrive, Cpu, Server, SignalHigh, X } from "lucide-react";

interface DevicePerformanceCardProps {
  device: DeviceLoadStats;
  averageLoad: number;
  isHovered: boolean;
}

export function DevicePerformanceCard({ device, averageLoad, isHovered }: DevicePerformanceCardProps) {
  const isHighLoad = isAboveAverageLoad(device.load_avg_1m, averageLoad);
  const isHighMemory = device.memory_used_percent > 80;
  const isHighStorage = device.storage_used_percent > 80;
  
  return (
    <Card className={`transition-all duration-300 ${isHovered ? 'ring-2 ring-primary shadow-lg' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            <span>{device.device_name}</span>
          </div>
          <StatusIcon status={device.collection_status} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Performance (1m/5m/15m)</span>
            </div>
            <span className={`text-sm font-medium ${isHighLoad ? 'text-red-500' : ''}`}>
              {device.load_avg_1m.toFixed(2)} / {device.load_avg_5m.toFixed(2)} / {device.load_avg_15m.toFixed(2)}
            </span>
          </div>
          <Progress value={Math.min(100, (device.load_avg_1m / 4) * 100)} 
            className={isHighLoad ? 'bg-red-200' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Memory</span>
            </div>
            <span className={`text-sm font-medium ${isHighMemory ? 'text-amber-500' : ''}`}>
              {device.memory_used_percent}%
            </span>
          </div>
          <Progress value={device.memory_used_percent} 
            className={isHighMemory ? 'bg-amber-200' : ''}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Storage</span>
            </div>
            <span className={`text-sm font-medium ${isHighStorage ? 'text-amber-500' : ''}`}>
              {device.storage_used_percent}%
            </span>
          </div>
          <Progress value={device.storage_used_percent} 
            className={isHighStorage ? 'bg-amber-200' : ''}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <SignalHigh className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Traffic (in/out)</span>
          </div>
          <span className="text-sm font-medium">
            {device.traffic_in_mbps} / {device.traffic_out_mbps} Mbps
          </span>
        </div>
        
        {device.status_reason && (
          <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-2 rounded flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>{device.status_reason}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function StatusIcon({ status }: { status: 'active' | 'halted' | 'limited' }) {
  switch (status) {
    case 'active':
      return <Check className="h-5 w-5 text-green-500" />;
    case 'halted':
      return <X className="h-5 w-5 text-red-500" />;
    case 'limited':
      return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  }
}
