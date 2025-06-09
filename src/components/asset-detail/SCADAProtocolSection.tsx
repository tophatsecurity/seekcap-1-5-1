
import React from 'react';
import { Settings, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/lib/db/types';
import { ProtocolDetailsRenderer } from './ProtocolDetailsRenderer';
import { formatTimestamp } from './formatters';

interface SCADAProtocolSectionProps {
  asset: Asset;
}

export const SCADAProtocolSection: React.FC<SCADAProtocolSectionProps> = ({ asset }) => {
  if (!asset.scada_protocols || asset.scada_protocols.length === 0) return null;

  return (
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
              
              <ProtocolDetailsRenderer protocol={protocol} scadaData={asset.scada_data} />
              
              {!asset.scada_data && (
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
  );
};
