
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cpu, Network, FileCode } from "lucide-react";
import { AssetType, Protocol, ScadaInfo } from "@/lib/types";

interface ProtocolsSectionProps {
  assetTypes: AssetType[];
  protocols: Protocol[];
  scadaInfo: ScadaInfo[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const ProtocolsSection = ({ assetTypes, protocols, scadaInfo }: ProtocolsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>SCADA Protocols</CardTitle>
          <Cpu className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {assetTypes.length > 0 ? (
            <div className="space-y-4">
              {assetTypes.map((type, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span>{type.type}</span>
                  </div>
                  <span className="font-medium">{type.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">No data available</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Source/Endpoint Protocols</CardTitle>
          <Network className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {protocols.length > 0 ? (
            <div className="space-y-4">
              {protocols.map((protocol, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span>{protocol.name}</span>
                  </div>
                  <span className="font-medium">{protocol.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">No protocol data available</div>
          )}
        </CardContent>
      </Card>

      <Card className="col-span-1 lg:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>SCADA Devices</CardTitle>
          <FileCode className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {scadaInfo.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scadaInfo.map((device, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{device.ipAddress}</TableCell>
                      <TableCell>{device.protocol}</TableCell>
                      <TableCell>{device.version}</TableCell>
                      <TableCell>{device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Unknown'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">No SCADA data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
