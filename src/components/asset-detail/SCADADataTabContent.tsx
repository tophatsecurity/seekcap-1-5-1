
import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SCADADataTabContentProps {
  scadaData: Record<string, any>;
}

export const SCADADataTabContent: React.FC<SCADADataTabContentProps> = ({
  scadaData
}) => (
  <Card>
    <CardHeader>
      <CardTitle>SCADA Data</CardTitle>
      <CardDescription>Additional industrial control data</CardDescription>
    </CardHeader>
    <CardContent>
      {Object.keys(scadaData).length > 0 ? (
        <pre className="bg-muted p-4 rounded-md overflow-auto">
          {JSON.stringify(scadaData, null, 2)}
        </pre>
      ) : (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4" />
          No SCADA data available for this device
        </div>
      )}
    </CardContent>
  </Card>
);
