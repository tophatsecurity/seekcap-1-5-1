
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { AutoDiscoverySettings } from "@/lib/db/types";

interface DiscoveryProtocolsFormProps {
  settings: AutoDiscoverySettings;
  onProtocolToggle: (protocol: string, checked: boolean) => void;
}

const DiscoveryProtocolsForm: React.FC<DiscoveryProtocolsFormProps> = ({
  settings,
  onProtocolToggle,
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Discovery Protocols</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="proto-cdp"
            checked={settings.discovery_protocols.cdp}
            onCheckedChange={(checked) => onProtocolToggle('cdp', !!checked)}
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
            checked={settings.discovery_protocols.lldp}
            onCheckedChange={(checked) => onProtocolToggle('lldp', !!checked)}
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
            checked={settings.discovery_protocols.arp}
            onCheckedChange={(checked) => onProtocolToggle('arp', !!checked)}
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
            checked={settings.discovery_protocols.snmp}
            onCheckedChange={(checked) => onProtocolToggle('snmp', !!checked)}
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
            checked={settings.discovery_protocols.netbios}
            onCheckedChange={(checked) => onProtocolToggle('netbios', !!checked)}
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
            checked={settings.discovery_protocols.mdns}
            onCheckedChange={(checked) => onProtocolToggle('mdns', !!checked)}
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
  );
};

export default DiscoveryProtocolsForm;
