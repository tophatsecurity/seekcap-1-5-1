
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Router, 
  Database, 
  Shield, 
  ServerOff, 
  Network, 
  Cpu, 
  Lock, 
  Terminal 
} from "lucide-react";
import { fetchCaptureSettings, createCaptureDevice } from "@/lib/db/capture";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CreateDeviceModal from "@/components/capture/CreateDeviceModal";

const Deploy = () => {
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);
  
  const { data: captureSettings, isLoading, error } = useQuery({
    queryKey: ["captureSettings"],
    queryFn: fetchCaptureSettings,
  });

  const handleDeviceCreated = () => {
    toast({
      title: "Device deployed successfully",
      description: "The new capture device has been configured.",
    });
    navigate("/capture");
  };

  const handleCardClick = (deviceType: string) => {
    setSelectedDeviceType(deviceType);
    setIsCreateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading capture settings...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the configuration.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading capture settings</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate("/capture")}
          >
            Back to Capture
          </Button>
        </div>
      </div>
    );
  }

  const networkDevices = [
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

  const serverDevices = [
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
  
  const securityDevices = [
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/capture")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Deploy New Device</h2>
          <p className="text-muted-foreground">
            Configure and deploy a new capture connector
          </p>
        </div>
      </div>

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
                <Card 
                  key={device.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleCardClick(device.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    {device.icon}
                    <div>
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>{device.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Default vendor: {device.defaultVendor}</p>
                      <p>Supported protocols: SSH, Telnet</p>
                      <p>Typical port: 22 (SSH), 23 (Telnet)</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Deploy {device.name}</Button>
                  </CardFooter>
                </Card>
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
                <Card 
                  key={device.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleCardClick(device.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    {device.icon}
                    <div>
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>{device.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Default vendor: {device.defaultVendor}</p>
                      <p>Supported protocols: SSH, SNMP</p>
                      <p>Typical port: 22 (SSH), 161 (SNMP)</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Deploy {device.name}</Button>
                  </CardFooter>
                </Card>
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
                <Card 
                  key={device.id} 
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleCardClick(device.id)}
                >
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    {device.icon}
                    <div>
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>{device.description}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      <p>Default vendor: {device.defaultVendor}</p>
                      <p>Supported protocols: SSH, HTTPS API</p>
                      <p>Typical port: 22 (SSH), 443 (HTTPS)</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Deploy {device.name}</Button>
                  </CardFooter>
                </Card>
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
          <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Authentication Settings</h3>
            <p className="text-muted-foreground">
              Configure authentication methods for network device access.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Terminal className="h-8 w-8 text-blue-500" />
                  <div>
                    <CardTitle>SSH Authentication</CardTitle>
                    <CardDescription>Secure Shell access configuration</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ssh-username">Username Template</Label>
                    <Input 
                      id="ssh-username" 
                      placeholder="admin"
                      defaultValue={captureSettings?.credentials?.ssh?.user || ""} 
                    />
                    <p className="text-xs text-muted-foreground">
                      Default username used for SSH connections
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ssh-key">SSH Key Authentication</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="ssh-key" 
                        placeholder="Path to SSH key file"
                        className="flex-1"
                      />
                      <Button variant="outline">Browse</Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Optional: Use SSH key instead of password
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="ssh-port">Default SSH Port</Label>
                    <Input 
                      id="ssh-port" 
                      type="number"
                      placeholder="22"
                      defaultValue="22"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save SSH Settings</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Lock className="h-8 w-8 text-amber-500" />
                  <div>
                    <CardTitle>Telnet Authentication</CardTitle>
                    <CardDescription>Legacy Telnet access configuration</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="telnet-username">Username Template</Label>
                    <Input 
                      id="telnet-username" 
                      placeholder="admin"
                      defaultValue={captureSettings?.credentials?.telnet?.user || ""} 
                    />
                    <p className="text-xs text-muted-foreground">
                      Default username used for Telnet connections
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="enable-password">Enable Password</Label>
                    <Input 
                      id="enable-password" 
                      type="password"
                      placeholder="Enable password for privileged mode"
                    />
                    <p className="text-xs text-muted-foreground">
                      Used for entering privileged mode on network devices
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telnet-port">Default Telnet Port</Label>
                    <Input 
                      id="telnet-port" 
                      type="number"
                      placeholder="23"
                      defaultValue="23"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Save Telnet Settings</Button>
                </CardFooter>
              </Card>
            </div>
            
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Authentication Security Notice</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 p-4 rounded-md border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold mb-2">Security Recommendations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Use SSH instead of Telnet whenever possible for secure communications</li>
                    <li>Create dedicated user accounts with appropriate permissions for capture operations</li>
                    <li>Use key-based authentication instead of passwords when supported</li>
                    <li>Rotate credentials regularly according to your security policy</li>
                    <li>Consider using a dedicated management network for device access</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {captureSettings && (
        <CreateDeviceModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onDeviceCreated={handleDeviceCreated}
          credentials={captureSettings.credentials || {}}
          vendors={captureSettings.vendors || {}}
          defaultVendor={selectedDeviceType ? 
            [...networkDevices, ...serverDevices, ...securityDevices].find(
              d => d.id === selectedDeviceType
            )?.defaultVendor : undefined}
        />
      )}
    </div>
  );
};

export default Deploy;
