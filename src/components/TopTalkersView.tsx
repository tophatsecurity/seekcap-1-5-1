
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, ArrowUp, ArrowDown, Activity } from "lucide-react";
import { Asset } from "@/lib/db/types";

interface TopTalkersViewProps {
  assets: Asset[];
}

interface TopTalker {
  mac_address: string;
  name?: string;
  ip_address?: string;
  vendor?: string;
  device_type?: string;
  download_bps: number;
  upload_bps: number;
  total_bps: number;
  usage_mb: number;
  protocols: string[];
  tcp_ports: number[];
  udp_ports: number[];
}

export const TopTalkersView: React.FC<TopTalkersViewProps> = ({ assets }) => {
  const topTalkers = useMemo(() => {
    const talkers: TopTalker[] = assets
      .filter(asset => (asset.download_bps || 0) > 0 || (asset.upload_bps || 0) > 0 || (asset.usage_mb || 0) > 0)
      .map(asset => ({
        mac_address: asset.mac_address,
        name: asset.name,
        ip_address: asset.src_ip || asset.ip_address,
        vendor: asset.vendor,
        device_type: asset.device_type,
        download_bps: asset.download_bps || 0,
        upload_bps: asset.upload_bps || 0,
        total_bps: (asset.download_bps || 0) + (asset.upload_bps || 0),
        usage_mb: asset.usage_mb || 0,
        protocols: asset.ip_protocols || [],
        tcp_ports: asset.tcp_ports || [],
        udp_ports: asset.udp_ports || []
      }))
      .sort((a, b) => b.total_bps - a.total_bps);

    return talkers;
  }, [assets]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatMB = (mb: number) => {
    if (mb === 0) return '0 MB';
    if (mb < 1024) return `${mb.toFixed(2)} MB`;
    return `${(mb / 1024).toFixed(2)} GB`;
  };

  const getBandwidthLevel = (bps: number) => {
    if (bps > 10000000) return "high"; // > 10 MB/s
    if (bps > 1000000) return "medium"; // > 1 MB/s
    return "low";
  };

  const getTotalStats = () => {
    const totalDownload = topTalkers.reduce((sum, talker) => sum + talker.download_bps, 0);
    const totalUpload = topTalkers.reduce((sum, talker) => sum + talker.upload_bps, 0);
    const totalUsage = topTalkers.reduce((sum, talker) => sum + talker.usage_mb, 0);
    
    return { totalDownload, totalUpload, totalUsage };
  };

  const stats = getTotalStats();

  if (topTalkers.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No network activity data found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Download</CardTitle>
            <ArrowDown className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(stats.totalDownload)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Upload</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatBytes(stats.totalUpload)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usage</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMB(stats.totalUsage)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Top Talkers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Talkers - Network Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Download</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead>Total Usage</TableHead>
                <TableHead>Protocols</TableHead>
                <TableHead>Active Ports</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topTalkers.map((talker) => (
                <TableRow key={talker.mac_address}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-mono text-sm">{talker.mac_address}</div>
                      {talker.name && (
                        <div className="text-xs text-muted-foreground">{talker.name}</div>
                      )}
                      {(talker.vendor || talker.device_type) && (
                        <div className="text-xs text-muted-foreground">
                          {talker.vendor} {talker.device_type && `• ${talker.device_type}`}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-mono text-sm">{talker.ip_address || "—"}</span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-blue-500" />
                      <span className={`font-medium ${getBandwidthLevel(talker.download_bps) === 'high' ? 'text-red-600' : getBandwidthLevel(talker.download_bps) === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {formatBytes(talker.download_bps)}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-green-500" />
                      <span className={`font-medium ${getBandwidthLevel(talker.upload_bps) === 'high' ? 'text-red-600' : getBandwidthLevel(talker.upload_bps) === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                        {formatBytes(talker.upload_bps)}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <span className="font-medium">{formatMB(talker.usage_mb)}</span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {talker.protocols.slice(0, 3).map((protocol, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {protocol}
                        </Badge>
                      ))}
                      {talker.protocols.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{talker.protocols.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {talker.tcp_ports.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground">TCP:</span>
                          {talker.tcp_ports.slice(0, 3).map((port, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {port}
                            </Badge>
                          ))}
                          {talker.tcp_ports.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{talker.tcp_ports.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                      {talker.udp_ports.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-muted-foreground">UDP:</span>
                          {talker.udp_ports.slice(0, 3).map((port, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {port}
                            </Badge>
                          ))}
                          {talker.udp_ports.length > 3 && (
                            <span className="text-xs text-muted-foreground">
                              +{talker.udp_ports.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
