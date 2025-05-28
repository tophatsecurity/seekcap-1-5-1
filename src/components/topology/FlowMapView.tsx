
import React, { useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import DeviceNode from './DeviceNode';
import RouterNode from './RouterNode';
import EnhancedSwitchNode from './EnhancedSwitchNode';
import VlanNode from './VlanNode';
import { LayoutType } from './LayoutSelector';
import { applyLayout } from '@/utils/layoutAlgorithms';

const nodeTypes = {
  device: DeviceNode,
  router: RouterNode,
  switch: EnhancedSwitchNode,
  vlan: VlanNode,
};

interface FlowMapViewProps {
  isLocked: boolean;
  animationsEnabled: boolean;
  selectedLayout: LayoutType;
}

export const FlowMapView: React.FC<FlowMapViewProps> = ({
  isLocked,
  animationsEnabled,
  selectedLayout
}) => {
  const { flowNodes, flowEdges } = useMemo(() => {
    const flowNodes: Node[] = [];
    const flowEdges: any[] = [];

    // Create a hierarchical flow layout with realistic bandwidth data
    const coreRouter = {
      id: 'core-router',
      type: 'router',
      position: { x: 400, y: 100 },
      data: { 
        device: {
          name: 'Core Router',
          device_type: 'Router',
          ip_address: '10.0.0.1',
          download_bps: 10000000000,
          upload_bps: 10000000000,
          usage_mb: 50000,
          experience: 'Excellent',
          status: 'Online'
        }
      },
    };
    flowNodes.push(coreRouter);

    // Add distribution switches with varying bandwidth loads
    const distributionSwitches = [
      { id: 'dist-sw-1', name: 'Distribution SW 1', x: 200, y: 300, subnet: '192.168.1', load: 0.85, status: 'Online' },
      { id: 'dist-sw-2', name: 'Distribution SW 2', x: 600, y: 300, subnet: '192.168.2', load: 0.65, status: 'Online' },
      { id: 'dist-sw-3', name: 'Distribution SW 3', x: 400, y: 500, subnet: '192.168.3', load: 0.45, status: 'Online' },
    ];

    distributionSwitches.forEach((sw, index) => {
      const baseBandwidth = 1000000000;
      const actualBandwidth = baseBandwidth * sw.load;
      
      flowNodes.push({
        id: sw.id,
        type: 'switch',
        position: { x: sw.x, y: sw.y },
        data: {
          device: {
            name: sw.name,
            device_type: 'Distribution Switch',
            ip_address: `${sw.subnet}.1`,
            download_bps: actualBandwidth,
            upload_bps: actualBandwidth,
            usage_mb: 15000 + (index * 5000),
            experience: sw.load > 0.8 ? 'Fair' : sw.load > 0.6 ? 'Good' : 'Excellent',
            bandwidth_utilization: sw.load * 100,
            status: sw.status
          }
        },
      });

      const utilization = sw.load * 100;
      let edgeColor = '#22c55e';
      if (utilization > 80) edgeColor = '#ef4444';
      else if (utilization > 60) edgeColor = '#f59e0b';
      
      const strokeWidth = Math.max(3, Math.min(12, sw.load * 10 + 2));
      
      flowEdges.push({
        id: `core-to-${sw.id}`,
        source: 'core-router',
        target: sw.id,
        type: 'smoothstep',
        style: { 
          stroke: edgeColor,
          strokeWidth: strokeWidth,
        },
        label: `${(actualBandwidth / 1000000).toFixed(0)} Mbps (${utilization.toFixed(0)}%)`,
        labelStyle: { fill: '#ffffff', fontWeight: 'bold', fontSize: '11px' },
        labelBgStyle: { fill: '#000000', fillOpacity: 0.9 },
        animated: animationsEnabled && sw.status === 'Online',
      });
    });

    // Add access switches with varying loads
    distributionSwitches.forEach((distSw, distIndex) => {
      for (let i = 0; i < 3; i++) {
        const load = Math.random() * 0.8 + 0.1;
        const status = Math.random() > 0.2 ? 'Online' : 'Offline';
        const accessSw = {
          id: `access-sw-${distIndex}-${i}`,
          name: `Access SW ${distIndex + 1}-${i + 1}`,
          x: distSw.x + (i - 1) * 150,
          y: distSw.y + 200,
          load: load,
          status: status
        };

        const bandwidth = 100000000 * load;
        
        flowNodes.push({
          id: accessSw.id,
          type: 'switch',
          position: { x: accessSw.x, y: accessSw.y },
          data: {
            device: {
              name: accessSw.name,
              device_type: 'Access Switch',
              ip_address: `${distSw.subnet}.${10 + i}`,
              download_bps: bandwidth,
              upload_bps: bandwidth,
              usage_mb: 2000 + (i * 500),
              experience: load > 0.7 ? 'Fair' : load > 0.5 ? 'Good' : 'Excellent',
              bandwidth_utilization: load * 100,
              status: status
            }
          },
        });

        const utilization = load * 100;
        let edgeColor = '#22c55e';
        if (utilization > 70) edgeColor = '#ef4444';
        else if (utilization > 50) edgeColor = '#f59e0b';
        
        const strokeWidth = Math.max(2, Math.min(6, load * 6 + 1));
        
        flowEdges.push({
          id: `${distSw.id}-to-${accessSw.id}`,
          source: distSw.id,
          target: accessSw.id,
          type: 'smoothstep',
          style: { 
            stroke: edgeColor,
            strokeWidth: strokeWidth,
          },
          label: `${(bandwidth / 1000000).toFixed(0)}Mbps`,
          labelStyle: { fill: '#ffffff', fontSize: '9px' },
          labelBgStyle: { fill: '#000000', fillOpacity: 0.8 },
          animated: animationsEnabled && status === 'Online',
        });
      }
    });

    // Apply selected layout to flow map nodes
    const layoutedNodes = applyLayout(flowNodes, flowEdges, selectedLayout, {
      width: 1200,
      height: 800,
      spacing: 150
    });

    return { flowNodes: layoutedNodes, flowEdges };
  }, [animationsEnabled, selectedLayout]);

  const [flowMapNodes, setFlowMapNodes, onFlowMapNodesChange] = useNodesState(flowNodes);
  const [flowMapEdges, setFlowMapEdges, onFlowMapEdgesChange] = useEdgesState(flowEdges);

  const onFlowMapConnect = useCallback(
    (params: Connection) => setFlowMapEdges((eds) => addEdge(params, eds)),
    [setFlowMapEdges]
  );

  useEffect(() => {
    setFlowMapNodes(flowNodes);
    setFlowMapEdges(flowEdges);
  }, [animationsEnabled, selectedLayout, flowNodes, flowEdges, setFlowMapNodes, setFlowMapEdges]);

  return (
    <ReactFlow
      nodes={flowMapNodes}
      edges={flowMapEdges}
      onNodesChange={onFlowMapNodesChange}
      onEdgesChange={onFlowMapEdgesChange}
      onConnect={onFlowMapConnect}
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
  );
};
