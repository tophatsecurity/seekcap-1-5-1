
import React from 'react';
import { Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/lib/db/types';

interface ProtocolInfoSectionProps {
  asset: Asset;
}

export const ProtocolInfoSection: React.FC<ProtocolInfoSectionProps> = ({ asset }) => (
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
);
