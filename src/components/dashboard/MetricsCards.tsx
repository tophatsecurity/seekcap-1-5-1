
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Wifi, Server, Network, TrendingUp, TrendingDown } from "lucide-react";
import { AssetType, Protocol, Subnet } from "@/lib/types";

interface MetricsCardsProps {
  assetTypes: AssetType[];
  protocols: Protocol[];
  subnets: Subnet[];
}

export const MetricsCards = ({ assetTypes, protocols, subnets }: MetricsCardsProps) => {
  const totalAssets = assetTypes.reduce((acc, type) => acc + type.count, 0);
  const activeAssets = Math.floor(totalAssets * 0.8); // Simulated active assets
  const scadaDevices = protocols.filter(p => 
    p.protocol.toLowerCase().includes('modbus') || 
    p.protocol.toLowerCase().includes('dnp3') || 
    p.protocol.toLowerCase().includes('iec')
  ).reduce((acc, p) => acc + p.count, 0);

  // Calculate trend indicators (simulated data)
  const getTrendData = (current: number) => {
    const previousValue = Math.floor(current * (0.9 + Math.random() * 0.2)); // ±10% variation
    const change = current - previousValue;
    const percentChange = previousValue > 0 ? (change / previousValue) * 100 : 0;
    return {
      change,
      percentChange: Math.abs(percentChange),
      isPositive: change >= 0
    };
  };

  const totalAssetsTrend = getTrendData(totalAssets);
  const activeAssetsTrend = getTrendData(activeAssets);
  const scadaDevicesTrend = getTrendData(scadaDevices);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssets}</div>
          <div className="flex items-center gap-1 mt-1">
            {totalAssetsTrend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${totalAssetsTrend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {totalAssetsTrend.percentChange.toFixed(1)}%
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
          <div className="text-2xl font-bold">{activeAssets}</div>
          <div className="flex items-center gap-1 mt-1">
            {activeAssetsTrend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${activeAssetsTrend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {activeAssetsTrend.percentChange.toFixed(1)}%
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
          <div className="text-2xl font-bold">{scadaDevices}</div>
          <div className="flex items-center gap-1 mt-1">
            {scadaDevicesTrend.isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${scadaDevicesTrend.isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {scadaDevicesTrend.percentChange.toFixed(1)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last period</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            With SCADA protocols detected
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Bandwidth</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1.4 TB</div>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="h-3 w-3 text-blue-500" />
            <span className="text-xs text-blue-500">500 Mbps</span>
            <span className="text-xs text-muted-foreground">current usage</span>
          </div>
          <p className="text-xs text-muted-foreground pt-1">
            Total network capacity
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
