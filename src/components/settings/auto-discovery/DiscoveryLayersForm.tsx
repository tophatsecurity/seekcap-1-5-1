
import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Layers } from "lucide-react";
import { AutoDiscoverySettings } from "@/lib/db/types";

interface DiscoveryLayersFormProps {
  settings: AutoDiscoverySettings;
  onLayerToggle: (layer: string) => void;
}

const DiscoveryLayersForm: React.FC<DiscoveryLayersFormProps> = ({
  settings,
  onLayerToggle,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
        <Layers className="h-4 w-4" /> Discovery Layers
      </h3>
      <div className="grid gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="layer-datalink"
            checked={settings.target_layers.includes("datalink")}
            onCheckedChange={() => onLayerToggle("datalink")}
          />
          <label
            htmlFor="layer-datalink"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Data Link Layer (L2) - MAC addresses, switches
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="layer-network"
            checked={settings.target_layers.includes("network")}
            onCheckedChange={() => onLayerToggle("network")}
          />
          <label
            htmlFor="layer-network"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Network Layer (L3) - IP addresses, routers, subnets
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="layer-transport"
            checked={settings.target_layers.includes("transport")}
            onCheckedChange={() => onLayerToggle("transport")}
          />
          <label
            htmlFor="layer-transport"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Transport Layer (L4) - Ports, TCP/UDP connections
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="layer-application"
            checked={settings.target_layers.includes("application")}
            onCheckedChange={() => onLayerToggle("application")}
          />
          <label
            htmlFor="layer-application"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Application Layer (L7) - Protocols, services, applications
          </label>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryLayersForm;
