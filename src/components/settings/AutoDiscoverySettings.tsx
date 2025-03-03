
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AutoDiscoverySettings as AutoDiscoverySettingsType } from "@/lib/db/types";
import { updateAutoDiscoverySettings, startAutoDiscovery } from "@/lib/db/capture";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, Network, Layers, Loader2 } from "lucide-react";

interface AutoDiscoverySettingsProps {
  settings: AutoDiscoverySettingsType | null | undefined;
  credentialSets: string[];
  onSettingsUpdated: () => void;
}

const DEFAULT_SETTINGS: AutoDiscoverySettingsType = {
  enabled: false,
  target_layers: ["datalink", "network"],
  start_layer: "datalink",
  discovery_interval: 60,
  max_devices: 100,
  discovery_protocols: {
    cdp: true,
    lldp: true,
    arp: true,
    snmp: true,
    netbios: false,
    mdns: false
  },
  subnet_scan: true,
  subnet_scan_range: "192.168.1.0/24",
  port_scan_enabled: false,
  port_scan_ports: [22, 23, 80, 443, 502, 1883, 8080],
  credentials_to_try: []
};

const AutoDiscoverySettings: React.FC<AutoDiscoverySettingsProps> = ({
  settings,
  credentialSets,
  onSettingsUpdated
}) => {
  const [formSettings, setFormSettings] = useState<AutoDiscoverySettingsType>(
    settings || DEFAULT_SETTINGS
  );
  const [isRunning, setIsRunning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([]);

  useEffect(() => {
    if (settings) {
      setFormSettings(settings);
      setSelectedCredentials(settings.credentials_to_try || []);
    }
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update the credentials_to_try with the selected credentials
      const updatedSettings = {
        ...formSettings,
        credentials_to_try: selectedCredentials
      };

      const result = await updateAutoDiscoverySettings(updatedSettings);
      if (result.success) {
        onSettingsUpdated();
      }
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save auto discovery settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartDiscovery = async () => {
    setIsRunning(true);
    try {
      await startAutoDiscovery();
      // In a real implementation, this would start the actual discovery process
      setTimeout(() => {
        setIsRunning(false);
      }, 5000);
    } catch (error) {
      toast({
        title: "Error starting discovery",
        description: "Failed to start the auto discovery process",
        variant: "destructive",
      });
      setIsRunning(false);
    }
  };

  const toggleLayer = (layer: string) => {
    if (formSettings.target_layers.includes(layer as any)) {
      setFormSettings({
        ...formSettings,
        target_layers: formSettings.target_layers.filter(l => l !== layer)
      });
    } else {
      setFormSettings({
        ...formSettings,
        target_layers: [...formSettings.target_layers, layer as "datalink" | "network" | "transport" | "application"]
      });
    }
  };

  const toggleCredential = (credential: string) => {
    if (selectedCredentials.includes(credential)) {
      setSelectedCredentials(selectedCredentials.filter(c => c !== credential));
    } else {
      setSelectedCredentials([...selectedCredentials, credential]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Auto Discovery Settings
        </CardTitle>
        <CardDescription>
          Configure automatic discovery of network devices and their connections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="discovery-enabled">Enable Auto Discovery</Label>
            <p className="text-sm text-muted-foreground">
              When enabled, the system will automatically scan for and add new devices
            </p>
          </div>
          <Switch
            id="discovery-enabled"
            checked={formSettings.enabled}
            onCheckedChange={(checked) => setFormSettings({ ...formSettings, enabled: checked })}
          />
        </div>

        <Separator />

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Layers className="h-4 w-4" /> Discovery Layers
            </h3>
            <div className="grid gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="layer-datalink"
                  checked={formSettings.target_layers.includes("datalink")}
                  onCheckedChange={() => toggleLayer("datalink")}
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
                  checked={formSettings.target_layers.includes("network")}
                  onCheckedChange={() => toggleLayer("network")}
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
                  checked={formSettings.target_layers.includes("transport")}
                  onCheckedChange={() => toggleLayer("transport")}
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
                  checked={formSettings.target_layers.includes("application")}
                  onCheckedChange={() => toggleLayer("application")}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start-layer">Starting Layer</Label>
              <Select
                value={formSettings.start_layer}
                onValueChange={(value) => setFormSettings({ ...formSettings, start_layer: value as any })}
              >
                <SelectTrigger id="start-layer">
                  <SelectValue placeholder="Select starting layer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="datalink">Data Link Layer (L2)</SelectItem>
                  <SelectItem value="network">Network Layer (L3)</SelectItem>
                  <SelectItem value="transport">Transport Layer (L4)</SelectItem>
                  <SelectItem value="application">Application Layer (L7)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="discovery-interval">Discovery Interval (minutes)</Label>
              <Input
                id="discovery-interval"
                type="number"
                min="5"
                max="1440"
                value={formSettings.discovery_interval}
                onChange={(e) => setFormSettings({ ...formSettings, discovery_interval: parseInt(e.target.value) || 60 })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max-devices">Maximum Devices</Label>
              <Input
                id="max-devices"
                type="number"
                min="1"
                max="1000"
                value={formSettings.max_devices}
                onChange={(e) => setFormSettings({ ...formSettings, max_devices: parseInt(e.target.value) || 100 })}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="subnet-scan">Subnet Scan</Label>
                <Switch
                  id="subnet-scan"
                  checked={formSettings.subnet_scan}
                  onCheckedChange={(checked) => setFormSettings({ ...formSettings, subnet_scan: checked })}
                />
              </div>
              {formSettings.subnet_scan && (
                <Input
                  id="subnet-scan-range"
                  placeholder="192.168.1.0/24"
                  value={formSettings.subnet_scan_range || ""}
                  onChange={(e) => setFormSettings({ ...formSettings, subnet_scan_range: e.target.value })}
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Discovery Protocols</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proto-cdp"
                  checked={formSettings.discovery_protocols.cdp}
                  onCheckedChange={(checked) => setFormSettings({
                    ...formSettings,
                    discovery_protocols: { ...formSettings.discovery_protocols, cdp: !!checked }
                  })}
                />
                <label
                  htmlFor="proto-cdp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Cisco Discovery Protocol (CDP)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proto-lldp"
                  checked={formSettings.discovery_protocols.lldp}
                  onCheckedChange={(checked) => setFormSettings({
                    ...formSettings,
                    discovery_protocols: { ...formSettings.discovery_protocols, lldp: !!checked }
                  })}
                />
                <label
                  htmlFor="proto-lldp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Link Layer Discovery Protocol (LLDP)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proto-arp"
                  checked={formSettings.discovery_protocols.arp}
                  onCheckedChange={(checked) => setFormSettings({
                    ...formSettings,
                    discovery_protocols: { ...formSettings.discovery_protocols, arp: !!checked }
                  })}
                />
                <label
                  htmlFor="proto-arp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Address Resolution Protocol (ARP)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proto-snmp"
                  checked={formSettings.discovery_protocols.snmp}
                  onCheckedChange={(checked) => setFormSettings({
                    ...formSettings,
                    discovery_protocols: { ...formSettings.discovery_protocols, snmp: !!checked }
                  })}
                />
                <label
                  htmlFor="proto-snmp"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Simple Network Management Protocol (SNMP)
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proto-netbios"
                  checked={formSettings.discovery_protocols.netbios}
                  onCheckedChange={(checked) => setFormSettings({
                    ...formSettings,
                    discovery_protocols: { ...formSettings.discovery_protocols, netbios: !!checked }
                  })}
                />
                <label
                  htmlFor="proto-netbios"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  NetBIOS
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proto-mdns"
                  checked={formSettings.discovery_protocols.mdns}
                  onCheckedChange={(checked) => setFormSettings({
                    ...formSettings,
                    discovery_protocols: { ...formSettings.discovery_protocols, mdns: !!checked }
                  })}
                />
                <label
                  htmlFor="proto-mdns"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Multicast DNS (mDNS)
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="port-scan">Port Scanning</Label>
              <Switch
                id="port-scan"
                checked={formSettings.port_scan_enabled}
                onCheckedChange={(checked) => setFormSettings({ ...formSettings, port_scan_enabled: checked })}
              />
            </div>
            {formSettings.port_scan_enabled && (
              <Input
                id="port-scan-ports"
                placeholder="22, 23, 80, 443, 502, 1883, 8080"
                value={formSettings.port_scan_ports?.join(", ") || ""}
                onChange={(e) => setFormSettings({
                  ...formSettings,
                  port_scan_ports: e.target.value.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p))
                })}
                className="mt-2"
              />
            )}
          </div>

          {credentialSets.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2">Credentials to Try</h3>
              <div className="grid grid-cols-2 gap-2">
                {credentialSets.map((credential) => (
                  <div key={credential} className="flex items-center space-x-2">
                    <Checkbox
                      id={`cred-${credential}`}
                      checked={selectedCredentials.includes(credential)}
                      onCheckedChange={() => toggleCredential(credential)}
                    />
                    <label
                      htmlFor={`cred-${credential}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {credential}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleStartDiscovery}
          disabled={isRunning || !formSettings.enabled}
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Discovery Running...
            </>
          ) : (
            "Start Discovery Now"
          )}
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AutoDiscoverySettings;
