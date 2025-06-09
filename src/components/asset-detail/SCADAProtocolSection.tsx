
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
  // Show section even if no protocols are detected, with a message
  const protocols = asset.scada_protocols || [];
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          SCADA Protocol Details
          {protocols.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {protocols.length} Protocol{protocols.length > 1 ? 's' : ''} Detected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {protocols.length > 0 ? (
          <div className="space-y-6">
            {protocols.map((protocol, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <h4 className="font-semibold text-lg">{protocol}</h4>
                  <Badge variant="outline">Active</Badge>
                </div>
                
                <ProtocolDetailsRenderer protocol={protocol} scadaData={asset.scada_data} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No SCADA Protocols Detected</h3>
            <p className="text-sm">
              This device does not appear to be running any industrial control protocols.
              <br />
              Last seen: {formatTimestamp(asset.last_seen)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
