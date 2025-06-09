
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Asset } from '@/lib/db/types';
import { 
  Network, 
  Cpu, 
  Activity, 
  Clock, 
  Signal, 
  Download, 
  Upload,
  Database,
  Wifi,
  Router,
  Settings,
  Zap
} from 'lucide-react';

interface AssetDetailModalProps {
  asset: Asset;
  open: boolean;
  onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  open,
  onClose,
}) => {
  const formatBandwidth = (bps?: number) => {
    if (!bps) return "0 bps";
    if (bps > 1000000000) return `${(bps / 1000000000).toFixed(1)} Gbps`;
    if (bps > 1000000) return `${(bps / 1000000).toFixed(1)} Mbps`;
    if (bps > 1000) return `${(bps / 1000).toFixed(1)} Kbps`;
    return `${bps} bps`;
  };

  const formatBytes = (mb?: number) => {
    if (!mb) return "0 MB";
    if (mb > 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleString();
  };

  // Parse SCADA data for Modbus-specific information
  const getModbusDetails = () => {
    if (!asset.scada_data) return null;
    
    const modbusData: any = {};
    Object.entries(asset.scada_data).forEach(([key, value]) => {
      if (key.toLowerCase().includes('modbus')) {
        modbusData[key] = value;
      }
    });
    
    return Object.keys(modbusData).length > 0 ? modbusData : null;
  };

  const modbusDetails = getModbusDetails();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Asset Details: {asset.name || 'Unknown Device'}
          </DialogTitle>
          <DialogDescription>
            Detailed information for {asset.mac_address}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Name</label>
                  <p className="font-mono">{asset.name || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Device Type</label>
                  <Badge variant="outline">{asset.device_type || 'Unknown'}</Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Vendor</label>
                  <p>{asset.vendor || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Connection</label>
                  <Badge className={asset.connection === 'Connected' ? 'bg-green-500' : 'bg-red-500'}>
                    {asset.connection || 'Unknown'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Router className="h-4 w-4" />
                Network Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                  <p className="font-mono">{asset.src_ip || asset.ip_address || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">MAC Address</label>
                  <p className="font-mono">{asset.mac_address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Network</label>
                  <p>{asset.network || 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Technology</label>
                  <p>{asset.technology || 'Unknown'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protocol Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-4 w-4" />
                Protocol Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Primary Protocol</label>
                  <Badge variant="secondary">{asset.eth_proto || 'Unknown'}</Badge>
                </div>
                {asset.scada_protocols && asset.scada_protocols.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">SCADA Protocols</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.scada_protocols.map((protocol, index) => (
                        <Badge key={index} className="bg-orange-500">
                          {protocol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {asset.ip_protocols && asset.ip_protocols.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP Protocols</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {asset.ip_protocols.map((protocol, index) => (
                        <Badge key={index} variant="outline">
                          {protocol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    Download Speed
                  </label>
                  <p className="font-mono">{formatBandwidth(asset.download_bps)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Upload className="h-3 w-3" />
                    Upload Speed
                  </label>
                  <p className="font-mono">{formatBandwidth(asset.upload_bps)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Usage (24h)</label>
                  <p>{formatBytes(asset.usage_mb)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wireless Information (if applicable) */}
          {asset.wifi && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-4 w-4" />
                  Wireless Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">WiFi Network</label>
                    <p>{asset.wifi}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Channel</label>
                    <p>{asset.channel || 'Unknown'}</p>
                  </div>
                  {asset.signal_strength && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                        <Signal className="h-3 w-3" />
                        Signal Strength
                      </label>
                      <p>{asset.signal_strength} dBm</p>
                    </div>
                  )}
                  {asset.ccq && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">CCQ</label>
                      <p>{asset.ccq}%</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">First Seen</label>
                  <p>{asset.first_seen ? new Date(asset.first_seen).toLocaleString() : 'Unknown'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Seen</label>
                  <p>{asset.last_seen ? new Date(asset.last_seen).toLocaleString() : 'Unknown'}</p>
                </div>
                {asset.uptime && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Uptime</label>
                    <p>{asset.uptime}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SCADA Protocol Details */}
        {asset.scada_protocols && asset.scada_protocols.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                SCADA Protocol Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {asset.scada_protocols.map((protocol, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-4 w-4 text-orange-500" />
                      <h4 className="font-semibold">{protocol}</h4>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    
                    {protocol.toLowerCase().includes('modbus') && modbusDetails && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Unit ID</label>
                          <p className="font-mono text-sm">
                            {modbusDetails.unit_id || modbusDetails.modbus_unit_id || '1'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Coils Used</label>
                          <p className="font-mono text-sm">
                            {modbusDetails.coils_count || modbusDetails.modbus_coils || '0-100'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Registers</label>
                          <p className="font-mono text-sm">
                            {modbusDetails.registers_count || modbusDetails.modbus_registers || '40001-40020'}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Last Update</label>
                          <p className="text-sm">
                            {formatTimestamp(modbusDetails.last_update || modbusDetails.modbus_last_seen)}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Function Codes</label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {(modbusDetails.function_codes || ['01', '03', '04']).map((code: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                FC{code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Status</label>
                          <Badge variant="outline" className="text-green-600">
                            {modbusDetails.status || 'Connected'}
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    {!protocol.toLowerCase().includes('modbus') && (
                      <div className="text-sm text-muted-foreground">
                        <p>Protocol: {protocol}</p>
                        <p>Status: Active</p>
                        <p>Last seen: {formatTimestamp(asset.last_seen)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Port Information */}
        {((asset.tcp_ports && asset.tcp_ports.length > 0) || (asset.udp_ports && asset.udp_ports.length > 0)) && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Port Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {asset.tcp_ports && asset.tcp_ports.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">TCP Ports</label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.tcp_ports.slice(0, 20).map((port, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {port}
                        </Badge>
                      ))}
                      {asset.tcp_ports.length > 20 && (
                        <Badge variant="secondary" className="text-xs">
                          +{asset.tcp_ports.length - 20} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                {asset.udp_ports && asset.udp_ports.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">UDP Ports</label>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {asset.udp_ports.slice(0, 20).map((port, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {port}
                        </Badge>
                      ))}
                      {asset.udp_ports.length > 20 && (
                        <Badge variant="secondary" className="text-xs">
                          +{asset.udp_ports.length - 20} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* General SCADA Data */}
        {asset.scada_data && Object.keys(asset.scada_data).length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Additional SCADA Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(asset.scada_data).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sm font-medium text-muted-foreground">{key}</label>
                    <p className="font-mono text-sm">{String(value)}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};
