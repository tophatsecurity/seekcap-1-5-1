
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Activity, Network, TrendingUp } from "lucide-react";
import { Asset } from "@/lib/db/types";

interface AssetsMetricsCardsProps {
  assets: Asset[];
  rockwellCount: number;
  modbusCount: number;
}

export const AssetsMetricsCards = ({ assets, rockwellCount, modbusCount }: AssetsMetricsCardsProps) => {
  const connectedCount = assets.filter(a => a.connection === 'Connected').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{assets.length}</div>
          <p className="text-xs text-muted-foreground">
            Network devices discovered
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Rockwell/AB Devices</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rockwellCount}</div>
          <p className="text-xs text-muted-foreground">
            Rockwell Automation & Allen-Bradley
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Modbus Devices</CardTitle>
          <Network className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{modbusCount}</div>
          <p className="text-xs text-muted-foreground">
            Using Modbus protocol
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Connected Assets</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{connectedCount}</div>
          <p className="text-xs text-muted-foreground">
            Currently online
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
