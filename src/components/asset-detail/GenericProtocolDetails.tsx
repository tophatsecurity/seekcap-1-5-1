
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from './formatters';

interface GenericProtocolDetailsProps {
  protocol: string;
  protocolData: any;
}

export const GenericProtocolDetails: React.FC<GenericProtocolDetailsProps> = ({ protocol, protocolData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
    <div>
      <label className="text-sm font-medium text-muted-foreground">Protocol Version</label>
      <p className="text-sm">
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
      <label className="text-sm font-medium text-muted-foreground">Last Communication</label>
      <p className="text-sm">
        {formatTimestamp(protocolData.last_seen || protocolData.last_communication)}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Data Points</label>
      <p className="text-sm">
        {protocolData.data_points || protocolData.point_count || 'N/A'}
      </p>
    </div>
  </div>
);
