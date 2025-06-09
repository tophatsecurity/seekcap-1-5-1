
import { 
  Router, 
  Database, 
  Shield, 
  ServerOff, 
  Network, 
  Cpu 
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface DeviceConfig {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  defaultVendor: string;
}

export const networkDevices: DeviceConfig[] = [
  {
    id: "router",
    name: "Router",
    description: "Deploy to network routers",
    icon: Router,
    iconColor: "text-blue-500",
    defaultVendor: "Cisco"
  },
  {
    id: "switch",
    name: "Switch",
    description: "Deploy to network switches",
    icon: Network,
    iconColor: "text-green-500",
    defaultVendor: "Cisco"
  }
];

export const serverDevices: DeviceConfig[] = [
  {
    id: "server",
    name: "Server/VM",
    description: "Deploy to physical or virtual servers",
    icon: Database,
    iconColor: "text-purple-500",
    defaultVendor: "VMware"
  },
  {
    id: "appliance",
    name: "Network Appliance",
    description: "Deploy to specialized network devices",
    icon: Cpu,
    iconColor: "text-amber-500",
    defaultVendor: "F5"
  }
];

export const securityDevices: DeviceConfig[] = [
  {
    id: "security",
    name: "Security Device",
    description: "Deploy to firewalls or security appliances",
    icon: Shield,
    iconColor: "text-red-500",
    defaultVendor: "Palo Alto"
  },
  {
    id: "other",
    name: "Other Device",
    description: "Deploy to another type of network device",
    icon: ServerOff,
    iconColor: "text-gray-500",
    defaultVendor: "Generic"
  }
];

export const allDevices = [...networkDevices, ...serverDevices, ...securityDevices];
