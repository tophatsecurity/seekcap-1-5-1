
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Cpu, Network, FileCode } from "lucide-react";
import { Protocol, ScadaInfo, OuiInfo } from "@/lib/types";

interface ProtocolsSectionProps {
  protocols: Protocol[];
  scadaInfo: ScadaInfo[];
  ouiInfo: OuiInfo[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const ProtocolsSection = ({ protocols, scadaInfo, ouiInfo }: ProtocolsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>SCADA Protocols</CardTitle>
          <Cpu className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {scadaInfo.length > 0 ? (
            <div className="space-y-4">
              {scadaInfo.map((info, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span>{info.protocol}</span>
                  </div>
                  <span className="font-medium">{info.devices}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">No SCADA data available</div>
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
                    <span>{protocol.protocol}</span>
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hardware Vendors</CardTitle>
          <FileCode className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {ouiInfo.length > 0 ? (
            <div className="space-y-4">
              {ouiInfo.slice(0, 5).map((vendor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span>{vendor.vendor}</span>
                  </div>
                  <span className="font-medium">{vendor.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">No vendor data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
