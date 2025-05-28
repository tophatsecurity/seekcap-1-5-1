
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown, 
  ChevronRight, 
  Router, 
  Switch as SwitchIcon, 
  Monitor, 
  Network,
  Users,
  Cpu
} from 'lucide-react';
import { Asset, NetworkDevice } from '@/lib/db/types';

interface TreeNodeProps {
  label: string;
  icon: React.ReactNode;
  count: number;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
  level?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ 
  label, 
  icon, 
  count, 
  children, 
  defaultExpanded = false,
  level = 0 
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        className="w-full justify-start h-auto p-2 hover:bg-blue-950/30"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <div className="flex items-center gap-2 text-blue-300">
          {children && (
            isExpanded ? 
              <ChevronDown className="h-4 w-4" /> : 
              <ChevronRight className="h-4 w-4" />
          )}
          {!children && <div className="w-4" />}
          {icon}
          <span className="text-sm font-medium">{label}</span>
          <Badge variant="outline" className="ml-auto border-blue-600 text-blue-300">
            {count}
          </Badge>
        </div>
      </Button>
      {isExpanded && children && (
        <div className="mt-1">
          {children}
        </div>
      )}
    </div>
  );
};

interface DeviceNodeProps {
  device: NetworkDevice | Asset;
  type: 'network' | 'asset';
  level: number;
  onDeviceClick?: (device: NetworkDevice | Asset) => void;
}

const DeviceNode: React.FC<DeviceNodeProps> = ({ device, type, level, onDeviceClick }) => {
  const getDeviceIcon = () => {
    if (type === 'network') {
      const networkDevice = device as NetworkDevice;
      if (networkDevice.device_type?.toLowerCase().includes('router')) {
        return <Router className="h-4 w-4 text-blue-400" />;
      }
      return <SwitchIcon className="h-4 w-4 text-green-400" />;
    }
    return <Monitor className="h-4 w-4 text-yellow-400" />;
  };

  const getDeviceStatus = () => {
    if (type === 'network') {
      const networkDevice = device as NetworkDevice;
      return networkDevice.status || 'Unknown';
    }
    const asset = device as Asset;
    return asset.connection || 'Unknown';
  };

  const isOnline = getDeviceStatus() === 'Online' || getDeviceStatus() === 'Connected';

  return (
    <Button
      variant="ghost"
      className="w-full justify-start h-auto p-2 hover:bg-blue-950/20"
      onClick={() => onDeviceClick?.(device)}
      style={{ paddingLeft: `${level * 16 + 8}px` }}
    >
      <div className="flex items-center gap-2 w-full">
        <div className="w-4" />
        {getDeviceIcon()}
        <span className="text-sm text-blue-200 flex-1 text-left">
          {device.name || 'Unknown Device'}
        </span>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-gray-400">
            {type === 'network' ? (device as NetworkDevice).ip_address : (device as Asset).src_ip}
          </span>
        </div>
      </div>
    </Button>
  );
};

interface NetworkDeviceTreeProps {
  assets: Asset[];
  networkDevices: NetworkDevice[];
  onDeviceClick?: (device: NetworkDevice | Asset) => void;
}

export const NetworkDeviceTree: React.FC<NetworkDeviceTreeProps> = ({ 
  assets, 
  networkDevices, 
  onDeviceClick 
}) => {
  // Group network devices by type
  const routers = networkDevices.filter(d => d.device_type?.toLowerCase().includes('router'));
  const distributionSwitches = networkDevices.filter(d => 
    d.device_type?.toLowerCase().includes('distribution') || 
    d.device_type?.toLowerCase().includes('dist')
  );
  const accessSwitches = networkDevices.filter(d => 
    d.device_type?.toLowerCase().includes('access') ||
    (d.device_type?.toLowerCase().includes('switch') && 
     !d.device_type?.toLowerCase().includes('distribution') &&
     !d.device_type?.toLowerCase().includes('dist'))
  );

  // Group assets by device type
  const assetsByType = assets.reduce((acc, asset) => {
    const type = asset.device_type || 'Unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  // Get connected clients for each switch (simulated)
  const getConnectedClients = (switchDevice: NetworkDevice) => {
    return assets.filter(asset => 
      asset.src_ip?.startsWith(switchDevice.ip_address?.substring(0, 10) || '192.168')
    ).slice(0, Math.floor(Math.random() * 8) + 2); // Simulate 2-10 connected clients
  };

  return (
    <Card className="bg-black border-blue-600 h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-blue-300 flex items-center gap-2">
          <Network className="h-5 w-5" />
          Network Device Tree
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 max-h-[600px] overflow-y-auto">
        <div className="space-y-1">
          {/* Network Infrastructure */}
          <TreeNode
            label="Network Infrastructure"
            icon={<Network className="h-4 w-4 text-blue-400" />}
            count={networkDevices.length}
            defaultExpanded={true}
          >
            {/* Routers */}
            {routers.length > 0 && (
              <TreeNode
                label="Core Routers"
                icon={<Router className="h-4 w-4 text-blue-400" />}
                count={routers.length}
                level={1}
                defaultExpanded={true}
              >
                {routers.map((router) => (
                  <DeviceNode
                    key={router.id}
                    device={router}
                    type="network"
                    level={2}
                    onDeviceClick={onDeviceClick}
                  />
                ))}
              </TreeNode>
            )}

            {/* Distribution Switches */}
            {distributionSwitches.length > 0 && (
              <TreeNode
                label="Distribution Switches"
                icon={<SwitchIcon className="h-4 w-4 text-green-400" />}
                count={distributionSwitches.length}
                level={1}
                defaultExpanded={true}
              >
                {distributionSwitches.map((distSwitch) => {
                  const connectedAccessSwitches = accessSwitches.filter(as => 
                    as.parent_device === distSwitch.name
                  );
                  
                  return (
                    <div key={distSwitch.id}>
                      <DeviceNode
                        device={distSwitch}
                        type="network"
                        level={2}
                        onDeviceClick={onDeviceClick}
                      />
                      {connectedAccessSwitches.map((accessSwitch) => {
                        const clients = getConnectedClients(accessSwitch);
                        return (
                          <TreeNode
                            key={accessSwitch.id}
                            label={accessSwitch.name}
                            icon={<SwitchIcon className="h-4 w-4 text-green-400" />}
                            count={clients.length}
                            level={3}
                          >
                            {clients.map((client) => (
                              <DeviceNode
                                key={client.mac_address}
                                device={client}
                                type="asset"
                                level={4}
                                onDeviceClick={onDeviceClick}
                              />
                            ))}
                          </TreeNode>
                        );
                      })}
                    </div>
                  );
                })}
              </TreeNode>
            )}

            {/* Standalone Access Switches */}
            {accessSwitches.filter(as => !distributionSwitches.some(ds => ds.name === as.parent_device)).length > 0 && (
              <TreeNode
                label="Access Switches"
                icon={<SwitchIcon className="h-4 w-4 text-green-400" />}
                count={accessSwitches.filter(as => !distributionSwitches.some(ds => ds.name === as.parent_device)).length}
                level={1}
              >
                {accessSwitches
                  .filter(as => !distributionSwitches.some(ds => ds.name === as.parent_device))
                  .map((accessSwitch) => {
                    const clients = getConnectedClients(accessSwitch);
                    return (
                      <TreeNode
                        key={accessSwitch.id}
                        label={accessSwitch.name}
                        icon={<SwitchIcon className="h-4 w-4 text-green-400" />}
                        count={clients.length}
                        level={2}
                      >
                        {clients.map((client) => (
                          <DeviceNode
                            key={client.mac_address}
                            device={client}
                            type="asset"
                            level={3}
                            onDeviceClick={onDeviceClick}
                          />
                        ))}
                      </TreeNode>
                    );
                  })}
              </TreeNode>
            )}
          </TreeNode>

          {/* Client Devices by Type */}
          <TreeNode
            label="Client Devices"
            icon={<Users className="h-4 w-4 text-yellow-400" />}
            count={assets.length}
            defaultExpanded={true}
          >
            {Object.entries(assetsByType)
              .sort(([, a], [, b]) => b.length - a.length)
              .map(([type, devices]) => (
                <TreeNode
                  key={type}
                  label={type}
                  icon={<Cpu className="h-4 w-4 text-yellow-400" />}
                  count={devices.length}
                  level={1}
                >
                  {devices.slice(0, 10).map((device) => (
                    <DeviceNode
                      key={device.mac_address}
                      device={device}
                      type="asset"
                      level={2}
                      onDeviceClick={onDeviceClick}
                    />
                  ))}
                  {devices.length > 10 && (
                    <div 
                      className="text-xs text-gray-400 pl-12 py-1"
                      style={{ paddingLeft: `${2 * 16 + 24}px` }}
                    >
                      +{devices.length - 10} more...
                    </div>
                  )}
                </TreeNode>
              ))}
          </TreeNode>
        </div>
      </CardContent>
    </Card>
  );
};
