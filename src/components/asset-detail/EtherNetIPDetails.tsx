
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Network, Info } from 'lucide-react';

interface EtherNetIPDetailsProps {
  protocolData: any;
}

export const EtherNetIPDetails: React.FC<EtherNetIPDetailsProps> = ({ protocolData }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Info className="h-4 w-4" />
          Device Identity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Vendor ID</label>
            <p className="font-mono text-sm font-semibold">
              {protocolData.vendor_id || protocolData.enip_vendor || '0x001'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Product Code</label>
            <p className="font-mono text-sm font-semibold">
              {protocolData.product_code || protocolData.enip_product || '0x065'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Device Type</label>
            <Badge variant="outline">
              {protocolData.device_type || protocolData.enip_device_type || 'Generic Device'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Serial Number</label>
            <p className="font-mono text-sm">
              {protocolData.serial_number || '123456'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Revision</label>
            <p className="text-sm">
              {protocolData.revision || protocolData.enip_revision || '1.0'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Connection Status</label>
            <Badge variant="outline" className="text-green-600">
              {protocolData.connection_status || 'Connected'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Network className="h-4 w-4" />
          Assembly Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Assembly Instances</label>
            <p className="font-mono text-sm bg-muted p-2 rounded">
              {protocolData.assembly_instances || protocolData.enip_assemblies || 'Input: 100, Output: 101'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Connection Path</label>
            <p className="font-mono text-sm bg-muted p-2 rounded">
              {protocolData.connection_path || '20 04 24 01 30 03'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
