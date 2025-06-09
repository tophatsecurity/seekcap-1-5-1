
import React from 'react';
import { Router } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/lib/db/types';

interface NetworkInfoSectionProps {
  asset: Asset;
}

export const NetworkInfoSection: React.FC<NetworkInfoSectionProps> = ({ asset }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Router className="h-4 w-4" />
        Network Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">IP Address</label>
          <p className="font-mono">{asset.src_ip || asset.ip_address || 'Unknown'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">MAC Address</label>
          <p className="font-mono">{asset.mac_address}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Network</label>
          <p>{asset.network || 'Unknown'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Technology</label>
          <p>{asset.technology || 'Unknown'}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
