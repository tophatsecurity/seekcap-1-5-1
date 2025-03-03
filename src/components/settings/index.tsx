
import React, { useState, useEffect } from "react";
import { fetchCaptureSettings } from "@/lib/db/capture";
import { CaptureSettings } from "@/lib/db/types";
import AutoDiscoverySettings from "./AutoDiscoverySettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Cog, Database, Server } from "lucide-react";

const SettingsPage: React.FC = () => {
  const [captureSettings, setCaptureSettings] = useState<CaptureSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("discovery");

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings = await fetchCaptureSettings();
      setCaptureSettings(settings);
    } catch (error) {
      console.error("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSettingsUpdated = () => {
    loadSettings();
  };

  const credentialSets = captureSettings ? Object.keys(captureSettings.credentials || {}) : [];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">System Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-[500px]">
          <TabsTrigger value="discovery" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Auto Discovery
          </TabsTrigger>
          <TabsTrigger value="capture" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Capture
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Cog className="h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discovery" className="space-y-4 mt-4">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-center items-center h-40">
                  <p>Loading settings...</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <AutoDiscoverySettings 
              settings={captureSettings?.auto_discovery} 
              credentialSets={credentialSets}
              onSettingsUpdated={handleSettingsUpdated}
            />
          )}
        </TabsContent>
        
        <TabsContent value="capture" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Capture Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Capture settings will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cog className="h-5 w-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">System settings will be available here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
