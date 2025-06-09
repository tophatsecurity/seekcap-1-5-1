
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OverviewTabContentProps {
  ethProto: string;
  icmp: boolean;
  ipProtocols: string[];
}

export const OverviewTabContent: React.FC<OverviewTabContentProps> = ({
  ethProto,
  icmp,
  ipProtocols
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Asset Overview</CardTitle>
      <CardDescription>Basic information about this device</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Ethernet Protocol</h3>
          <p className="text-md">{ethProto}</p>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">ICMP Status</h3>
          <p className="text-md">{icmp ? "Responding" : "Not responding"}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-2">IP Protocols</h3>
        {ipProtocols.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {ipProtocols.map((protocol: string) => (
              <Badge key={protocol} variant="outline">{protocol}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No IP protocols detected</p>
        )}
      </div>
    </CardContent>
  </Card>
);
