
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Router, Wifi, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const RouterNode = ({ data }) => {
  const { device, isExpanded = false, onExpand } = data;
  const isSwitch = device?.device_type?.toLowerCase().includes('switch');
  const ipAddress = device?.ip_address || 'Unknown IP';
  const name = device?.name || 'Router';
  const connectedDevices = device?.connected || 0;

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
        {connectedDevices > 0 && (
          <div className="text-xs text-blue-400 mt-1">
            {connectedDevices} connected devices
          </div>
        )}

        {/* Assets expand/collapse button */}
        {onExpand && connectedDevices > 0 && (
          <div className="flex items-center justify-center mt-2 pt-2 border-t border-blue-800 w-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 p-1"
            >
              {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              Assets ({connectedDevices})
            </Button>
          </div>
        )}

        {isExpanded && (
          <Badge variant="secondary" className="text-xs bg-blue-900/30 text-blue-400 mt-1">
            Expanded
          </Badge>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
    </div>
  );
};

export default memo(RouterNode);
