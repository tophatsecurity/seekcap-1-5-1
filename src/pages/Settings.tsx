import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchCaptureSettings, CaptureDevice } from "@/lib/supabase";

const Settings = () => {
  // Scanning settings
  const [autoScan, setAutoScan] = useState(true);
  const [scanInterval, setScanInterval] = useState(30);
  const [scanDepth, setScanDepth] = useState("medium");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [notifyOnNewAsset, setNotifyOnNewAsset] = useState(true);
  
  // Data storage settings
  const [retentionPeriod, setRetentionPeriod] = useState(90);
  const [compressOldData, setCompressOldData] = useState(true);
  
  // Capture settings
  const [captureSettings, setCaptureSettings] = useState<any>(null);
  const [captureDevices, setCaptureDevices] = useState<CaptureDevice[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);

  useEffect(() => {
    const loadCaptureSettings = async () => {
      const settings = await fetchCaptureSettings();
      if (settings) {
        setCaptureSettings(settings);
        setCaptureDevices(settings.devices);
        
        // Set the first vendor as selected if we have vendors
        if (settings.vendors && Object.keys(settings.vendors).length > 0) {
          setSelectedVendor(Object.keys(settings.vendors)[0]);
        }
      }
    };
    
    loadCaptureSettings();
  }, []);
  
  const handleSaveSettings = async () => {
    try {
      // In a real app, you would save these settings to your database
      // For now, we'll just show a success message
      
      toast({
        title: "Settings saved",
        description: "Your changes have been applied successfully.",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Error saving settings",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    }
  };

  const handleClearDatabase = async () => {
    if (!confirm("Are you sure you want to clear all data? This action cannot be undone.")) {
      return;
    }
    
    try {
      // Delete all records from the tables
      await supabase.from('tcp_ports').delete().neq('id', 0);
      await supabase.from('udp_ports').delete().neq('id', 0);
      await supabase.from('ip_protocols').delete().neq('id', 0);
      await supabase.from('scada_protocols').delete().neq('id', 0);
      await supabase.from('scada_data').delete().neq('id', 0);
      await supabase.from('assets').delete().neq('mac_address', '');
      
      toast({
        title: "Database cleared",
        description: "All asset data has been removed.",
      });
      
      // Reload the page after a short delay
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      console.error("Error clearing database:", error);
      toast({
        title: "Error clearing database",
        description: "There was a problem clearing the database.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <Button onClick={handleSaveSettings}>Save Changes</Button>
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
          <TabsTrigger value="capture">Capture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="app-name">Application Name</Label>
                <Input id="app-name" value="SCADA Passive Asset Discovery" readOnly />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark mode for the application
                  </p>
                </div>
                <Switch id="dark-mode" defaultChecked />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-refresh">Auto Refresh</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically refresh data on dashboard
                  </p>
                </div>
                <Switch id="auto-refresh" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scanning" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scanning Settings</CardTitle>
              <CardDescription>Configure network scanning behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-scan">Automatic Scanning</Label>
                  <p className="text-sm text-muted-foreground">
                    Periodically scan the network for new devices
                  </p>
                </div>
                <Switch 
                  id="auto-scan" 
                  checked={autoScan}
                  onCheckedChange={setAutoScan}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scan-interval">Scan Interval (minutes)</Label>
                  <span className="text-sm">{scanInterval} min</span>
                </div>
                <Slider
                  id="scan-interval"
                  min={5}
                  max={60}
                  step={5}
                  value={[scanInterval]}
                  onValueChange={(value) => setScanInterval(value[0])}
                  disabled={!autoScan}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scan-depth">Scan Depth</Label>
                <Select 
                  value={scanDepth} 
                  onValueChange={setScanDepth}
                  disabled={!autoScan}
                >
                  <SelectTrigger id="scan-depth">
                    <SelectValue placeholder="Select scan depth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light (Faster, Less Detail)</SelectItem>
                    <SelectItem value="medium">Medium (Balanced)</SelectItem>
                    <SelectItem value="deep">Deep (Slower, More Detail)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via email
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email-address">Email Address</Label>
                <Input 
                  id="email-address" 
                  type="email" 
                  placeholder="your@email.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  disabled={!emailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="new-asset-notification">New Asset Detection</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify when a new asset is discovered
                  </p>
                </div>
                <Switch 
                  id="new-asset-notification" 
                  checked={notifyOnNewAsset}
                  onCheckedChange={setNotifyOnNewAsset}
                  disabled={!emailNotifications}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Configure data storage and retention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="retention-period">Data Retention (days)</Label>
                  <span className="text-sm">{retentionPeriod} days</span>
                </div>
                <Slider
                  id="retention-period"
                  min={30}
                  max={365}
                  step={30}
                  value={[retentionPeriod]}
                  onValueChange={(value) => setRetentionPeriod(value[0])}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compress-data">Compress Old Data</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically compress data older than 30 days
                  </p>
                </div>
                <Switch 
                  id="compress-data" 
                  checked={compressOldData}
                  onCheckedChange={setCompressOldData}
                />
              </div>
              
              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Database Operations</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" onClick={() => alert("Database backup initiated!")}>
                    Backup Database
                  </Button>
                  <Button variant="destructive" className="w-full" onClick={handleClearDatabase}>
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="capture" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Packet Capture Settings</CardTitle>
              <CardDescription>Configure network packet capture capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {captureSettings ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Server Configuration</h3>
                      <div className="space-y-2">
                        <Label htmlFor="capture-directory">Capture Directory</Label>
                        <Input 
                          id="capture-directory"
                          value={captureSettings.capture_directory}
                          readOnly
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="storage-mode">Storage Mode</Label>
                        <Input 
                          id="storage-mode"
                          value={captureSettings.storage_mode}
                          readOnly
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="storage-timeout">Storage Timeout (seconds)</Label>
                        <Input 
                          id="storage-timeout"
                          type="number"
                          value={captureSettings.storage_timeout}
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Capture Server</h3>
                      <div className="space-y-2">
                        <Label htmlFor="server-hostname">Hostname</Label>
                        <Input 
                          id="server-hostname"
                          value={captureSettings.capture_server.hostname}
                          readOnly
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="server-ip">IP Address</Label>
                        <Input 
                          id="server-ip"
                          value={captureSettings.capture_server.ip}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Capture Devices</h3>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>Protocol</TableHead>
                            <TableHead>Port</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {captureDevices.map((device) => (
                            <TableRow key={device.name}>
                              <TableCell>{device.name}</TableCell>
                              <TableCell>{device.vendor}</TableCell>
                              <TableCell>{device.ip}</TableCell>
                              <TableCell>{device.protocol}</TableCell>
                              <TableCell>{device.port}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${device.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {device.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Return Paths</h3>
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Method</TableHead>
                            <TableHead>Base Path</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(captureSettings.return_paths).map(([method, config]: [string, any]) => (
                            <TableRow key={method}>
                              <TableCell className="uppercase">{method}</TableCell>
                              <TableCell className="font-mono text-xs">{config.base_path}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs ${config.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {config.enabled ? 'Enabled' : 'Disabled'}
                                </span>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Vendor Commands</h3>
                    <div className="space-y-2">
                      <Label htmlFor="vendor-select">Select Vendor</Label>
                      <Select value={selectedVendor || ''} onValueChange={setSelectedVendor}>
                        <SelectTrigger id="vendor-select">
                          <SelectValue placeholder="Select a vendor" />
                        </SelectTrigger>
                        <SelectContent>
                          {captureSettings.vendors && Object.keys(captureSettings.vendors).map((vendor) => (
                            <SelectItem key={vendor} value={vendor}>
                              {vendor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedVendor && (
                      <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                        <div className="space-y-2">
                          <Label htmlFor="interface-command">Interface Command</Label>
                          <Input 
                            id="interface-command"
                            value={captureSettings.interface_commands[selectedVendor]}
                            readOnly
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="capture-command">Capture Command</Label>
                          <Input 
                            id="capture-command"
                            value={captureSettings.capture_commands[selectedVendor]}
                            readOnly
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="stop-command">Stop Capture Command</Label>
                          <Input 
                            id="stop-command"
                            value={captureSettings.stop_capture_commands[selectedVendor]}
                            readOnly
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tmp-directory">Temp Directory</Label>
                          <Input 
                            id="tmp-directory"
                            value={captureSettings.tmp_directories[selectedVendor]}
                            readOnly
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <p className="text-muted-foreground">No capture settings available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
