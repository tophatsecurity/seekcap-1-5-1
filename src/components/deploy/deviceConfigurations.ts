
import { 
  Router, 
  Database, 
  Shield, 
  ServerOff, 
  Network, 
  Cpu 
} from "lucide-react";

export interface DeviceConfig {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  defaultVendor: string;
}

export const networkDevices: DeviceConfig[] = [
  {
    id: "router",
    name: "Router",
    description: "Deploy to network routers",
    icon: <Router className="h-12 w-12 text-blue-500" />,
    defaultVendor: "Cisco"
  },
  {
    id: "switch",
    name: "Switch",
    description: "Deploy to network switches",
    icon: <Network className="h-12 w-12 text-green-500" />,
    defaultVendor: "Cisco"
  }
];

export const serverDevices: DeviceConfig[] = [
  {
    id: "server",
    name: "Server/VM",
    description: "Deploy to physical or virtual servers",
    icon: <Database className="h-12 w-12 text-purple-500" />,
    defaultVendor: "VMware"
  },
  {
    id: "appliance",
    name: "Network Appliance",
    description: "Deploy to specialized network devices",
    icon: <Cpu className="h-12 w-12 text-amber-500" />,
    defaultVendor: "F5"
  }
];

export const securityDevices: DeviceConfig[] = [
  {
    id: "security",
    name: "Security Device",
    description: "Deploy to firewalls or security appliances",
    icon: <Shield className="h-12 w-12 text-red-500" />,
    defaultVendor: "Palo Alto"
  },
  {
    id: "other",
    name: "Other Device",
    description: "Deploy to another type of network device",
    icon: <ServerOff className="h-12 w-12 text-gray-500" />,
    defaultVendor: "Generic"
  }
];

export const allDevices = [...networkDevices, ...serverDevices, ...securityDevices];
