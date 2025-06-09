
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Network, Database } from 'lucide-react';

interface DNP3DetailsProps {
  protocolData: any;
}

export const DNP3Details: React.FC<DNP3DetailsProps> = ({ protocolData }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          Address Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Source Address</label>
            <p className="font-mono text-sm font-semibold">
              {protocolData.source_address || protocolData.dnp3_src || '1'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Destination Address</label>
            <p className="font-mono text-sm font-semibold">
              {protocolData.destination_address || protocolData.dnp3_dst || '100'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Application Layer</label>
            <Badge variant="outline">
              {protocolData.app_layer || protocolData.dnp3_app_layer || 'Level 2'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Data Link Layer</label>
            <Badge variant="outline">
              {protocolData.data_link_layer || 'Confirmed'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Connection Status</label>
            <Badge variant="outline" className="text-green-600">
              {protocolData.connection_status || 'Online'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Unsolicited Enabled</label>
            <Badge variant={protocolData.unsolicited_enabled ? "default" : "secondary"}>
              {protocolData.unsolicited_enabled ? 'Yes' : 'No'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4" />
          Object Groups & Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Object Groups</label>
            <div className="flex flex-wrap gap-1 mt-1">
              {(protocolData.object_groups || ['Analog Input', 'Binary Input']).map((group: string, idx: number) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {group}
                </Badge>
              ))}
            </div>
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
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Network className="h-4 w-4" />
          Communication Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Integrity Poll Rate</label>
            <p className="text-sm">
              {protocolData.integrity_poll_rate || '30s'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Event Buffer Size</label>
            <p className="text-sm">
              {protocolData.event_buffer_size || '100'} events
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
