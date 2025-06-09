
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EtherNetIPDetailsProps {
  protocolData: any;
}

export const EtherNetIPDetails: React.FC<EtherNetIPDetailsProps> = ({ protocolData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
    <div>
      <label className="text-sm font-medium text-muted-foreground">Vendor ID</label>
      <p className="font-mono text-sm">
        {protocolData.vendor_id || protocolData.enip_vendor || '0x001'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Product Code</label>
      <p className="font-mono text-sm">
        {protocolData.product_code || protocolData.enip_product || '0x065'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Device Type</label>
      <p className="font-mono text-sm">
        {protocolData.device_type || protocolData.enip_device_type || 'Generic Device'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Assembly Instances</label>
      <p className="text-sm">
        {protocolData.assembly_instances || protocolData.enip_assemblies || 'Input: 100, Output: 101'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Connection Status</label>
      <Badge variant="outline" className="text-green-600">
        {protocolData.connection_status || 'Connected'}
      </Badge>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Revision</label>
      <p className="text-sm">
        {protocolData.revision || protocolData.enip_revision || '1.0'}
      </p>
    </div>
  </div>
);
