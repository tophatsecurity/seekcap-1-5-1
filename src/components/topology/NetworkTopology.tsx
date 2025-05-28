import React, { useCallback, useMemo, useState, useEffect } from 'react';
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
import { NetworkToolbar } from './NetworkToolbar';
import { Asset, NetworkDevice } from '@/lib/db/types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const nodeTypes = {
  device: DeviceNode,
  router: RouterNode,
  switch: EnhancedSwitchNode,
  vlan: VlanNode,
};

// Enhanced sample data generation
const generateDetailedSampleAssets = (): Asset[] => {
  const vendors = ["Siemens", "Allen-Bradley", "Schneider Electric", "ABB", "Emerson", "Honeywell", "Johnson Controls", "Cisco", "HP", "Dell", "Rockwell", "GE", "Mitsubishi", "Omron"];
  const deviceTypes = ["PLC", "HMI", "Switch", "Router", "Sensor", "Actuator", "Drive", "Controller", "Gateway", "Workstation", "RTU", "SCADA Server"];
  const protocols = ["Modbus TCP", "DNP3", "EtherNet/IP", "PROFINET", "BACnet", "OPC UA", "MQTT", "HTTP", "SNMP"];
  const experiences = ["Excellent", "Good", "Fair", "Poor"];
  const technologies = ["Ethernet", "Wi-Fi", "Fiber", "Serial"];
  
  const sampleAssets: Asset[] = [];

  for (let i = 0; i < 25; i++) {
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const subnet = Math.floor(Math.random() * 4) + 1;
    const hostId = Math.floor(Math.random() * 200) + 10;
    const protocol = protocols[Math.floor(Math.random() * protocols.length)];
    const experience = experiences[Math.floor(Math.random() * experiences.length)];
    const technology = technologies[Math.floor(Math.random() * technologies.length)];
    
    const baseDate = new Date();
    const firstSeen = new Date(baseDate.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const lastSeen = new Date(baseDate.getTime() - Math.random() * 24 * 60 * 60 * 1000);
    
    sampleAssets.push({
      mac_address: `${vendor.substring(0, 2).toUpperCase()}:${i.toString(16).padStart(2, '0').toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}:${Math.random().toString(16).substring(2, 4).toUpperCase()}`,
      name: `${deviceType.replace(/\s+/g, '-')}-${vendor.substring(0, 3).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      device_type: deviceType,
      src_ip: `192.168.${subnet}.${hostId}`,
      ip_address: `192.168.${subnet}.${hostId}`,
      vendor: vendor,
      first_seen: firstSeen.toISOString(),
      last_seen: lastSeen.toISOString(),
      eth_proto: Math.random() > 0.5 ? "TCP" : "UDP",
      icmp: Math.random() > 0.7,
      experience: experience as 'Excellent' | 'Good' | 'Fair' | 'Poor',
      technology: technology,
      signal_strength: technology === "Wi-Fi" ? Math.floor(Math.random() * 40) - 80 : null,
      channel: technology === "Wi-Fi" ? (Math.floor(Math.random() * 11) + 1).toString() : null,
      usage_mb: Math.floor(Math.random() * 5000) + 100,
      download_bps: Math.floor(Math.random() * 1000000000) + 1000000, // 1Mbps to 1Gbps
      upload_bps: Math.floor(Math.random() * 500000000) + 500000, // 500Kbps to 500Mbps
      uptime: `${Math.floor(Math.random() * 365)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      channel_width: technology === "Wi-Fi" ? (Math.random() > 0.5 ? "20MHz" : "40MHz") : null,
      noise_floor: technology === "Wi-Fi" ? Math.floor(Math.random() * 20) - 100 : null,
      tx_rate: technology === "Wi-Fi" ? Math.floor(Math.random() * 150) + 50 : null,
      rx_rate: technology === "Wi-Fi" ? Math.floor(Math.random() * 150) + 50 : null,
      tx_power: technology === "Wi-Fi" ? Math.floor(Math.random() * 20) + 10 : null,
      distance: Math.floor(Math.random() * 1000) + 10, // meters
      ccq: Math.floor(Math.random() * 100) + 1,
      airtime: technology === "Wi-Fi" ? Math.floor(Math.random() * 50) + 1 : null,
      connection: Math.random() > 0.3 ? "Connected" : "Disconnected",
      network: `Network-${subnet}`,
      wifi: technology === "Wi-Fi" ? `WiFi-${subnet}` : null,
    });
  }

  return sampleAssets;
};

// Enhanced sample data generation
const generateSampleNetworkDevices = (): NetworkDevice[] => {
  const deviceTypes = ["Router", "Switch", "Access Point", "Firewall", "Gateway"];
  const vendors = ["Cisco", "Juniper", "HP", "Dell", "Netgear", "Ubiquiti"];
  
  const devices: NetworkDevice[] = [];
  
  for (let i = 0; i < 8; i++) {
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)];
    const vendor = vendors[Math.floor(Math.random() * vendors.length)];
    
    devices.push({
      id: i + 1,
      name: `${deviceType.replace(/\s+/g, '-')}-${vendor}-${String(i + 1).padStart(2, '0')}`,
      device_type: deviceType,
      ip_address: `10.0.1.${i + 10}`,
      mac_address: `00:${vendor.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:aa:bb:cc`,
      status: Math.random() > 0.2 ? "Online" : "Offline",
      application: deviceType,
      uplink: i > 0 ? `${deviceTypes[0]}-${vendors[0]}-01` : null,
      parent_device: i > 0 ? `${deviceTypes[0]}-${vendors[0]}-01` : null,
      connected: Math.floor(Math.random() * 50) + 5,
      experience: ["Excellent", "Good", "Fair", "Poor"][Math.floor(Math.random() * 4)],
      download: `${Math.floor(Math.random() * 500) + 50}Mbps`,
      upload: `${Math.floor(Math.random() * 200) + 20}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 10) + 1}GB`,
      ch_24_ghz: deviceType === "Access Point" ? (Math.floor(Math.random() * 11) + 1).toString() : null,
      ch_5_ghz: deviceType === "Access Point" ? (Math.floor(Math.random() * 20) + 36).toString() : null,
      first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  return devices;
};

interface NetworkTopologyProps {
  assets: Asset[];
  networkDevices: NetworkDevice[];
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ 
  assets: propAssets, 
  networkDevices: propNetworkDevices 
}) => {
  const [useSampleData, setUseSampleData] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [newDeviceCount, setNewDeviceCount] = useState(0);
  
  // Use sample data if no real data or if explicitly requested
  const assets = useSampleData || propAssets.length === 0 ? generateDetailedSampleAssets() : propAssets;
  const networkDevices = useSampleData || propNetworkDevices.length === 0 ? generateSampleNetworkDevices() : propNetworkDevices;

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Add network infrastructure devices with enhanced switch capabilities
    networkDevices.forEach((device, index) => {
      const isSwitch = device.device_type?.toLowerCase().includes('switch');
      
      nodes.push({
        id: `network-${device.id || index}`,
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
            download_bps: parseInt(device.download?.replace(/[^\d]/g, '') || '0') * 1000000,
            upload_bps: parseInt(device.upload?.replace(/[^\d]/g, '') || '0') * 1000000,
            usage_mb: parseInt(device.usage_24hr?.replace(/[^\d]/g, '') || '0') * 1000,
          },
          // Add port data for switches
          ...(isSwitch && {
            ports: Array.from({ length: 24 }, (_, i) => ({
              id: `port-${i + 1}`,
              number: i + 1,
              status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'inactive' : 'blocked',
              vlan: Math.random() > 0.7 ? `VLAN${Math.floor(Math.random() * 10) + 1}` : undefined,
              connectedDevice: Math.random() > 0.6 ? {
                name: `Device-${i + 1}`,
                mac: `00:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}`,
                type: ['PC', 'Printer', 'Phone', 'Camera'][Math.floor(Math.random() * 4)]
              } : undefined
            })),
            onPortClick: (portId: string) => console.log('Port clicked:', portId),
            onAddDevice: (portId: string) => handleAddDevice(portId),
            isLocked
          })
        },
        draggable: !isLocked,
      });
    });

    // Add asset devices
    assets.forEach((asset, index) => {
      nodes.push({
        id: `asset-${asset.mac_address}`,
        type: 'device',
        position: { 
          x: 200 + (index % 5) * 250, 
          y: 300 + Math.floor(index / 5) * 280 
        },
        data: { device: asset },
        draggable: !isLocked,
      });

      // Create connections from assets to network devices
      if (networkDevices.length > 0) {
        const targetDevice = networkDevices[index % networkDevices.length];
        edges.push({
          id: `edge-${asset.mac_address}-to-${targetDevice.id}`,
          source: `asset-${asset.mac_address}`,
          target: `network-${targetDevice.id || index % networkDevices.length}`,
          type: 'smoothstep',
          style: { 
            stroke: asset.connection === 'Connected' ? '#22c55e' : '#ef4444',
            strokeWidth: 2,
          },
          animated: asset.connection === 'Connected' && animationsEnabled,
        });
      }
    });

    // Create connections between network devices
    for (let i = 1; i < networkDevices.length; i++) {
      if (networkDevices[i].parent_device) {
        const parentIndex = networkDevices.findIndex(d => d.name === networkDevices[i].parent_device);
        if (parentIndex !== -1) {
          edges.push({
            id: `network-edge-${i}`,
            source: `network-${networkDevices[i].id || i}`,
            target: `network-${networkDevices[parentIndex].id || parentIndex}`,
            type: 'straight',
            style: { stroke: '#3b82f6', strokeWidth: 3 },
            animated: animationsEnabled,
          });
        }
      }
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [assets, networkDevices, isLocked, animationsEnabled]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when lock state changes
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

  // Update edge animations when animation state changes
  useEffect(() => {
    setEdges((eds) => 
      eds.map((edge) => ({
        ...edge,
        animated: edge.animated && animationsEnabled
      }))
    );
  }, [animationsEnabled, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddDevice = (portId?: string) => {
    console.log('Adding device to port:', portId);
    setNewDeviceCount(prev => prev + 1);
    // Here you would implement actual device addition logic
  };

  const handleAutoLayout = () => {
    setNodes((nds) => {
      const layoutNodes = [...nds];
      // Simple hierarchical layout
      let y = 50;
      let x = 100;
      const spacing = 200;
      
      layoutNodes.forEach((node, index) => {
        if (node.type === 'router' || node.type === 'switch') {
          node.position = { x: x + (index % 4) * 300, y };
        } else {
          node.position = { x: x + (index % 5) * 250, y: y + 300 };
        }
      });
      
      return layoutNodes;
    });
  };

  const handleGridLayout = () => {
    setNodes((nds) => {
      const layoutNodes = [...nds];
      const cols = 4;
      const spacing = 250;
      
      layoutNodes.forEach((node, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        node.position = { 
          x: 100 + col * spacing, 
          y: 100 + row * spacing 
        };
      });
      
      return layoutNodes;
    });
  };

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setNewDeviceCount(0);
  };

  // Generate flow map data with bandwidth usage
  const { flowNodes, flowEdges } = useMemo(() => {
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

    // Create a hierarchical flow layout
    const coreRouter = {
      id: 'core-router',
      type: 'router',
      position: { x: 400, y: 100 },
      data: { 
        device: {
          name: 'Core Router',
          device_type: 'Router',
          ip_address: '10.0.0.1',
          download_bps: 10000000000, // 10 Gbps
          upload_bps: 10000000000,
          usage_mb: 50000,
          experience: 'Excellent'
        }
      },
    };
    flowNodes.push(coreRouter);

    // Add distribution switches
    const distributionSwitches = [
      { id: 'dist-sw-1', name: 'Distribution SW 1', x: 200, y: 300, subnet: '192.168.1' },
      { id: 'dist-sw-2', name: 'Distribution SW 2', x: 600, y: 300, subnet: '192.168.2' },
      { id: 'dist-sw-3', name: 'Distribution SW 3', x: 400, y: 500, subnet: '192.168.3' },
    ];

    distributionSwitches.forEach((sw, index) => {
      flowNodes.push({
        id: sw.id,
        type: 'switch',
        position: { x: sw.x, y: sw.y },
        data: {
          device: {
            name: sw.name,
            device_type: 'Switch',
            ip_address: `${sw.subnet}.1`,
            download_bps: 1000000000 * (3 - index), // 1-3 Gbps
            upload_bps: 1000000000 * (3 - index),
            usage_mb: 15000 + (index * 5000),
            experience: index === 0 ? 'Excellent' : index === 1 ? 'Good' : 'Fair'
          }
        },
      });

      // Connect to core router with bandwidth labels
      const bandwidth = (3 - index) * 1000; // Mbps
      flowEdges.push({
        id: `core-to-${sw.id}`,
        source: 'core-router',
        target: sw.id,
        type: 'smoothstep',
        style: { 
          stroke: bandwidth > 2000 ? '#22c55e' : bandwidth > 1000 ? '#f59e0b' : '#ef4444',
          strokeWidth: Math.max(2, bandwidth / 500),
        },
        label: `${bandwidth} Mbps`,
        labelStyle: { fill: '#ffffff', fontWeight: 'bold' },
        labelBgStyle: { fill: '#000000', fillOpacity: 0.8 },
        animated: true,
      });
    });

    // Add access switches connected to distribution switches
    distributionSwitches.forEach((distSw, distIndex) => {
      for (let i = 0; i < 3; i++) {
        const accessSw = {
          id: `access-sw-${distIndex}-${i}`,
          name: `Access SW ${distIndex + 1}-${i + 1}`,
          x: distSw.x + (i - 1) * 150,
          y: distSw.y + 200,
        };

        flowNodes.push({
          id: accessSw.id,
          type: 'switch',
          position: { x: accessSw.x, y: accessSw.y },
          data: {
            device: {
              name: accessSw.name,
              device_type: 'Access Switch',
              ip_address: `${distSw.subnet}.${10 + i}`,
              download_bps: 100000000, // 100 Mbps
              upload_bps: 100000000,
              usage_mb: 2000 + (i * 500),
              experience: ['Good', 'Fair', 'Poor'][i % 3]
            }
          },
        });

        const bandwidth = 100 + (Math.random() * 400); // 100-500 Mbps
        flowEdges.push({
          id: `${distSw.id}-to-${accessSw.id}`,
          source: distSw.id,
          target: accessSw.id,
          type: 'smoothstep',
          style: { 
            stroke: bandwidth > 300 ? '#22c55e' : bandwidth > 200 ? '#f59e0b' : '#ef4444',
            strokeWidth: Math.max(1, bandwidth / 100),
          },
          label: `${bandwidth.toFixed(0)} Mbps`,
          labelStyle: { fill: '#ffffff', fontSize: '10px' },
          labelBgStyle: { fill: '#000000', fillOpacity: 0.7 },
        });
      }
    });

    return { flowNodes, flowEdges };
  }, []);

  const [flowMapNodes, setFlowMapNodes, onFlowMapNodesChange] = useNodesState(flowNodes);
  const [flowMapEdges, setFlowMapEdges, onFlowMapEdgesChange] = useEdgesState(flowEdges);

  const onFlowMapConnect = useCallback(
    (params: Connection) => setFlowMapEdges((eds) => addEdge(params, eds)),
    [setFlowMapEdges]
  );

  // Simulate new device discovery
  useEffect(() => {
    if (animationsEnabled && !isLocked) {
      const interval = setInterval(() => {
        if (Math.random() > 0.95) { // 5% chance every interval
          setNewDeviceCount(prev => prev + 1);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [animationsEnabled, isLocked]);

  return (
    <div className="w-full h-full relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant={useSampleData ? "default" : "outline"}
          size="sm"
          onClick={() => setUseSampleData(!useSampleData)}
          className="bg-black/80 border-blue-600 text-blue-300 hover:bg-blue-900/50"
        >
          {useSampleData ? "Using Sample Data" : "Use Sample Data"}
        </Button>
      </div>

      <NetworkToolbar
        isLocked={isLocked}
        onToggleLock={() => setIsLocked(!isLocked)}
        onAutoLayout={handleAutoLayout}
        onGridLayout={handleGridLayout}
        onAddDevice={() => handleAddDevice()}
        onReset={handleReset}
        animationsEnabled={animationsEnabled}
        onToggleAnimations={() => setAnimationsEnabled(!animationsEnabled)}
        newDeviceCount={newDeviceCount}
      />
      
      <Tabs defaultValue="topology" className="w-full h-full">
        <TabsList className="absolute top-4 left-4 z-10 bg-black/80 border-blue-600">
          <TabsTrigger value="topology" className="text-blue-300 data-[state=active]:bg-blue-900/50">
            Device Topology
          </TabsTrigger>
          <TabsTrigger value="flowmap" className="text-blue-300 data-[state=active]:bg-blue-900/50">
            Flow Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="topology" className="w-full h-full mt-0">
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
        </TabsContent>

        <TabsContent value="flowmap" className="w-full h-full mt-0">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
