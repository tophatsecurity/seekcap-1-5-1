
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
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Asset, NetworkDevice } from '@/lib/db/types';
import DeviceNode from './DeviceNode';
import RouterNode from './RouterNode';
import SwitchNode from './SwitchNode';
import VlanNode from './VlanNode';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, Filter, Eye, EyeOff } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

// Define node types
const nodeTypes = {
  device: DeviceNode,
  router: RouterNode,
  switch: SwitchNode,
  vlan: VlanNode,
};

interface NetworkTopologyProps {
  assets: Asset[];
  networkDevices: NetworkDevice[];
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ assets, networkDevices }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showProtocols, setShowProtocols] = useState(true);
  const reactFlowInstance = useReactFlow();
  
  // Set up filters
  const [activeProtocolFilters, setActiveProtocolFilters] = useState<string[]>([]);
  const availableProtocols = ['BACnet', 'Modbus', 'CIP', 'HTTPS', 'SNMP', 'MQTT'];
  
  const toggleProtocolFilter = (protocol: string) => {
    if (activeProtocolFilters.includes(protocol)) {
      setActiveProtocolFilters(activeProtocolFilters.filter(p => p !== protocol));
    } else {
      setActiveProtocolFilters([...activeProtocolFilters, protocol]);
    }
  };
  
  // Generate network topology graph on component mount or when data changes
  React.useEffect(() => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];
    
    // Start with a central router
    generatedNodes.push({
      id: 'central',
      type: 'router',
      data: { 
        label: 'Main Router',
        device: {
          name: 'Main Router',
          device_type: 'router',
          ip_address: '192.168.1.1',
          mac_address: '00:11:22:33:44:55',
          status: 'Online',
        },
      },
      position: { x: 0, y: 0 },
    });
    
    // Add switches around the central router
    const switches = networkDevices.filter(
      (device) => device.device_type?.toLowerCase().includes('switch')
    ) || [];
    
    // If no switches in the database, add sample ones
    const sampleSwitches = switches.length > 0 ? switches : [
      { 
        id: 1, 
        name: 'Core Switch', 
        device_type: 'switch', 
        ip_address: '192.168.1.2', 
        mac_address: '00:1A:2B:3C:4D:5E',
        status: 'Online',
        application: 'Network Infrastructure',
      },
      { 
        id: 2, 
        name: 'Building A Switch', 
        device_type: 'switch', 
        ip_address: '192.168.2.1', 
        mac_address: '00:2B:3C:4D:5E:6F',
        status: 'Online',
        application: 'Building Automation',
      },
      { 
        id: 3, 
        name: 'Building B Switch', 
        device_type: 'switch', 
        ip_address: '192.168.3.1', 
        mac_address: '00:3C:4D:5E:6F:7G',
        status: 'Online',
        application: 'Manufacturing',
      },
      { 
        id: 4, 
        name: 'Building C Switch', 
        device_type: 'switch', 
        ip_address: '192.168.4.1', 
        mac_address: '00:4D:5E:6F:7G:8H',
        status: 'Online', 
        application: 'Security',
      }
    ];
    
    // Add switches in a circle around the central router
    sampleSwitches.forEach((device, i) => {
      const angle = (2 * Math.PI * i) / Math.max(sampleSwitches.length, 1);
      const radius = 250;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      
      const switchId = `switch-${device.mac_address || i}`;
      
      generatedNodes.push({
        id: switchId,
        type: 'switch',
        data: { 
          label: device.name,
          device,
        },
        position: { x, y },
      });
      
      // Connect to central router
      generatedEdges.push({
        id: `e-central-${switchId}`,
        source: 'central',
        target: switchId,
        animated: true,
        label: '1 Gbps',
        style: { stroke: '#0066ff', strokeWidth: 2 },
      });
      
      // Add VLANs to each switch
      const vlans = [
        { id: 10 + i*10, name: `VLAN ${10 + i*10}`, description: 'Management' },
        { id: 20 + i*10, name: `VLAN ${20 + i*10}`, description: 'Voice' },
        { id: 30 + i*10, name: `VLAN ${30 + i*10}`, description: 'Data' },
      ];
      
      vlans.forEach((vlan, vIndex) => {
        const vlanAngle = angle + (vIndex - 1) * 0.3;
        const vlanRadius = radius + 130;
        const vlanX = vlanRadius * Math.cos(vlanAngle);
        const vlanY = vlanRadius * Math.sin(vlanAngle);
        
        const vlanId = `vlan-${device.mac_address || i}-${vlan.id}`;
        
        generatedNodes.push({
          id: vlanId,
          type: 'vlan',
          data: { 
            label: vlan.name,
            vlan,
          },
          position: { x: vlanX, y: vlanY },
        });
        
        generatedEdges.push({
          id: `e-${switchId}-${vlanId}`,
          source: switchId,
          target: vlanId,
          animated: false,
          style: { stroke: '#00aa55', strokeWidth: 1, strokeDasharray: '5,5' },
        });
      });
    });
    
    // Add end devices (computers, phones, etc.) including those with specific protocols
    const endDevices = [...networkDevices.filter(
      (device) => !device.device_type?.toLowerCase().includes('router') && 
                 !device.device_type?.toLowerCase().includes('switch')
    ), ...assets.filter(asset => !asset.mac_address.startsWith('00:00:00'))];
    
    // If no devices in the database, add sample ones
    const sampleDevices = endDevices.length > 0 ? endDevices : [
      { 
        name: 'BMS Controller', 
        device_type: 'bacnet', 
        ip_address: '192.168.2.10', 
        mac_address: 'AA:BB:CC:DD:EE:01',
        experience: 'Good',
        vendor: 'Johnson Controls',
        protocol: 'BACnet/IP',
      },
      { 
        name: 'VAV Box 1', 
        device_type: 'bacnet', 
        ip_address: '192.168.2.11', 
        mac_address: 'AA:BB:CC:DD:EE:02', 
        vendor: 'Siemens',
        protocol: 'BACnet/MSTP',
      },
      { 
        name: 'VAV Box 2', 
        device_type: 'bacnet', 
        ip_address: '192.168.2.12', 
        mac_address: 'AA:BB:CC:DD:EE:03', 
        vendor: 'Siemens',
        protocol: 'BACnet/MSTP',
      },
      { 
        name: 'Chiller', 
        device_type: 'modbus', 
        ip_address: '192.168.2.20', 
        mac_address: 'AA:BB:CC:DD:EE:04', 
        vendor: 'Carrier',
        protocol: 'Modbus TCP',
      },
      { 
        name: 'PLC Controller', 
        device_type: 'cip', 
        ip_address: '192.168.3.10', 
        mac_address: 'AA:BB:CC:DD:EE:05', 
        vendor: 'Allen-Bradley',
        protocol: 'CIP',
      },
      { 
        name: 'Motor Drive', 
        device_type: 'modbus', 
        ip_address: '192.168.3.11', 
        mac_address: 'AA:BB:CC:DD:EE:06', 
        vendor: 'ABB',
        protocol: 'Modbus RTU',
      },
      { 
        name: 'HMI Panel', 
        device_type: 'computer', 
        ip_address: '192.168.3.12', 
        mac_address: 'AA:BB:CC:DD:EE:07', 
        vendor: 'Dell',
        protocol: 'HTTPS',
      },
      { 
        name: 'Security Camera 1', 
        device_type: 'camera', 
        ip_address: '192.168.4.10', 
        mac_address: 'AA:BB:CC:DD:EE:08', 
        vendor: 'Axis',
        protocol: 'RTSP',
      },
      { 
        name: 'Security Camera 2', 
        device_type: 'camera', 
        ip_address: '192.168.4.11', 
        mac_address: 'AA:BB:CC:DD:EE:09', 
        vendor: 'Axis',
        protocol: 'RTSP',
      },
      { 
        name: 'Access Control', 
        device_type: 'security', 
        ip_address: '192.168.4.12', 
        mac_address: 'AA:BB:CC:DD:EE:10', 
        vendor: 'Lenel',
        protocol: 'MQTT',
      },
      { 
        name: 'Workstation 1', 
        device_type: 'computer', 
        ip_address: '192.168.1.100', 
        mac_address: 'AA:BB:CC:DD:EE:11', 
        vendor: 'HP',
        protocol: 'HTTPS',
      },
      { 
        name: 'Workstation 2', 
        device_type: 'computer', 
        ip_address: '192.168.1.101', 
        mac_address: 'AA:BB:CC:DD:EE:12', 
        vendor: 'Lenovo',
        protocol: 'HTTPS',
      }
    ];
    
    // Distribute devices to various switches based on IP subnet
    sampleDevices.forEach((device, i) => {
      // Determine which switch to connect to based on IP subnet
      let switchIndex = 0;
      if (device.ip_address) {
        const ipParts = device.ip_address.split('.');
        if (ipParts.length === 4) {
          const subnet = parseInt(ipParts[2]);
          switchIndex = Math.min(subnet - 1, sampleSwitches.length - 1);
          if (switchIndex < 0) switchIndex = 0;
        }
      }
      
      const parentId = `switch-${sampleSwitches[switchIndex].mac_address || switchIndex}`;
      
      // Find the VLAN to connect to based on device type
      let vlanIndex = 2; // Default to data VLAN
      if (device.device_type === 'phone') vlanIndex = 1; // Voice VLAN
      else if (['security', 'router', 'switch'].includes(device.device_type || '')) vlanIndex = 0; // Management VLAN
      
      const vlanId = `vlan-${sampleSwitches[switchIndex].mac_address || switchIndex}-${10 + switchIndex*10 + vlanIndex*10}`;
      
      const deviceId = device.mac_address || `device-${i}`;
      
      // Calculate position: distribute around the VLAN
      const vlanNode = generatedNodes.find(node => node.id === vlanId);
      if (!vlanNode) return;
      
      const devicesPerVlan = sampleDevices.filter(d => {
        if (!d.ip_address) return false;
        const ipParts = d.ip_address.split('.');
        if (ipParts.length !== 4) return false;
        
        const subnet = parseInt(ipParts[2]);
        const matchedSwitch = Math.min(subnet - 1, sampleSwitches.length - 1);
        return matchedSwitch === switchIndex;
      }).length;
      
      const deviceAngle = (2 * Math.PI * (i % Math.max(devicesPerVlan, 8))) / 8;
      const deviceRadius = 120;
      
      const deviceX = vlanNode.position.x + deviceRadius * Math.cos(deviceAngle);
      const deviceY = vlanNode.position.y + deviceRadius * Math.sin(deviceAngle);
      
      // Skip devices if protocol filters are active
      const deviceProtocol = device.protocol || '';
      if (activeProtocolFilters.length > 0) {
        const hasMatchingProtocol = activeProtocolFilters.some(protocol => 
          deviceProtocol.toLowerCase().includes(protocol.toLowerCase())
        );
        if (!hasMatchingProtocol) {
          return; // Skip this device
        }
      }
      
      generatedNodes.push({
        id: deviceId,
        type: 'device',
        data: { 
          label: device.name || `Device ${i}`,
          device,
        },
        position: { x: deviceX, y: deviceY },
      });
      
      generatedEdges.push({
        id: `e-${vlanId}-${deviceId}`,
        source: vlanId,
        target: deviceId,
        type: 'straight',
        style: { stroke: '#00aaff' },
      });
    });
    
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [assets, networkDevices, setNodes, setEdges, activeProtocolFilters]);
  
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, type: 'straight' }, eds)),
    [setEdges]
  );
  
  const resetView = useCallback(() => {
    reactFlowInstance.fitView();
  }, [reactFlowInstance]);
  
  const handleZoomIn = () => {
    reactFlowInstance.zoomIn();
  };
  
  const handleZoomOut = () => {
    reactFlowInstance.zoomOut();
  };
  
  return (
    <div className="h-full w-full">
      <Tabs defaultValue="topology" className="h-full">
        <div className="flex items-center justify-between border-b">
          <TabsList className="ml-4 my-1">
            <TabsTrigger value="topology">Network View</TabsTrigger>
            <TabsTrigger value="protocols">Protocols</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2 mr-4 my-1">
            {showProtocols && 
              <div className="flex items-center space-x-2">
                {availableProtocols.map(protocol => (
                  <Badge 
                    key={protocol}
                    variant={activeProtocolFilters.includes(protocol) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleProtocolFilter(protocol)}
                  >
                    {protocol}
                  </Badge>
                ))}
              </div>
            }
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowProtocols(!showProtocols)}
              className="h-8 w-8"
            >
              {showProtocols ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <TabsContent value="topology" className="h-full">
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
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-black/70 text-blue-400 border-blue-800"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-black/70 text-blue-400 border-blue-800"
                onClick={handleZoomOut}
              >
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
        </TabsContent>
        
        <TabsContent value="protocols" className="h-full p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-md p-4">
              <h3 className="font-bold mb-2">BACnet</h3>
              <p className="text-sm text-muted-foreground">Building Automation and Control Network protocol used in building automation systems.</p>
              <div className="mt-2">
                <Badge variant="outline">Port 47808</Badge>
                <Badge variant="outline" className="ml-2">BACnet/IP</Badge>
                <Badge variant="outline" className="ml-2">BACnet/MSTP</Badge>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-bold mb-2">Modbus</h3>
              <p className="text-sm text-muted-foreground">Serial communications protocol for PLC and other industrial devices.</p>
              <div className="mt-2">
                <Badge variant="outline">Port 502</Badge>
                <Badge variant="outline" className="ml-2">Modbus TCP</Badge>
                <Badge variant="outline" className="ml-2">Modbus RTU</Badge>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-bold mb-2">CIP</h3>
              <p className="text-sm text-muted-foreground">Common Industrial Protocol used in industrial automation applications.</p>
              <div className="mt-2">
                <Badge variant="outline">Port 44818</Badge>
                <Badge variant="outline" className="ml-2">EtherNet/IP</Badge>
                <Badge variant="outline" className="ml-2">DeviceNet</Badge>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-bold mb-2">SNMP</h3>
              <p className="text-sm text-muted-foreground">Simple Network Management Protocol for collecting and organizing information about managed devices.</p>
              <div className="mt-2">
                <Badge variant="outline">Port 161/162</Badge>
                <Badge variant="outline" className="ml-2">SNMPv2</Badge>
                <Badge variant="outline" className="ml-2">SNMPv3</Badge>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-bold mb-2">HTTPS</h3>
              <p className="text-sm text-muted-foreground">HTTP Secure for secure communication over a computer network.</p>
              <div className="mt-2">
                <Badge variant="outline">Port 443</Badge>
                <Badge variant="outline" className="ml-2">TLS</Badge>
                <Badge variant="outline" className="ml-2">SSL</Badge>
              </div>
            </div>
            <div className="border rounded-md p-4">
              <h3 className="font-bold mb-2">MQTT</h3>
              <p className="text-sm text-muted-foreground">Message Queuing Telemetry Transport is an OASIS standard messaging protocol for IoT.</p>
              <div className="mt-2">
                <Badge variant="outline">Port 1883/8883</Badge>
                <Badge variant="outline" className="ml-2">QoS 0</Badge>
                <Badge variant="outline" className="ml-2">QoS 1</Badge>
                <Badge variant="outline" className="ml-2">QoS 2</Badge>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
