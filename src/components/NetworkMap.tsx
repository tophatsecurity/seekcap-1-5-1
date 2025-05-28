
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Asset } from "@/lib/db/types";
import { MapPin, Network, Activity, TrendingUp } from "lucide-react";

interface NetworkMapProps {
  assets: Asset[];
}

interface NetworkInterface {
  subnet: string;
  devices: Asset[];
  totalBandwidth: number;
  activeDevices: number;
  utilization: number;
}

export const NetworkMap: React.FC<NetworkMapProps> = ({ assets }) => {
  // Group assets by network subnet
  const networkInterfaces: NetworkInterface[] = React.useMemo(() => {
    const subnetGroups = assets.reduce((acc: Record<string, Asset[]>, asset) => {
      if (!asset.src_ip && !asset.ip_address) return acc;
      
      const ip = asset.src_ip || asset.ip_address || '';
      const ipParts = ip.split('.');
      if (ipParts.length >= 3) {
        const subnet = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0/24`;
        if (!acc[subnet]) acc[subnet] = [];
        acc[subnet].push(asset);
      }
      return acc;
    }, {});

    return Object.entries(subnetGroups).map(([subnet, devices]) => {
      const totalBandwidth = devices.reduce((sum, device) => 
        sum + (device.download_bps || 0) + (device.upload_bps || 0), 0
      );
      
      const activeDevices = devices.filter(device => 
        device.last_seen && new Date(device.last_seen) > new Date(Date.now() - 86400000)
      ).length;

      // Calculate utilization as percentage of theoretical max (assume 1Gbps per device)
      const theoreticalMax = devices.length * 1000000000; // 1Gbps per device
      const utilization = theoreticalMax > 0 ? (totalBandwidth / theoreticalMax) * 100 : 0;

      return {
        subnet,
        devices,
        totalBandwidth,
        activeDevices,
        utilization: Math.min(utilization, 100)
      };
    }).sort((a, b) => b.totalBandwidth - a.totalBandwidth);
  }, [assets]);

  const formatBandwidth = (bps: number) => {
    if (bps > 1000000000) return `${(bps / 1000000000).toFixed(1)} Gbps`;
    if (bps > 1000000) return `${(bps / 1000000).toFixed(1)} Mbps`;
    if (bps > 1000) return `${(bps / 1000).toFixed(1)} Kbps`;
    return `${bps} bps`;
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 80) return 'bg-red-500';
    if (utilization > 60) return 'bg-yellow-500';
    if (utilization > 40) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getUtilizationBadgeColor = (utilization: number) => {
    if (utilization > 80) return 'destructive';
    if (utilization > 60) return 'secondary';
    return 'default';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Network Interface Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Network className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Total Networks</span>
              </div>
              <div className="text-2xl font-bold">{networkInterfaces.length}</div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Total Bandwidth</span>
              </div>
              <div className="text-2xl font-bold">
                {formatBandwidth(networkInterfaces.reduce((sum, net) => sum + net.totalBandwidth, 0))}
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium">Avg Utilization</span>
              </div>
              <div className="text-2xl font-bold">
                {networkInterfaces.length > 0 
                  ? `${(networkInterfaces.reduce((sum, net) => sum + net.utilization, 0) / networkInterfaces.length).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </div>
          </div>

          {/* Network Interface Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {networkInterfaces.map((networkInterface, index) => (
              <div key={networkInterface.subnet} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getUtilizationColor(networkInterface.utilization)}`} />
                    <span className="font-mono text-sm font-medium">{networkInterface.subnet}</span>
                  </div>
                  <Badge variant={getUtilizationBadgeColor(networkInterface.utilization)}>
                    {networkInterface.utilization.toFixed(1)}%
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Devices:</span>
                    <span className="font-medium">{networkInterface.devices.length}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Active:</span>
                    <span className="font-medium text-green-600">{networkInterface.activeDevices}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bandwidth:</span>
                    <span className="font-medium">{formatBandwidth(networkInterface.totalBandwidth)}</span>
                  </div>
                  
                  {/* Utilization Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getUtilizationColor(networkInterface.utilization)}`}
                      style={{ width: `${Math.max(networkInterface.utilization, 2)}%` }}
                    />
                  </div>
                  
                  {/* Top devices in this network */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-xs text-muted-foreground mb-2">Top Devices:</div>
                    <div className="space-y-1">
                      {networkInterface.devices
                        .sort((a, b) => ((b.download_bps || 0) + (b.upload_bps || 0)) - ((a.download_bps || 0) + (a.upload_bps || 0)))
                        .slice(0, 2)
                        .map((device, deviceIndex) => (
                          <div key={device.mac_address} className="flex justify-between text-xs">
                            <span className="truncate max-w-24" title={device.name || device.mac_address}>
                              {device.name || device.mac_address.slice(-6)}
                            </span>
                            <span className="text-muted-foreground">
                              {formatBandwidth((device.download_bps || 0) + (device.upload_bps || 0))}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {networkInterfaces.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No network interfaces found with IP addresses.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
