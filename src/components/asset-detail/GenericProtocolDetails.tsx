
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTimestamp } from './formatters';
import { Settings, Activity } from 'lucide-react';

interface GenericProtocolDetailsProps {
  protocol: string;
  protocolData: any;
}

export const GenericProtocolDetails: React.FC<GenericProtocolDetailsProps> = ({ protocol, protocolData }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          {protocol} Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Protocol Version</label>
            <p className="text-sm font-semibold">
              {protocolData.version || protocolData[`${protocol.toLowerCase()}_version`] || 'Unknown'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Connection Status</label>
            <Badge variant="outline" className="text-green-600">
              {protocolData.status || protocolData.connection_status || 'Active'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Data Points</label>
            <p className="text-sm">
              {protocolData.data_points || protocolData.point_count || 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          Communication Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Communication</label>
            <p className="text-sm">
              {formatTimestamp(protocolData.last_seen || protocolData.last_communication)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Uptime</label>
            <p className="text-sm">
              {protocolData.uptime || 'N/A'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
