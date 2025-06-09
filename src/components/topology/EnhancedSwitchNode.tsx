
import React, { memo, useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Network, Lock, Unlock, Plus, Settings, ChevronDown, ChevronRight, Leaf, Info } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Port {
  id: string;
  number: number;
  status: 'active' | 'inactive' | 'blocked';
  vlan?: string;
  connectedDevice?: {
    name: string;
    mac: string;
    type: string;
  };
}

interface EnhancedSwitchNodeProps {
  data: {
    device: any;
    ports?: Port[];
    onPortClick?: (portId: string) => void;
    onAddDevice?: (portId: string) => void;
    isLocked?: boolean;
    isExpanded?: boolean;
    onExpand?: () => void;
  };
}

const EnhancedSwitchNode: React.FC<EnhancedSwitchNodeProps> = ({ data }) => {
  const { device, ports = [], onPortClick, onAddDevice, isLocked = false, isExpanded = false, onExpand } = data;
  const [showPorts, setShowPorts] = useState(false);
  const [persistentPorts, setPersistentPorts] = useState<Port[]>([]);
  const navigate = useNavigate();
  
  const ipAddress = device?.ip_address || 'Unknown IP';
  const name = device?.name || 'Switch';
  const status = device?.status || 'Unknown';
  const application = device?.application || 'Network';
  const macAddress = device?.mac_address;

  // Helper function to generate a random port status with proper typing
  const getRandomStatus = (): 'active' | 'inactive' | 'blocked' => {
    const random = Math.random();
    if (random > 0.7) return 'active';
    if (random > 0.4) return 'inactive';
    return 'blocked';
  };

  // Initialize persistent ports only once
  useEffect(() => {
    if (persistentPorts.length === 0) {
      const initialPorts: Port[] = ports.length > 0 ? ports : Array.from({ length: 24 }, (_, i) => ({
        id: `port-${i + 1}`,
        number: i + 1,
        status: getRandomStatus(),
        vlan: Math.random() > 0.7 ? `VLAN${Math.floor(Math.random() * 10) + 1}` : undefined,
        connectedDevice: Math.random() > 0.6 ? {
          name: `Device-${i + 1}`,
          mac: `00:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}`,
          type: ['PC', 'Printer', 'Phone', 'Camera', 'Sensor'][Math.floor(Math.random() * 5)]
        } : undefined
      }));
      setPersistentPorts(initialPorts);
    }
  }, [ports]);

  const getPortColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-400';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const handlePortClick = (portId: string) => {
    // Only call the external onPortClick handler, don't change port status
    onPortClick?.(portId);
  };

  const handleDetailClick = () => {
    if (macAddress) {
      navigate(`/assets/${encodeURIComponent(macAddress)}`);
    }
  };

  const connectedDevicesCount = persistentPorts.filter(p => p.connectedDevice).length;

  return (
    <Card className="bg-black border border-blue-500 rounded-lg w-80 p-0 animate-fade-in">
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-950 rounded-full">
              <Network className="h-8 w-8 text-blue-300" />
            </div>
            <div>
              <div className="text-sm font-bold text-blue-300 truncate">
                {name}
              </div>
              <div className="text-xs text-blue-300">
                {ipAddress}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
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
            {onExpand && connectedDevicesCount > 0 && (
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
            
            {isLocked ? (
              <Lock className="h-4 w-4 text-yellow-400" />
            ) : (
              <Unlock className="h-4 w-4 text-gray-400" />
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPorts(!showPorts)}
              className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300"
            >
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <div className={`h-2 w-2 rounded-full ${status === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-blue-400">{status}</span>
          </div>
          <Badge variant="outline" className="text-xs border-blue-600 text-blue-300">
            {application}
          </Badge>
        </div>

        {/* Connected devices count display */}
        {connectedDevicesCount > 0 && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-800">
            <div className="text-xs text-blue-400">
              {connectedDevicesCount} connected device{connectedDevicesCount !== 1 ? 's' : ''}
            </div>
            {isExpanded && (
              <Badge variant="secondary" className="text-xs bg-green-900/30 text-green-400">
                Expanded
              </Badge>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="text-xs text-blue-400 mb-2">
          Ports: {persistentPorts.filter(p => p.status === 'active').length}/{persistentPorts.length} active
        </div>

        {showPorts && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            <div className="grid grid-cols-6 gap-1">
              {persistentPorts.slice(0, 24).map((port) => (
                <div
                  key={port.id}
                  className={`relative group cursor-pointer rounded p-1 border text-center ${getPortColor(port.status)} ${port.connectedDevice ? 'ring-2 ring-yellow-400' : ''}`}
                  onClick={() => handlePortClick(port.id)}
                  title={`Port ${port.number}${port.vlan ? ` - ${port.vlan}` : ''}${port.connectedDevice ? ` - ${port.connectedDevice.name}` : ''}`}
                >
                  <div className="text-xs font-mono text-white">
                    {port.number}
                  </div>
                  {port.connectedDevice && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                  {!port.connectedDevice && !isLocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 h-full w-full p-0 text-white hover:bg-white/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddDevice?.(port.id);
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            
            {persistentPorts.some(p => p.connectedDevice) && (
              <div className="mt-2 space-y-1">
                <div className="text-xs text-blue-300 font-medium">Connected Devices:</div>
                {persistentPorts
                  .filter(p => p.connectedDevice)
                  .slice(0, 3)
                  .map((port) => (
                    <div key={port.id} className="text-xs text-gray-300 flex justify-between">
                      <span>Port {port.number}:</span>
                      <span className="text-blue-300">{port.connectedDevice?.name}</span>
                    </div>
                  ))}
                {persistentPorts.filter(p => p.connectedDevice).length > 3 && (
                  <div className="text-xs text-gray-400">
                    +{persistentPorts.filter(p => p.connectedDevice).length - 3} more...
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
    </Card>
  );
};

export default memo(EnhancedSwitchNode);
