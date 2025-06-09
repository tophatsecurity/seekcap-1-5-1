
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Wifi, Server, Network, TrendingUp, TrendingDown, Globe } from "lucide-react";
import { AssetType, Protocol, Subnet } from "@/lib/types";

interface MetricsCardsProps {
  assetTypes: AssetType[];
  protocols: Protocol[];
  subnets: Subnet[];
}

export const MetricsCards = ({ assetTypes, protocols, subnets }: MetricsCardsProps) => {
  const totalAssets = assetTypes.reduce((acc, type) => acc + type.count, 0);
  const activeAssets = Math.floor(totalAssets * 0.92); // High active percentage for demo
  
  // Count SCADA devices based on protocols
  const scadaDevices = protocols
    .filter(p => 
      p.protocol.toLowerCase().includes('modbus') || 
      p.protocol.toLowerCase().includes('dnp3') || 
      p.protocol.toLowerCase().includes('ethernet/ip') ||
      p.protocol.toLowerCase().includes('profinet') ||
      p.protocol.toLowerCase().includes('bacnet')
    )
    .reduce((acc, p) => acc + p.count, 0);

  // Count total networks (subnets)
  const totalNetworks = subnets.length;

  // Calculate trend indicators (simulated positive trends for demo)
  const getTrendData = (current: number) => {
    const percentChange = 2 + Math.random() * 8; // 2-10% positive growth
    return {
      percentChange: percentChange,
      isPositive: true
    };
  };

  const totalAssetsTrend = getTrendData(totalAssets);
  const activeAssetsTrend = getTrendData(activeAssets);
  const scadaDevicesTrend = getTrendData(scadaDevices);
  const networksTrend = getTrendData(totalNetworks);

  // Calculate total bandwidth from subnets (simulated)
  const totalBandwidthGbps = (totalAssets * 0.85).toFixed(1); // Simulated based on asset count

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-500">
              +{totalAssetsTrend.percentChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Discovered network devices
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
          <Wifi className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAssets.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-500">
              +{activeAssetsTrend.percentChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Active in the last 24 hours
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">SCADA Devices</CardTitle>
          <Server className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{scadaDevices.toLocaleString()}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-500">
              +{scadaDevicesTrend.percentChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Industrial protocols detected
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Network Subnets</CardTitle>
          <Globe className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalNetworks}</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-xs text-green-500">
              +{networksTrend.percentChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Discovered network segments
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Bandwidth</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBandwidthGbps} Gbps</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-blue-500">{(parseFloat(totalBandwidthGbps) * 0.6).toFixed(1)} Gbps</span>
            <span className="text-xs text-muted-foreground">current usage</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Aggregate network capacity
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
