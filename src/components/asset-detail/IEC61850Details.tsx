
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Database, Network } from 'lucide-react';

interface IEC61850DetailsProps {
  protocolData: any;
}

export const IEC61850Details: React.FC<IEC61850DetailsProps> = ({ protocolData }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Server className="h-4 w-4" />
          IED Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">IED Name</label>
            <p className="font-mono text-sm font-semibold">
              {protocolData.ied_name || protocolData.iec_ied || 'IED_001'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Server Mode</label>
            <Badge variant="outline" className="text-green-600">
              {protocolData.server_mode || 'Active'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Access Point</label>
            <p className="font-mono text-sm">
              {protocolData.access_point || 'AP_1'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Association Count</label>
            <p className="text-sm">
              {protocolData.association_count || '2'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">MMS Connection</label>
            <Badge variant="outline" className="text-green-600">
              {protocolData.mms_status || 'Active'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4" />
          Logical Devices & Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Logical Devices</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {(protocolData.logical_devices || ['LD0', 'CTRL']).map((ld: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {ld}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Dataset Count</label>
            <p className="text-sm font-semibold">
              {protocolData.dataset_count || protocolData.iec_datasets || '15'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Report Control Blocks</label>
            <p className="text-sm font-semibold">
              {protocolData.rcb_count || protocolData.iec_rcb || '8'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Network className="h-4 w-4" />
          GOOSE & Communication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">GOOSE Messages</label>
            <Badge variant={protocolData.goose_enabled ? "default" : "secondary"}>
              {protocolData.goose_enabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Communication Status</label>
            <Badge variant="outline" className="text-green-600">
              Active
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
