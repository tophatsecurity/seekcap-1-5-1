
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AutoDiscoverySettings } from "@/lib/db/types";

interface PortScanFormProps {
  settings: AutoDiscoverySettings;
  onSettingsChange: (updates: Partial<AutoDiscoverySettings>) => void;
}

const PortScanForm: React.FC<PortScanFormProps> = ({
  settings,
  onSettingsChange,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="port-scan">Port Passive Gather</Label>
        <Switch
          id="port-scan"
          checked={settings.port_scan_enabled}
          onCheckedChange={(checked) => onSettingsChange({ port_scan_enabled: checked })}
        />
      </div>
      {settings.port_scan_enabled && (
        <Input
          id="port-scan-ports"
          placeholder="22, 23, 80, 443, 502, 1883, 8080"
          value={settings.port_scan_ports?.join(", ") || ""}
          onChange={(e) => onSettingsChange({
            port_scan_ports: e.target.value.split(",").map(p => parseInt(p.trim())).filter(p => !isNaN(p))
          })}
          className="mt-2"
        />
      )}
    </div>
  );
};

export default PortScanForm;
