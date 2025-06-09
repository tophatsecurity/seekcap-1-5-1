
import React from 'react';
import { Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/lib/db/types';

interface BasicInfoSectionProps {
  asset: Asset;
}

export const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ asset }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Network className="h-4 w-4" />
        Basic Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Name</label>
          <p className="font-mono">{asset.name || 'Unknown'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Device Type</label>
          <Badge variant="outline">{asset.device_type || 'Unknown'}</Badge>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Vendor</label>
          <p>{asset.vendor || 'Unknown'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Connection</label>
          <Badge className={asset.connection === 'Connected' ? 'bg-green-500' : 'bg-red-500'}>
            {asset.connection || 'Unknown'}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);
