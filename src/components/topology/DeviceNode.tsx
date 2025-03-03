
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Computer, Smartphone, Printer, Monitor, Server, HardDrive, Laptop, Tv } from 'lucide-react';

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
  } else {
    return <Monitor className="h-8 w-8 text-blue-400" />;
  }
}

const DeviceNode = ({ data }) => {
  const { device } = data;
  const icon = getDeviceIcon(device?.device_type);
  const ipAddress = device?.ip_address || device?.src_ip || 'Unknown IP';
  const name = device?.name || 'Unknown Device';

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
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
    </div>
  );
};

export default memo(DeviceNode);
