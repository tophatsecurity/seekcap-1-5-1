
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Network } from 'lucide-react';

const SwitchNode = ({ data }) => {
  const { device } = data;
  const ipAddress = device?.ip_address || 'Unknown IP';
  const name = device?.name || 'Switch';
  const status = device?.status || 'Unknown';
  const application = device?.application || 'Network';

  return (
    <div className="bg-black border border-blue-500 rounded-lg p-3 text-center w-44">
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
      
      <div className="flex flex-col items-center">
        <div className="p-3 bg-blue-900 rounded-full mb-2">
          <Network className="h-10 w-10 text-blue-300" />
        </div>
        <div className="text-sm font-bold text-blue-300 truncate max-w-full">
          {name}
        </div>
        <div className="text-xs text-blue-300 mt-1">
          {ipAddress}
        </div>
        <div className="flex items-center justify-center mt-1">
          <div className={`h-2 w-2 rounded-full mr-1 ${status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs text-blue-400">{status}</span>
        </div>
        <div className="text-xs text-blue-400 mt-1">
          {application}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
    </div>
  );
};

export default memo(SwitchNode);
