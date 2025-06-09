
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DeviceCard from "./DeviceCard";
import AuthenticationTab from "./AuthenticationTab";
import { networkDevices, serverDevices, securityDevices } from "./deviceConfigurations";

interface DeviceTypeTabsProps {
  onDeviceClick: (deviceType: string) => void;
  transformedCredentials: Record<string, any>;
}

const DeviceTypeTabs: React.FC<DeviceTypeTabsProps> = ({ onDeviceClick, transformedCredentials }) => {
  return (
    <Tabs defaultValue="network-devices" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="network-devices">Network Devices</TabsTrigger>
        <TabsTrigger value="server-devices">Servers</TabsTrigger>
        <TabsTrigger value="security-devices">Security</TabsTrigger>
        <TabsTrigger value="authentication">Authentication</TabsTrigger>
      </TabsList>
      
      <TabsContent value="network-devices" className="mt-6">
        <div className="grid gap-6">
          <h3 className="text-lg font-semibold">Router & Switch Configuration</h3>
          <p className="text-muted-foreground">
            Deploy capture connectors to network routing and switching equipment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {networkDevices.map((device) => (
              <DeviceCard key={device.id} device={device} onClick={onDeviceClick} />
            ))}
          </div>
          
          <div className="mt-4 bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Network Device Setup Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
              <li>Ensure the device has SSH or Telnet access enabled</li>
              <li>Configure appropriate access credentials with sufficient privileges</li>
              <li>For Cisco devices, ensure "terminal length 0" is set to prevent pagination</li>
              <li>Verify network connectivity between the capture server and the device</li>
            </ul>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="server-devices" className="mt-6">
        <div className="grid gap-6">
          <h3 className="text-lg font-semibold">Server & VM Configuration</h3>
          <p className="text-muted-foreground">
            Deploy capture connectors to servers, virtual machines, and appliances.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serverDevices.map((device) => (
              <DeviceCard key={device.id} device={device} onClick={onDeviceClick} />
            ))}
          </div>
          
          <div className="mt-4 bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Server Setup Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
              <li>For virtual machines, ensure promiscuous mode is enabled on the virtual switch</li>
              <li>For physical servers, identify the correct interface for traffic capture</li>
              <li>Install required capture tools (tcpdump, Wireshark) if not present</li>
              <li>Ensure sufficient disk space for packet capture storage</li>
            </ul>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="security-devices" className="mt-6">
        <div className="grid gap-6">
          <h3 className="text-lg font-semibold">Security Device Configuration</h3>
          <p className="text-muted-foreground">
            Deploy capture connectors to firewalls, IDS/IPS, and other security devices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityDevices.map((device) => (
              <DeviceCard key={device.id} device={device} onClick={onDeviceClick} />
            ))}
          </div>
          
          <div className="mt-4 bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Security Device Setup Notes</h4>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm">
              <li>Ensure proper security rules to allow capture traffic</li>
              <li>Configure mirror/span ports if using dedicated monitoring interfaces</li>
              <li>For Palo Alto devices, ensure the appropriate log forwarding profile</li>
              <li>Consider security implications of capturing sensitive traffic</li>
            </ul>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="authentication" className="mt-6">
        <AuthenticationTab transformedCredentials={transformedCredentials} />
      </TabsContent>
    </Tabs>
  );
};

export default DeviceTypeTabs;
