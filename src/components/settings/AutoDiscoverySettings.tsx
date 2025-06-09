
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AutoDiscoverySettings as AutoDiscoverySettingsType } from "@/lib/db/types";
import { updateAutoDiscoverySettings, startAutoDiscovery } from "@/lib/db/capture";
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Network, Loader2 } from "lucide-react";
import BasicSettingsForm from "./auto-discovery/BasicSettingsForm";
import DiscoveryLayersForm from "./auto-discovery/DiscoveryLayersForm";
import DiscoveryProtocolsForm from "./auto-discovery/DiscoveryProtocolsForm";
import PortScanForm from "./auto-discovery/PortScanForm";
import CredentialsForm from "./auto-discovery/CredentialsForm";

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

  const handleSettingsChange = (updates: Partial<AutoDiscoverySettingsType>) => {
    setFormSettings(prev => ({ ...prev, ...updates }));
  };

  const handleLayerToggle = (layer: string) => {
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

  const handleProtocolToggle = (protocol: string, checked: boolean) => {
    setFormSettings({
      ...formSettings,
      discovery_protocols: { ...formSettings.discovery_protocols, [protocol]: checked }
    });
  };

  const handleCredentialToggle = (credential: string) => {
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
        <BasicSettingsForm 
          settings={formSettings}
          onSettingsChange={handleSettingsChange}
        />

        <Separator />

        <DiscoveryLayersForm
          settings={formSettings}
          onLayerToggle={handleLayerToggle}
        />

        <DiscoveryProtocolsForm
          settings={formSettings}
          onProtocolToggle={handleProtocolToggle}
        />

        <PortScanForm
          settings={formSettings}
          onSettingsChange={handleSettingsChange}
        />

        <CredentialsForm
          credentialSets={credentialSets}
          selectedCredentials={selectedCredentials}
          onCredentialToggle={handleCredentialToggle}
        />
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
            "Start Passive Gather Now"
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
