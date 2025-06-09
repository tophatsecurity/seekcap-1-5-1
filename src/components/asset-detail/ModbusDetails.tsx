
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatTimestamp } from './formatters';

interface ModbusDetailsProps {
  protocolData: any;
}

export const ModbusDetails: React.FC<ModbusDetailsProps> = ({ protocolData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
    <div>
      <label className="text-sm font-medium text-muted-foreground">Unit ID</label>
      <p className="font-mono text-sm">
        {protocolData.unit_id || protocolData.modbus_unit_id || '1'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Coils Used</label>
      <p className="font-mono text-sm">
        {protocolData.coils_count || protocolData.modbus_coils || '0-100'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Registers</label>
      <p className="font-mono text-sm">
        {protocolData.registers_count || protocolData.modbus_registers || '40001-40020'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Last Update</label>
      <p className="text-sm">
        {formatTimestamp(protocolData.last_update || protocolData.modbus_last_seen)}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Function Codes</label>
      <div className="flex flex-wrap gap-1 mt-1">
        {(protocolData.function_codes || ['01', '03', '04']).map((code: string, idx: number) => (
          <Badge key={idx} variant="secondary" className="text-xs">
            FC{code}
          </Badge>
        ))}
      </div>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Status</label>
      <Badge variant="outline" className="text-green-600">
        {protocolData.status || 'Connected'}
      </Badge>
    </div>
  </div>
);
