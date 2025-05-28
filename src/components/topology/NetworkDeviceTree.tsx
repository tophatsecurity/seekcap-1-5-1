
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronDown, 
  ChevronRight, 
  Router, 
  ToggleLeft,
  Laptop, 
  Smartphone, 
  Server, 
  Wifi,
  Monitor
} from "lucide-react";
import { Asset, NetworkDevice } from "@/lib/db/types";

interface NetworkDeviceTreeProps {
  assets: Asset[];
  networkDevices: NetworkDevice[];
  onDeviceClick?: (device: NetworkDevice | Asset) => void;
}

export function NetworkDeviceTree({ assets, networkDevices, onDeviceClick }: NetworkDeviceTreeProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['infrastructure', 'clients']));

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'router':
        return Router;
      case 'switch':
        return ToggleLeft;
      case 'access point':
      case 'wireless':
        return Wifi;
      case 'laptop':
      case 'computer':
        return Laptop;
      case 'phone':
      case 'mobile':
        return Smartphone;
      case 'server':
        return Server;
      default:
        return Monitor;
    }
  };

  const groupedDevices = {
    infrastructure: networkDevices.filter(d => 
      ['router', 'switch', 'access point', 'gateway'].includes(d.device_type?.toLowerCase() || '')
    ),
    clients: assets.filter(a => a.device_type && 
      !['router', 'switch', 'access point', 'gateway'].includes(a.device_type.toLowerCase())
    )
  };

  const clientsByType = groupedDevices.clients.reduce((acc, asset) => {
    const type = asset.device_type || 'Unknown';
    if (!acc[type]) acc[type] = [];
    acc[type].push(asset);
    return acc;
  }, {} as Record<string, Asset[]>);

  return (
    <Card className="bg-black border-blue-600 text-blue-500 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-400 text-sm">Network Devices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {/* Infrastructure */}
        <Collapsible 
          open={expandedCategories.has('infrastructure')} 
          onOpenChange={() => toggleCategory('infrastructure')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-1 h-auto text-blue-400 hover:text-blue-300">
              {expandedCategories.has('infrastructure') ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
              <Router className="h-3 w-3 mr-1" />
              Infrastructure ({groupedDevices.infrastructure.length})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-2 space-y-1">
            {groupedDevices.infrastructure.map((device) => {
              const Icon = getDeviceIcon(device.device_type);
              return (
                <div 
                  key={device.id}
                  className="flex items-center gap-1 p-1 rounded hover:bg-blue-900/20 cursor-pointer"
                  onClick={() => onDeviceClick?.(device)}
                >
                  <Icon className="h-3 w-3 text-blue-400" />
                  <span className="text-xs text-blue-300 truncate">{device.name}</span>
                  <Badge variant="secondary" className="ml-auto text-xs bg-blue-900/30 text-blue-400 border-blue-600">
                    {device.device_type}
                  </Badge>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Clients by Type */}
        <Collapsible 
          open={expandedCategories.has('clients')} 
          onOpenChange={() => toggleCategory('clients')}
        >
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-1 h-auto text-blue-400 hover:text-blue-300">
              {expandedCategories.has('clients') ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
              <Monitor className="h-3 w-3 mr-1" />
              Clients ({groupedDevices.clients.length})
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="ml-2 space-y-1">
            {Object.entries(clientsByType).map(([type, devices]) => (
              <Collapsible key={type}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start p-1 h-auto text-blue-400 hover:text-blue-300">
                    <ChevronRight className="h-3 w-3 mr-1" />
                    {type} ({devices.length})
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-4 space-y-1">
                  {devices.map((asset) => {
                    const Icon = getDeviceIcon(asset.device_type || '');
                    return (
                      <div 
                        key={asset.mac_address}
                        className="flex items-center gap-1 p-1 rounded hover:bg-blue-900/20 cursor-pointer"
                        onClick={() => onDeviceClick?.(asset)}
                      >
                        <Icon className="h-3 w-3 text-blue-400" />
                        <span className="text-xs text-blue-300 truncate">
                          {asset.name || asset.mac_address}
                        </span>
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
