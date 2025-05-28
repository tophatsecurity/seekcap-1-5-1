
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NetworkDevice, Asset, Port } from "@/lib/db/types";
import { Activity, Ethernet, Wifi } from "lucide-react";

interface DevicePortViewProps {
  networkDevices: NetworkDevice[];
  assets: Asset[];
}

export const DevicePortView: React.FC<DevicePortViewProps> = ({ networkDevices, assets }) => {
  const devicePortMappings = useMemo(() => {
    const mappings = [];
    
    // For each network device (switch/router), generate port mappings
    networkDevices.forEach(device => {
      if (device.device_type?.toLowerCase().includes('switch') || device.device_type?.toLowerCase().includes('router')) {
        const portCount = device.port_count || 24;
        
        // Generate ports with some connected devices
        for (let i = 1; i <= portCount; i++) {
          const isActive = Math.random() > 0.4;
          const connectedAsset = isActive && Math.random() > 0.3 ? 
            assets[Math.floor(Math.random() * Math.min(assets.length, 10))] : null;
          
          if (isActive) {
            mappings.push({
              switchName: device.name,
              switchType: device.device_type,
              switchIP: device.ip_address,
              portNumber: i,
              portStatus: Math.random() > 0.1 ? 'active' : 'blocked',
              vlan: Math.random() > 0.7 ? `VLAN${Math.floor(Math.random() * 10) + 1}` : null,
              connectedDevice: connectedAsset ? {
                name: connectedAsset.name || `Device-${i}`,
                mac: connectedAsset.mac_address,
                ip: connectedAsset.src_ip || connectedAsset.ip_address,
                type: connectedAsset.device_type || 'Unknown',
                bandwidth: (connectedAsset.download_bps || 0) + (connectedAsset.upload_bps || 0),
                technology: connectedAsset.technology || 'Ethernet'
              } : null,
              bandwidth: connectedAsset ? 
                (connectedAsset.download_bps || 0) + (connectedAsset.upload_bps || 0) : 
                Math.floor(Math.random() * 100000000) + 10000000, // 10-110 Mbps
              utilization: Math.floor(Math.random() * 100)
            });
          }
        }
      }
    });
    
    return mappings.sort((a, b) => a.switchName.localeCompare(b.switchName) || a.portNumber - b.portNumber);
  }, [networkDevices, assets]);

  const formatBandwidth = (bps: number) => {
    if (bps > 1000000000) return `${(bps / 1000000000).toFixed(1)} Gbps`;
    if (bps > 1000000) return `${(bps / 1000000).toFixed(1)} Mbps`;
    if (bps > 1000) return `${(bps / 1000).toFixed(1)} Kbps`;
    return `${bps} bps`;
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization > 80) return 'text-red-600 bg-red-50';
    if (utilization > 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPortStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  if (devicePortMappings.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No port mappings found.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ethernet className="h-5 w-5" />
          Device Port Mappings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Switch/Router</TableHead>
              <TableHead>Port</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Connected Device</TableHead>
              <TableHead>Device Type</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>VLAN</TableHead>
              <TableHead>Bandwidth</TableHead>
              <TableHead>Utilization</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devicePortMappings.map((mapping, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">{mapping.switchName}</div>
                    <div className="text-xs text-muted-foreground">{mapping.switchType}</div>
                    <div className="text-xs text-muted-foreground font-mono">{mapping.switchIP}</div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPortStatusColor(mapping.portStatus)}`}></div>
                    <span className="font-mono">Port {mapping.portNumber}</span>
                  </div>
                </TableCell>
                
                <TableCell>
                  <Badge variant={mapping.portStatus === 'active' ? 'default' : 'destructive'}>
                    {mapping.portStatus}
                  </Badge>
                </TableCell>
                
                <TableCell>
                  {mapping.connectedDevice ? (
                    <div className="space-y-1">
                      <div className="font-medium">{mapping.connectedDevice.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {mapping.connectedDevice.mac}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {mapping.connectedDevice ? (
                    <div className="flex items-center gap-2">
                      {mapping.connectedDevice.technology === 'Wi-Fi' ? 
                        <Wifi className="h-4 w-4" /> : 
                        <Ethernet className="h-4 w-4" />
                      }
                      <span>{mapping.connectedDevice.type}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {mapping.connectedDevice?.ip ? (
                    <span className="font-mono text-sm">{mapping.connectedDevice.ip}</span>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                
                <TableCell>
                  {mapping.vlan ? (
                    <Badge variant="outline">{mapping.vlan}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Default</span>
                  )}
                </TableCell>
                
                <TableCell>
                  <span className="font-medium">{formatBandwidth(mapping.bandwidth)}</span>
                </TableCell>
                
                <TableCell>
                  <Badge className={getUtilizationColor(mapping.utilization)}>
                    {mapping.utilization}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
