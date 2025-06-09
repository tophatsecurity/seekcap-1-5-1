
import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/lib/db/types';

interface TimingInfoSectionProps {
  asset: Asset;
}

export const TimingInfoSection: React.FC<TimingInfoSectionProps> = ({ asset }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Timing Information
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-muted-foreground">First Seen</label>
          <p>{asset.first_seen ? new Date(asset.first_seen).toLocaleString() : 'Unknown'}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Last Seen</label>
          <p>{asset.last_seen ? new Date(asset.last_seen).toLocaleString() : 'Unknown'}</p>
        </div>
        {asset.uptime && (
          <div>
            <label className="text-sm font-medium text-muted-foreground">Uptime</label>
            <p>{asset.uptime}</p>
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);
