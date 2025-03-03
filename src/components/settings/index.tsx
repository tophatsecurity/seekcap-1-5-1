
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCaptureSettings } from "@/lib/db/capture";
import { useQuery } from "@tanstack/react-query";
import AutoDiscoverySettings from "./AutoDiscoverySettings";
import { FailSafeSettings } from "./FailSafeSettings";
import { AlertCircle, Settings, Activity, Shield } from "lucide-react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("auto-discovery");

  const { data: captureSettings, isLoading, error } = useQuery({
    queryKey: ["captureSettings"],
    queryFn: fetchCaptureSettings,
  });

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertCircle className="mr-2 h-5 w-5" />
              Error Loading Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Failed to load capture settings. Please try refreshing the page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage application settings and configurations
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="auto-discovery" className="flex items-center">
            <Activity className="mr-2 h-4 w-4" />
            <span>Auto Discovery</span>
          </TabsTrigger>
          <TabsTrigger value="fail-safe" className="flex items-center">
            <Shield className="mr-2 h-4 w-4" />
            <span>Fail Safe</span>
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            <span>General</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="auto-discovery">
          <AutoDiscoverySettings 
            settings={captureSettings?.auto_discovery} 
          />
        </TabsContent>
        
        <TabsContent value="fail-safe">
          <FailSafeSettings 
            settings={captureSettings?.fail_safe}
          />
        </TabsContent>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure application-wide settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-10">
                General settings will be implemented in a future update.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
