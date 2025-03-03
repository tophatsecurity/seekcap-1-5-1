
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layers } from 'lucide-react';

const VlanNode = ({ data }) => {
  const { vlan } = data;
  const name = vlan?.name || 'VLAN';
  const id = vlan?.id || 0;
  const description = vlan?.description || '';

  return (
    <div className="bg-black border border-green-700 rounded-lg p-2 text-center w-36">
      <Handle type="target" position={Position.Top} className="!bg-green-500 !border-green-700 w-3 h-1.5" />
      
      <div className="flex flex-col items-center">
        <div className="p-2 bg-green-900/50 rounded-full mb-2">
          <Layers className="h-6 w-6 text-green-400" />
        </div>
        <div className="text-sm font-medium text-green-300 truncate max-w-full">
          {name}
        </div>
        <div className="text-xs text-green-400 mt-1">
          ID: {id}
        </div>
        {description && (
          <div className="text-xs text-green-500 mt-1">
            {description}
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-green-500 !border-green-700 w-3 h-1.5" />
    </div>
  );
};

export default memo(VlanNode);
