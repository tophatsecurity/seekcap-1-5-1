
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProtocolsTabContentProps {
  scadaProtocols: string[];
}

export const ProtocolsTabContent: React.FC<ProtocolsTabContentProps> = ({
  scadaProtocols
}) => (
  <Card>
    <CardHeader>
      <CardTitle>SCADA Protocols</CardTitle>
      <CardDescription>Industrial protocols detected</CardDescription>
    </CardHeader>
    <CardContent>
      {scadaProtocols.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {scadaProtocols.map((protocol: string) => (
            <Badge key={protocol} variant="outline">{protocol}</Badge>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4" />
          No SCADA protocols detected on this device
        </div>
      )}
    </CardContent>
  </Card>
);
