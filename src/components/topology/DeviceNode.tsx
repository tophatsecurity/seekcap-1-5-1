
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Computer, 
  Smartphone, 
  Printer, 
  Monitor, 
  Server, 
  HardDrive, 
  Laptop, 
  Tv, 
  Thermometer, 
  Cpu, 
  Video, 
  Lock, 
  Wrench,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

function getDeviceIcon(deviceType?: string) {
  const type = deviceType?.toLowerCase() || '';
  
  if (type.includes('computer') || type.includes('pc')) {
    return <Computer className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('phone') || type.includes('smartphone') || type.includes('mobile')) {
    return <Smartphone className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('printer')) {
    return <Printer className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('server')) {
    return <Server className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('storage') || type.includes('nas')) {
    return <HardDrive className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('laptop')) {
    return <Laptop className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('tv') || type.includes('television')) {
    return <Tv className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('bacnet') || type.includes('hvac') || type.includes('thermostat')) {
    return <Thermometer className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('plc') || type.includes('cip') || type.includes('controller')) {
    return <Cpu className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('camera') || type.includes('video')) {
    return <Video className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('security') || type.includes('access')) {
    return <Lock className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('modbus') || type.includes('motor') || type.includes('drive')) {
    return <Wrench className="h-8 w-8 text-blue-400" />;
  } else {
    return <Monitor className="h-8 w-8 text-blue-400" />;
  }
}

function getProtocolColor(protocol?: string) {
  if (!protocol) return 'bg-gray-500';
  
  const protocolLower = protocol.toLowerCase();
  
  if (protocolLower.includes('bacnet')) return 'bg-yellow-600 text-yellow-100';
  if (protocolLower.includes('modbus')) return 'bg-red-600 text-red-100';
  if (protocolLower.includes('cip')) return 'bg-green-600 text-green-100';
  if (protocolLower.includes('mqtt')) return 'bg-purple-600 text-purple-100';
  if (protocolLower.includes('http')) return 'bg-blue-600 text-blue-100';
  if (protocolLower.includes('snmp')) return 'bg-orange-600 text-orange-100';
  
  return 'bg-gray-600 text-gray-100';
}

const DeviceNode = ({ data }) => {
  const { device } = data;
  const icon = getDeviceIcon(device?.device_type);
  const ipAddress = device?.ip_address || device?.src_ip || 'Unknown IP';
  const name = device?.name || 'Unknown Device';
  const vendor = device?.vendor || '';
  const protocol = device?.protocol || '';

  return (
    <div className="bg-black border border-blue-700 rounded-lg p-2 text-center w-40">
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
      
      <div className="flex flex-col items-center">
        <div className="p-2 bg-blue-950 rounded-full mb-2">
          {icon}
        </div>
        <div className="text-sm font-medium text-blue-400 truncate max-w-full">
          {name}
        </div>
        <div className="text-xs text-blue-300 mt-1">
          {ipAddress}
        </div>
        {vendor && (
          <div className="text-xs text-blue-300 mt-1">
            {vendor}
          </div>
        )}
        {protocol && (
          <Badge 
            className={`mt-2 text-[10px] px-2 py-0.5 ${getProtocolColor(protocol)}`}
            variant="secondary"
          >
            {protocol}
          </Badge>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
    </div>
  );
};

export default memo(DeviceNode);
