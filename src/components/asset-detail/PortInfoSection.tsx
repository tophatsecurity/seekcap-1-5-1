
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/lib/db/types';

interface PortInfoSectionProps {
  asset: Asset;
}

export const PortInfoSection: React.FC<PortInfoSectionProps> = ({ asset }) => {
  const hasPorts = (asset.tcp_ports && asset.tcp_ports.length > 0) || (asset.udp_ports && asset.udp_ports.length > 0);
  
  if (!hasPorts) return null;

  return (
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
  );
};
