
import React, { useState, useCallback } from 'react';
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
  ConnectionLineType,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Asset, NetworkDevice } from '@/lib/db/types';
import DeviceNode from './DeviceNode';
import RouterNode from './RouterNode';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

// Define node types
const nodeTypes = {
  device: DeviceNode,
  router: RouterNode,
};

interface NetworkTopologyProps {
  assets: Asset[];
  networkDevices: NetworkDevice[];
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ assets, networkDevices }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Generate network topology graph on component mount or when data changes
  React.useEffect(() => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];
    
    // Start by adding routers and switches
    const routerDevices = networkDevices.filter(
      (device) => device.device_type?.toLowerCase().includes('router') || 
                  device.device_type?.toLowerCase().includes('switch')
    );
    
    // Add central node if we have network devices
    if (networkDevices.length > 0) {
      generatedNodes.push({
        id: 'central',
        type: 'router',
        data: { 
          label: 'Main Router',
          device: {
            name: 'Main Router',
            device_type: 'router',
            ip_address: networkDevices[0]?.ip_address || '192.168.1.1',
          },
        },
        position: { x: 0, y: 0 },
      });
    }
    
    // Add router/switch devices in a circle around the central node
    routerDevices.forEach((device, i) => {
      const angle = (2 * Math.PI * i) / Math.max(routerDevices.length, 1);
      const radius = 250;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      generatedNodes.push({
        id: device.mac_address || `router-${i}`,
        type: 'router',
        data: { 
          label: device.name,
          device,
        },
        position: { x, y },
      });
      
      // Connect to central node
      if (networkDevices.length > 0) {
        generatedEdges.push({
          id: `e-central-${device.mac_address || `router-${i}`}`,
          source: 'central',
          target: device.mac_address || `router-${i}`,
          animated: true,
          style: { stroke: '#0066ff' },
        });
      }
    });
    
    // Add end devices (computers, phones, etc.) connected to their nearest router/switch
    const endDevices = [...networkDevices.filter(
      (device) => !device.device_type?.toLowerCase().includes('router') && 
                  !device.device_type?.toLowerCase().includes('switch')
    ), ...assets.filter(asset => !asset.mac_address.startsWith('00:00:00'))];
    
    endDevices.forEach((device, i) => {
      // Find closest router if possible, default to central
      const routerIndex = i % Math.max(routerDevices.length, 1);
      const parentId = routerDevices.length > 0 
        ? (routerDevices[routerIndex].mac_address || `router-${routerIndex}`)
        : 'central';
      
      const parentNode = generatedNodes.find(node => node.id === parentId);
      if (!parentNode) return;
      
      // Calculate position: distribute around the parent router
      const subAngle = (2 * Math.PI * (i % 8)) / 8;
      const subRadius = 150;
      const subX = parentNode.position.x + subRadius * Math.cos(subAngle);
      const subY = parentNode.position.y + subRadius * Math.sin(subAngle);
      
      const deviceId = device.mac_address || `device-${i}`;
      
      generatedNodes.push({
        id: deviceId,
        type: 'device',
        data: { 
          label: device.name || `Device ${i}`,
          device,
        },
        position: { x: subX, y: subY },
      });
      
      generatedEdges.push({
        id: `e-${parentId}-${deviceId}`,
        source: parentId,
        target: deviceId,
        type: 'straight',
        style: { stroke: '#00aaff' },
      });
    });
    
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [assets, networkDevices, setNodes, setEdges]);
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'straight' }, eds)),
    [setEdges]
  );
  
  const resetView = useCallback(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        position: { ...node.position },
      }))
    );
  }, [setNodes]);
  
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      connectionLineType={ConnectionLineType.Straight}
      fitView
      attributionPosition="bottom-right"
      minZoom={0.2}
      maxZoom={4}
      style={{ background: '#111' }}
      proOptions={{ hideAttribution: true }}
    >
      <Panel position="top-right" className="space-x-2">
        <Button variant="outline" size="icon" className="bg-black/70 text-blue-400 border-blue-800">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" className="bg-black/70 text-blue-400 border-blue-800">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-black/70 text-blue-400 border-blue-800"
          onClick={resetView}
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </Panel>
      <Controls className="bg-black/70 text-blue-400 border-blue-800" />
      <MiniMap 
        nodeStrokeWidth={3}
        style={{ 
          background: '#111', 
          border: '1px solid #0066ff',
          borderRadius: '4px',
        }} 
        nodeColor="#0066ff"
      />
      <Background 
        color="#0066ff" 
        gap={16} 
        size={1} 
        variant={BackgroundVariant.Dots}
      />
    </ReactFlow>
  );
};
