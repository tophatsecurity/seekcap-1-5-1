
import React from 'react';
import { Wifi, Signal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/lib/db/types';

interface WirelessInfoSectionProps {
  asset: Asset;
}

export const WirelessInfoSection: React.FC<WirelessInfoSectionProps> = ({ asset }) => {
  if (!asset.wifi) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wifi className="h-4 w-4" />
          Wireless Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">WiFi Network</label>
            <p>{asset.wifi}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Channel</label>
            <p>{asset.channel || 'Unknown'}</p>
          </div>
          {asset.signal_strength && (
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <Signal className="h-3 w-3" />
                Signal Strength
              </label>
              <p>{asset.signal_strength} dBm</p>
            </div>
          )}
          {asset.ccq && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">CCQ</label>
              <p>{asset.ccq}%</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
