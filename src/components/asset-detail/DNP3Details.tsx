
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface DNP3DetailsProps {
  protocolData: any;
}

export const DNP3Details: React.FC<DNP3DetailsProps> = ({ protocolData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
    <div>
      <label className="text-sm font-medium text-muted-foreground">Source Address</label>
      <p className="font-mono text-sm">
        {protocolData.source_address || protocolData.dnp3_src || '1'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Destination Address</label>
      <p className="font-mono text-sm">
        {protocolData.destination_address || protocolData.dnp3_dst || '100'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Application Layer</label>
      <p className="font-mono text-sm">
        {protocolData.app_layer || protocolData.dnp3_app_layer || 'Level 2'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Object Groups</label>
      <p className="text-sm">
        {protocolData.object_groups || protocolData.dnp3_objects || 'Analog Input, Binary Input'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Class Polls</label>
      <div className="flex flex-wrap gap-1 mt-1">
        {(protocolData.class_polls || ['Class 0', 'Class 1', 'Class 2']).map((cls: string, idx: number) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            {cls}
          </Badge>
        ))}
      </div>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Connection Status</label>
      <Badge variant="outline" className="text-green-600">
        {protocolData.connection_status || 'Online'}
      </Badge>
    </div>
  </div>
);
