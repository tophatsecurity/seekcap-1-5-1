
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTimestamp } from './formatters';
import { Activity, Settings, Zap } from 'lucide-react';

interface ModbusDetailsProps {
  protocolData: any;
}

export const ModbusDetails: React.FC<ModbusDetailsProps> = ({ protocolData }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings className="h-4 w-4" />
          Configuration Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Unit ID</label>
            <p className="font-mono text-sm font-semibold">
              {protocolData.unit_id || protocolData.modbus_unit_id || '1'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Connection Type</label>
            <Badge variant="outline">
              {protocolData.connection_type || 'TCP'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Port</label>
            <p className="font-mono text-sm">
              {protocolData.port || '502'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Coils Range</label>
            <p className="font-mono text-sm">
              {protocolData.coils_count || protocolData.modbus_coils || '0-100'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Registers Range</label>
            <p className="font-mono text-sm">
              {protocolData.registers_count || protocolData.modbus_registers || '40001-40020'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Badge variant="outline" className="text-green-600">
              {protocolData.status || 'Connected'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Activity className="h-4 w-4" />
          Performance & Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Response Time</label>
            <p className="text-sm font-semibold text-green-600">
              {protocolData.response_time || '25ms'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Transaction Count</label>
            <p className="text-sm">
              {protocolData.transaction_count || '847'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Error Count</label>
            <p className="text-sm">
              {protocolData.error_count || '0'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Last Update</label>
            <p className="text-sm">
              {formatTimestamp(protocolData.last_update || protocolData.modbus_last_seen)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Zap className="h-4 w-4" />
          Function Codes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1">
          {(protocolData.function_codes || ['01', '03', '04']).map((code: string, idx: number) => (
            <Badge key={idx} variant="secondary" className="text-xs">
              FC{code}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);
