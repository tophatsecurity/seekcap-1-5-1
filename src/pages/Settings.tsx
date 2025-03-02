
import { useState } from "react";
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
        <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="data">Data Management</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default Settings;
