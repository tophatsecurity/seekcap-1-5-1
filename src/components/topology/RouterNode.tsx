
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Router, Wifi } from 'lucide-react';

const RouterNode = ({ data }) => {
  const { device } = data;
  const isSwitch = device?.device_type?.toLowerCase().includes('switch');
  const ipAddress = device?.ip_address || 'Unknown IP';
  const name = device?.name || 'Router';

  return (
    <div className="bg-black border border-blue-600 rounded-lg p-3 text-center w-44">
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
      
      <div className="flex flex-col items-center">
        <div className="p-3 bg-blue-900 rounded-full mb-2">
          {isSwitch ? (
            <Wifi className="h-10 w-10 text-blue-400" />
          ) : (
            <Router className="h-10 w-10 text-blue-400" />
          )}
        </div>
        <div className="text-sm font-medium text-blue-300 truncate max-w-full">
          {name}
        </div>
        <div className="text-xs text-blue-300 mt-1">
          {ipAddress}
        </div>
        {device?.connected && (
          <div className="text-xs text-blue-400 mt-1">
            {device.connected} connected devices
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
    </div>
  );
};

export default memo(RouterNode);
