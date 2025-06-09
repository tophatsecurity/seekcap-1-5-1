
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface IEC61850DetailsProps {
  protocolData: any;
}

export const IEC61850Details: React.FC<IEC61850DetailsProps> = ({ protocolData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
    <div>
      <label className="text-sm font-medium text-muted-foreground">IED Name</label>
      <p className="font-mono text-sm">
        {protocolData.ied_name || protocolData.iec_ied || 'IED_001'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Logical Devices</label>
      <p className="font-mono text-sm">
        {protocolData.logical_devices || protocolData.iec_ld || 'LD0, CTRL'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Dataset Count</label>
      <p className="font-mono text-sm">
        {protocolData.dataset_count || protocolData.iec_datasets || '15'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Report Control Blocks</label>
      <p className="text-sm">
        {protocolData.rcb_count || protocolData.iec_rcb || '8'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">GOOSE Messages</label>
      <Badge variant="secondary" className="text-xs">
        {protocolData.goose_enabled ? 'Enabled' : 'Disabled'}
      </Badge>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">MMS Connection</label>
      <Badge variant="outline" className="text-green-600">
        {protocolData.mms_status || 'Active'}
      </Badge>
    </div>
  </div>
);
