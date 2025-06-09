
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AutoDiscoverySettings } from "@/lib/db/types";

interface BasicSettingsFormProps {
  settings: AutoDiscoverySettings;
  onSettingsChange: (updates: Partial<AutoDiscoverySettings>) => void;
}

const BasicSettingsForm: React.FC<BasicSettingsFormProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="discovery-enabled">Enable Auto Discovery</Label>
          <p className="text-sm text-muted-foreground">
            When enabled, the system will automatically gather information about new devices
          </p>
        </div>
        <Switch
          id="discovery-enabled"
          checked={settings.enabled}
          onCheckedChange={(checked) => onSettingsChange({ enabled: checked })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-layer">Starting Layer</Label>
          <Select
            value={settings.start_layer}
            onValueChange={(value) => onSettingsChange({ start_layer: value as any })}
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
            value={settings.discovery_interval}
            onChange={(e) => onSettingsChange({ discovery_interval: parseInt(e.target.value) || 60 })}
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
            value={settings.max_devices}
            onChange={(e) => onSettingsChange({ max_devices: parseInt(e.target.value) || 100 })}
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="subnet-scan">Subnet Passive Gather</Label>
            <Switch
              id="subnet-scan"
              checked={settings.subnet_scan}
              onCheckedChange={(checked) => onSettingsChange({ subnet_scan: checked })}
            />
          </div>
          {settings.subnet_scan && (
            <Input
              id="subnet-scan-range"
              placeholder="192.168.1.0/24"
              value={settings.subnet_scan_range || ""}
              onChange={(e) => onSettingsChange({ subnet_scan_range: e.target.value })}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicSettingsForm;
