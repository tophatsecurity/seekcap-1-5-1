
import React, { useCallback, useMemo, useEffect, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import DeviceNode from './DeviceNode';
import RouterNode from './RouterNode';
import EnhancedSwitchNode from './EnhancedSwitchNode';
import VlanNode from './VlanNode';
import { Asset, NetworkDevice } from '@/lib/db/types';
import { LayoutType } from './LayoutSelector';
import { applyLayout } from '@/utils/layoutAlgorithms';

const nodeTypes = {
  device: DeviceNode,
  router: RouterNode,
  switch: EnhancedSwitchNode,
  vlan: VlanNode,
};

interface DeviceTopologyViewProps {
  assets: Asset[];
  networkDevices: NetworkDevice[];
  selectedDevice?: NetworkDevice | Asset | null;
  isLocked: boolean;
  onAddDevice: (portId?: string) => void;
  selectedLayout: LayoutType;
  spacing?: number;
}

export const DeviceTopologyView: React.FC<DeviceTopologyViewProps> = ({
  assets,
  networkDevices,
  selectedDevice,
  isLocked,
  onAddDevice,
  selectedLayout,
  spacing = 200
}) => {
  const [expandedDevices, setExpandedDevices] = useState<Set<string>>(new Set());
  const [showAllAssets, setShowAllAssets] = useState(false);

  // Generate port data for switches
  const generatePortData = (device: NetworkDevice) => {
    const portCount = device.port_count || 24;
    return Array.from({ length: portCount }, (_, i) => ({
      id: `${device.name}-port-${i + 1}`,
      number: i + 1,
      status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'inactive' : 'blocked' as 'active' | 'inactive' | 'blocked',
      vlan: Math.random() > 0.7 ? `VLAN${Math.floor(Math.random() * 10) + 1}` : undefined,
      connectedDevice: Math.random() > 0.6 ? {
        name: `Device-${device.name.split('-')[2]}-${i + 1}`,
        mac: `00:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}`,
        type: ['PC', 'Printer', 'Phone', 'Camera', 'Sensor', 'Controller'][Math.floor(Math.random() * 6)]
      } : undefined
    }));
  };

  const handleDeviceExpand = useCallback((deviceId: string) => {
    setExpandedDevices(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(deviceId)) {
        newExpanded.delete(deviceId);
      } else {
        newExpanded.add(deviceId);
      }
      return newExpanded;
    });
  }, []);

  const toggleAllAssets = useCallback(() => {
    setShowAllAssets(prev => !prev);
    if (!showAllAssets) {
      // If showing all, expand all devices
      const allDeviceIds = networkDevices.map(d => `network-${d.id || d.name}`);
      setExpandedDevices(new Set(allDeviceIds));
    } else {
      // If hiding all, collapse all devices
      setExpandedDevices(new Set());
    }
  }, [showAllAssets, networkDevices]);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Add network infrastructure devices with enhanced switch capabilities
    networkDevices.forEach((device, index) => {
      const deviceId = `network-${device.id || index}`;
      const isSwitch = device.device_type?.toLowerCase().includes('switch');
      const isSelected = selectedDevice && 'id' in selectedDevice && selectedDevice.id === device.id;
      const isExpanded = expandedDevices.has(deviceId) || showAllAssets;
      
      nodes.push({
        id: deviceId,
        type: device.device_type?.toLowerCase().includes('router') ? 'router' : 
              isSwitch ? 'switch' : 'device',
        position: { 
          x: 100 + (index % 4) * 300, 
          y: 50 + Math.floor(index / 4) * 200 
        },
        data: { 
          device: {
            ...device,
            experience: device.experience,
            download_bps: device.download_bps || parseInt(device.download?.replace(/[^\d]/g, '') || '0') * 1000000,
            upload_bps: device.upload_bps || parseInt(device.upload?.replace(/[^\d]/g, '') || '0') * 1000000,
            usage_mb: device.usage_mb || parseInt(device.usage_24hr?.replace(/[^\d]/g, '') || '0') * 1000,
          },
          // Add port data for switches
          ...(isSwitch && {
            ports: generatePortData(device),
            onPortClick: (portId: string) => console.log('Port clicked:', portId),
            onAddDevice: (portId: string) => onAddDevice(portId),
            isLocked
          }),
          // Add expand functionality
          isExpanded,
          onExpand: () => handleDeviceExpand(deviceId),
        },
        draggable: !isLocked,
        selected: isSelected,
        style: isSelected ? { 
          filter: 'drop-shadow(0 0 10px #3b82f6)', 
          transform: 'scale(1.05)' 
        } : undefined,
      });

      // Add connected assets only if device is expanded or showing all assets
      if (isExpanded) {
        // Get assets connected to this device (simulate connection based on index)
        const connectedAssets = assets.filter((_, assetIndex) => assetIndex % networkDevices.length === index).slice(0, 6);
        
        connectedAssets.forEach((asset, assetIndex) => {
          const assetId = `asset-${asset.mac_address}-${deviceId}`;
          const isAssetSelected = selectedDevice && 'mac_address' in selectedDevice && 
                                selectedDevice.mac_address === asset.mac_address;
          
          nodes.push({
            id: assetId,
            type: 'device',
            position: { 
              x: 100 + (index % 4) * 300 + ((assetIndex % 3) - 1) * 150, 
              y: 300 + Math.floor(index / 4) * 200 + Math.floor(assetIndex / 3) * 120
            },
            data: { device: asset },
            draggable: !isLocked,
            selected: isAssetSelected,
            style: isAssetSelected ? { 
              filter: 'drop-shadow(0 0 10px #f59e0b)', 
              transform: 'scale(1.05)' 
            } : undefined,
          });

          // Create connection from asset to network device
          const bandwidth = (asset.download_bps || 0) + (asset.upload_bps || 0);
          const utilization = Math.min((bandwidth / 1000000000) * 100, 100);
          const isConnected = asset.connection === 'Connected';
          
          let edgeColor = '#22c55e';
          if (utilization > 80) edgeColor = '#ef4444';
          else if (utilization > 60) edgeColor = '#f59e0b';
          
          const strokeWidth = Math.max(2, Math.min(8, (bandwidth / 100000000) + 2));
          
          edges.push({
            id: `edge-${assetId}-to-${deviceId}`,
            source: assetId,
            target: deviceId,
            type: 'smoothstep',
            style: { 
              stroke: isConnected ? edgeColor : '#ef4444',
              strokeWidth: isConnected ? strokeWidth : 2,
            },
            animated: false,
            label: bandwidth > 10000000 ? `${(bandwidth / 1000000).toFixed(0)}Mbps` : undefined,
            labelStyle: { fill: '#ffffff', fontWeight: 'bold', fontSize: '10px' },
            labelBgStyle: { fill: '#000000', fillOpacity: 0.8 },
          });
        });
      }
    });

    // Create connections between network devices
    for (let i = 1; i < networkDevices.length; i++) {
      if (networkDevices[i].parent_device) {
        const parentIndex = networkDevices.findIndex(d => d.name === networkDevices[i].parent_device);
        if (parentIndex !== -1) {
          const device = networkDevices[i];
          const bandwidth = (device.download_bps || 0) + (device.upload_bps || 0);
          const utilization = Math.min((bandwidth / 10000000000) * 100, 100);
          
          let edgeColor = '#3b82f6';
          if (utilization > 80) edgeColor = '#ef4444';
          else if (utilization > 60) edgeColor = '#f59e0b';
          
          const strokeWidth = Math.max(3, Math.min(10, (bandwidth / 1000000000) + 3));
          
          edges.push({
            id: `network-edge-${i}`,
            source: `network-${networkDevices[i].id || i}`,
            target: `network-${networkDevices[parentIndex].id || parentIndex}`,
            type: 'straight',
            style: { 
              stroke: edgeColor, 
              strokeWidth: strokeWidth 
            },
            animated: false,
            label: bandwidth > 100000000 ? `${(bandwidth / 1000000000).toFixed(1)}Gbps` : undefined,
            labelStyle: { fill: '#ffffff', fontWeight: 'bold' },
            labelBgStyle: { fill: '#000000', fillOpacity: 0.8 },
          });
        }
      }
    }

    // Apply selected layout with custom spacing
    const layoutedNodes = applyLayout(nodes, edges, selectedLayout, {
      width: 1200,
      height: 800,
      spacing: spacing
    });

    return { initialNodes: layoutedNodes, initialEdges: edges };
  }, [assets, networkDevices, isLocked, selectedDevice, onAddDevice, selectedLayout, spacing, expandedDevices, showAllAssets, handleDeviceExpand]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes((nds) => 
      nds.map((node) => ({
        ...node,
        draggable: !isLocked,
        data: {
          ...node.data,
          isLocked
        }
      }))
    );
  }, [isLocked, setNodes]);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [selectedDevice, initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="relative w-full h-full">
      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-10 bg-black/80 border border-blue-600 rounded-lg p-3">
        <div className="flex flex-col gap-2">
          <button
            onClick={toggleAllAssets}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded"
          >
            {showAllAssets ? 'Hide All Assets' : 'Show All Assets'}
          </button>
          <div className="text-xs text-blue-300">
            Assets: {showAllAssets ? 'All Visible' : `${expandedDevices.size} Expanded`}
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={{ backgroundColor: '#000000' }}
        className="bg-black"
        nodesDraggable={!isLocked}
        nodesConnectable={!isLocked}
        elementsSelectable={!isLocked}
      >
        <Controls className="bg-black border-blue-700" />
        <MiniMap 
          className="bg-gray-900 border-blue-700"
          nodeColor="#1e40af"
          maskColor="rgba(0, 0, 0, 0.8)"
        />
        <Background color="#1e40af" gap={16} />
      </ReactFlow>
    </div>
  );
};
