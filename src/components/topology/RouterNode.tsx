
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Router, Wifi, Leaf, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

const RouterNode = ({ data }) => {
  const { device, isExpanded = false, onExpand } = data;
  const navigate = useNavigate();
  const isSwitch = device?.device_type?.toLowerCase().includes('switch');
  const ipAddress = device?.ip_address || 'Unknown IP';
  const name = device?.name || 'Router';
  const connectedDevices = device?.connected || 0;
  const macAddress = device?.mac_address;

  const handleDetailClick = () => {
    if (macAddress) {
      navigate(`/assets/${encodeURIComponent(macAddress)}`);
    }
  };

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
            {connectedDevices} connected device{connectedDevices !== 1 ? 's' : ''}
          </div>
        )}

        {/* Control Icons */}
        <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-blue-800 w-full">
          {/* Detail Icon */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDetailClick}
            className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
            title="View device details"
          >
            <Info className="h-3 w-3" />
          </Button>

          {/* Leaf Expansion Icon */}
          {onExpand && connectedDevices > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExpand}
              className="h-6 w-6 p-0 text-green-400 hover:text-green-300"
              title="Expand/collapse connected assets"
            >
              <Leaf className={`h-3 w-3 ${isExpanded ? 'rotate-180' : ''} transition-transform`} />
            </Button>
          )}
        </div>

        {isExpanded && (
          <Badge variant="secondary" className="text-xs bg-green-900/30 text-green-400 mt-1">
            Expanded
          </Badge>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
    </div>
  );
};

export default memo(RouterNode);
