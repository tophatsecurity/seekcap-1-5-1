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
      download_bps: Math.floor(Math.random() * 1000000000) + 1000000,
      upload_bps: Math.floor(Math.random() * 500000000) + 500000,
      uptime: `${Math.floor(Math.random() * 365)}d ${Math.floor(Math.random() * 24)}h ${Math.floor(Math.random() * 60)}m`,
      channel_width: technology === "Wi-Fi" ? (Math.random() > 0.5 ? "20MHz" : "40MHz") : null,
      noise_floor: technology === "Wi-Fi" ? Math.floor(Math.random() * 20) - 100 : null,
      tx_rate: technology === "Wi-Fi" ? Math.floor(Math.random() * 150) + 50 : null,
      rx_rate: technology === "Wi-Fi" ? Math.floor(Math.random() * 150) + 50 : null,
      tx_power: technology === "Wi-Fi" ? Math.floor(Math.random() * 20) + 10 : null,
      distance: Math.floor(Math.random() * 1000) + 10,
      ccq: Math.floor(Math.random() * 100) + 1,
      airtime: technology === "Wi-Fi" ? Math.floor(Math.random() * 50) + 1 : null,
      connection: Math.random() > 0.3 ? "Connected" : "Disconnected",
      network: `Network-${subnet}`,
      wifi: technology === "Wi-Fi" ? `WiFi-${subnet}` : null,
    });
  }

  return sampleAssets;
};

// Enhanced network device generation with realistic switch configurations
const generateRealisticNetworkDevices = (): NetworkDevice[] => {
  const switchVendors = [
    { name: "Cisco", models: ["Catalyst 9300-24P", "Catalyst 2960-48P", "Nexus 9348GC-FXP", "Catalyst 3850-12X48U"] },
    { name: "Juniper", models: ["EX3400-24P", "EX4300-48P", "QFX5100-48S", "EX2300-24T"] },
    { name: "Arista", models: ["7050SX-64", "7280SR-48C6", "7050QX-32S", "7160-48YC6"] }
  ];
  
  const routerVendors = [
    { name: "Cisco", models: ["ISR4431", "ASR1001-X", "ISR4321"] },
    { name: "Juniper", models: ["MX204", "SRX300", "ACX5048"] }
  ];

  const portConfigurations = [
    { count: 24, type: "24-port" },
    { count: 48, type: "48-port" },
    { count: 12, type: "12-port" },
    { count: 32, type: "32-port" },
    { count: 64, type: "64-port" }
  ];
  
  const devices: NetworkDevice[] = [];
  
  // Generate core routers
  for (let i = 0; i < 2; i++) {
    const vendor = routerVendors[Math.floor(Math.random() * routerVendors.length)];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    
    devices.push({
      id: i + 1,
      name: `Core-Router-${vendor.name}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Router",
      ip_address: `10.0.0.${i + 1}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:00:00:01`,
      status: Math.random() > 0.1 ? "Online" : "Offline",
      application: `${vendor.name} ${model}`,
      uplink: null,
      parent_device: null,
      connected: Math.floor(Math.random() * 100) + 50,
      experience: ["Excellent", "Good"][Math.floor(Math.random() * 2)],
      download: `${Math.floor(Math.random() * 5000) + 1000}Mbps`,
      upload: `${Math.floor(Math.random() * 2000) + 500}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 50) + 10}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  
  // Generate distribution switches
  for (let i = 0; i < 4; i++) {
    const vendor = switchVendors[Math.floor(Math.random() * switchVendors.length)];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    const portConfig = portConfigurations[Math.floor(Math.random() * portConfigurations.length)];
    
    devices.push({
      id: devices.length + 1,
      name: `Dist-Switch-${vendor.name}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Distribution Switch",
      ip_address: `10.0.1.${i + 10}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:01:00:01`,
      status: Math.random() > 0.15 ? "Online" : "Offline",
      application: `${vendor.name} ${model} (${portConfig.type})`,
      uplink: devices[0]?.name || null,
      parent_device: devices[0]?.name || null,
      connected: Math.floor(Math.random() * portConfig.count * 0.8) + Math.floor(portConfig.count * 0.2),
      experience: ["Excellent", "Good", "Fair"][Math.floor(Math.random() * 3)],
      download: `${Math.floor(Math.random() * 2000) + 500}Mbps`,
      upload: `${Math.floor(Math.random() * 1000) + 200}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 25) + 5}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      port_count: portConfig.count
    });
  }
  
  // Generate access switches
  for (let i = 0; i < 8; i++) {
    const vendor = switchVendors[Math.floor(Math.random() * switchVendors.length)];
    const model = vendor.models[Math.floor(Math.random() * vendor.models.length)];
    const portConfig = portConfigurations.filter(p => p.count <= 48)[Math.floor(Math.random() * 3)]; // Smaller switches for access layer
    const parentSwitch = devices.find(d => d.device_type === "Distribution Switch");
    
    devices.push({
      id: devices.length + 1,
      name: `Access-Switch-${vendor.name}-${String(i + 1).padStart(2, '0')}`,
      device_type: "Access Switch",
      ip_address: `192.168.${Math.floor(i / 4) + 1}.${(i % 4) + 10}`,
      mac_address: `00:${vendor.name.substring(0, 2).toLowerCase()}:${i.toString(16).padStart(2, '0')}:02:00:01`,
      status: Math.random() > 0.2 ? "Online" : "Offline",
      application: `${vendor.name} ${model} (${portConfig.type})`,
      uplink: parentSwitch?.name || null,
      parent_device: parentSwitch?.name || null,
      connected: Math.floor(Math.random() * portConfig.count * 0.7) + Math.floor(portConfig.count * 0.1),
      experience: ["Good", "Fair", "Poor"][Math.floor(Math.random() * 3)],
      download: `${Math.floor(Math.random() * 500) + 100}Mbps`,
      upload: `${Math.floor(Math.random() * 200) + 50}Mbps`,
      usage_24hr: `${Math.floor(Math.random() * 10) + 2}GB`,
      ch_24_ghz: null,
      ch_5_ghz: null,
      first_seen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      port_count: portConfig.count
    });
  }
  
  return devices;
};

interface NetworkTopologyProps {
  assets: Asset[];
  networkDevices: NetworkDevice[];
  selectedDevice?: NetworkDevice | Asset | null;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ 
  assets: propAssets, 
  networkDevices: propNetworkDevices,
  selectedDevice
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [newDeviceCount, setNewDeviceCount] = useState(0);
  
  // Use enhanced sample data if no real data provided
  const assets = propAssets.length === 0 ? generateDetailedSampleAssets() : propAssets;
  const networkDevices = propNetworkDevices.length === 0 ? generateRealisticNetworkDevices() : propNetworkDevices;

  // Generate port data for switches
  const generatePortData = (device: NetworkDevice) => {
    const portCount = device.port_count || 24;
    return Array.from({ length: portCount }, (_, i) => ({
      id: `${device.name}-port-${i + 1}`,
      number: i + 1,
      status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'inactive' : 'blocked',
      vlan: Math.random() > 0.7 ? `VLAN${Math.floor(Math.random() * 10) + 1}` : undefined,
      connectedDevice: Math.random() > 0.6 ? {
        name: `Device-${device.name.split('-')[2]}-${i + 1}`,
        mac: `00:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}:${Math.random().toString(16).substr(2, 2)}`,
        type: ['PC', 'Printer', 'Phone', 'Camera', 'Sensor', 'Controller'][Math.floor(Math.random() * 6)]
      } : undefined
    }));
  };

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Add network infrastructure devices with enhanced switch capabilities
    networkDevices.forEach((device, index) => {
      const isSwitch = device.device_type?.toLowerCase().includes('switch');
      const isSelected = selectedDevice && 'id' in selectedDevice && selectedDevice.id === device.id;
      
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
            download_bps: device.download_bps || parseInt(device.download?.replace(/[^\d]/g, '') || '0') * 1000000,
            upload_bps: device.upload_bps || parseInt(device.upload?.replace(/[^\d]/g, '') || '0') * 1000000,
            usage_mb: device.usage_mb || parseInt(device.usage_24hr?.replace(/[^\d]/g, '') || '0') * 1000,
          },
          // Add port data for switches
          ...(isSwitch && {
            ports: generatePortData(device),
            onPortClick: (portId: string) => console.log('Port clicked:', portId),
            onAddDevice: (portId: string) => handleAddDevice(portId),
            isLocked
          })
        },
        draggable: !isLocked,
        selected: isSelected,
        style: isSelected ? { 
          filter: 'drop-shadow(0 0 10px #3b82f6)', 
          transform: 'scale(1.05)' 
        } : undefined,
      });
    });

    // Add asset devices
    assets.forEach((asset, index) => {
      const isSelected = selectedDevice && 'mac_address' in selectedDevice && 
                        selectedDevice.mac_address === asset.mac_address;
      
      nodes.push({
        id: `asset-${asset.mac_address}`,
        type: 'device',
        position: { 
          x: 200 + (index % 5) * 250, 
          y: 300 + Math.floor(index / 5) * 280 
        },
        data: { device: asset },
        draggable: !isLocked,
        selected: isSelected,
        style: isSelected ? { 
          filter: 'drop-shadow(0 0 10px #f59e0b)', 
          transform: 'scale(1.05)' 
        } : undefined,
      });

      // Create connections from assets to network devices with bandwidth-based styling
      if (networkDevices.length > 0) {
        const targetDevice = networkDevices[index % networkDevices.length];
        const bandwidth = (asset.download_bps || 0) + (asset.upload_bps || 0);
        const utilization = Math.min((bandwidth / 1000000000) * 100, 100); // Convert to percentage of 1Gbps
        
        // Determine edge color based on bandwidth utilization
        let edgeColor = '#22c55e'; // Green for low usage
        if (utilization > 80) edgeColor = '#ef4444'; // Red for high usage
        else if (utilization > 60) edgeColor = '#f59e0b'; // Yellow for medium usage
        
        // Determine edge width based on bandwidth magnitude
        const strokeWidth = Math.max(2, Math.min(8, (bandwidth / 100000000) + 2)); // 2-8px based on bandwidth
        
        edges.push({
          id: `edge-${asset.mac_address}-to-${targetDevice.id}`,
          source: `asset-${asset.mac_address}`,
          target: `network-${targetDevice.id || index % networkDevices.length}`,
          type: 'smoothstep',
          style: { 
            stroke: asset.connection === 'Connected' ? edgeColor : '#ef4444',
            strokeWidth: asset.connection === 'Connected' ? strokeWidth : 2,
          },
          animated: asset.connection === 'Connected' && animationsEnabled,
          label: bandwidth > 10000000 ? `${(bandwidth / 1000000).toFixed(0)}Mbps` : undefined,
          labelStyle: { fill: '#ffffff', fontWeight: 'bold', fontSize: '10px' },
          labelBgStyle: { fill: '#000000', fillOpacity: 0.8 },
        });
      }
    });

    // Create connections between network devices with enhanced bandwidth visualization
    for (let i = 1; i < networkDevices.length; i++) {
      if (networkDevices[i].parent_device) {
        const parentIndex = networkDevices.findIndex(d => d.name === networkDevices[i].parent_device);
        if (parentIndex !== -1) {
          const device = networkDevices[i];
          const bandwidth = (device.download_bps || 0) + (device.upload_bps || 0);
          const utilization = Math.min((bandwidth / 10000000000) * 100, 100); // 10Gbps max for backbone
          
          let edgeColor = '#3b82f6'; // Blue for normal backbone
          if (utilization > 80) edgeColor = '#ef4444';
          else if (utilization > 60) edgeColor = '#f59e0b';
          
          const strokeWidth = Math.max(3, Math.min(10, (bandwidth / 1000000000) + 3)); // 3-10px for backbone
          
          edges.push({
            id: `network-edge-${i}`,
            source: `network-${networkDevices[i].id || i}`,
            target: `network-${networkDevices[parentIndex].id || parentIndex}`,
            type: 'straight',
            style: { 
              stroke: edgeColor, 
              strokeWidth: strokeWidth 
            },
            animated: animationsEnabled,
            label: bandwidth > 100000000 ? `${(bandwidth / 1000000000).toFixed(1)}Gbps` : undefined,
            labelStyle: { fill: '#ffffff', fontWeight: 'bold' },
            labelBgStyle: { fill: '#000000', fillOpacity: 0.8 },
          });
        }
      }
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [assets, networkDevices, isLocked, animationsEnabled, selectedDevice]);

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

  // Update nodes when selectedDevice changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [selectedDevice, initialNodes, initialEdges, setNodes, setEdges]);

  // Generate flow map data with enhanced bandwidth visualization
  const { flowNodes, flowEdges } = useMemo(() => {
    const flowNodes: Node[] = [];
    const flowEdges: Edge[] = [];

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
          download_bps: 10000000000, // 10 Gbps
          upload_bps: 10000000000,
          usage_mb: 50000,
          experience: 'Excellent'
        }
      },
    };
    flowNodes.push(coreRouter);

    // Add distribution switches with varying bandwidth loads
    const distributionSwitches = [
      { id: 'dist-sw-1', name: 'Distribution SW 1', x: 200, y: 300, subnet: '192.168.1', load: 0.85 },
      { id: 'dist-sw-2', name: 'Distribution SW 2', x: 600, y: 300, subnet: '192.168.2', load: 0.65 },
      { id: 'dist-sw-3', name: 'Distribution SW 3', x: 400, y: 500, subnet: '192.168.3', load: 0.45 },
    ];

    distributionSwitches.forEach((sw, index) => {
      const baseBandwidth = 1000000000; // 1 Gbps base
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
            bandwidth_utilization: sw.load * 100
          }
        },
      });

      // Connect to core router with bandwidth-based visualization
      const utilization = sw.load * 100;
      let edgeColor = '#22c55e'; // Green
      if (utilization > 80) edgeColor = '#ef4444'; // Red
      else if (utilization > 60) edgeColor = '#f59e0b'; // Yellow
      
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
        animated: sw.load > 0.7,
      });
    });

    // Add access switches with varying loads
    distributionSwitches.forEach((distSw, distIndex) => {
      for (let i = 0; i < 3; i++) {
        const load = Math.random() * 0.8 + 0.1; // 10-90% load
        const accessSw = {
          id: `access-sw-${distIndex}-${i}`,
          name: `Access SW ${distIndex + 1}-${i + 1}`,
          x: distSw.x + (i - 1) * 150,
          y: distSw.y + 200,
          load: load
        };

        const bandwidth = 100000000 * load; // Up to 100 Mbps
        
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
              bandwidth_utilization: load * 100
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
          animated: load > 0.6,
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
