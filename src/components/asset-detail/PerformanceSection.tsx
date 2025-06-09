
import React from 'react';
import { Activity, Download, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Asset } from '@/lib/db/types';
import { formatBandwidth, formatBytes } from './formatters';

interface PerformanceSectionProps {
  asset: Asset;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({ asset }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Activity className="h-4 w-4" />
        Performance Metrics
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Download className="h-3 w-3" />
            Download Speed
          </label>
          <p className="font-mono">{formatBandwidth(asset.download_bps)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <Upload className="h-3 w-3" />
            Upload Speed
          </label>
          <p className="font-mono">{formatBandwidth(asset.upload_bps)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Usage (24h)</label>
          <p>{formatBytes(asset.usage_mb)}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);
