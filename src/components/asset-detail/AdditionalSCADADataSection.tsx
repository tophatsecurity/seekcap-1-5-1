
import React from 'react';
import { Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/lib/db/types';

interface AdditionalSCADADataSectionProps {
  asset: Asset;
}

export const AdditionalSCADADataSection: React.FC<AdditionalSCADADataSectionProps> = ({ asset }) => {
  if (!asset.scada_data || Object.keys(asset.scada_data).length === 0) return null;

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Additional SCADA Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(asset.scada_data).map(([key, value]) => (
            <div key={key}>
              <label className="text-sm font-medium text-muted-foreground">{key}</label>
              <p className="font-mono text-sm">{String(value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
