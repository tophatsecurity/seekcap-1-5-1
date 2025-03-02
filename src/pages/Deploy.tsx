
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ServerOff, Router, Database, Shield } from "lucide-react";
import { fetchCaptureSettings, createCaptureDevice } from "@/lib/db/capture";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
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

  const deviceTypes = [
    {
      id: "router",
      name: "Router/Switch",
      description: "Deploy to network routing equipment",
      icon: <Router className="h-12 w-12 text-blue-500" />,
      defaultVendor: "Cisco"
    },
    {
      id: "server",
      name: "Server/VM",
      description: "Deploy to physical or virtual servers",
      icon: <Database className="h-12 w-12 text-purple-500" />,
      defaultVendor: "VMware"
    },
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

      <Tabs defaultValue="device-type" className="w-full">
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="device-type">Device Type</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="device-type" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {deviceTypes.map((type) => (
              <Card 
                key={type.id} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleCardClick(type.id)}
              >
                <CardHeader className="flex flex-row items-center justify-center pt-6">
                  {type.icon}
                </CardHeader>
                <CardContent className="text-center">
                  <h3 className="text-lg font-semibold">{type.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                </CardContent>
                <CardFooter className="flex justify-center pb-6">
                  <Button variant="outline">Select</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 bg-muted/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Deployment Guide</h3>
            <p className="text-muted-foreground">
              Select a device type above to begin the deployment process. 
              You'll need the following information ready:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground">
              <li>Device name and IP address</li>
              <li>Connection credentials (username, password, etc.)</li>
              <li>Access protocol (SSH, Telnet, etc.)</li>
              <li>Optional: capture filters if needed</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Deployment</CardTitle>
              <CardDescription>Configure additional deployment options</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Advanced deployment allows you to specify additional parameters and customize
                the deployment process. Use the button below to open the advanced configuration
                dialog.
              </p>
              <Button onClick={() => {
                setSelectedDeviceType('advanced');
                setIsCreateModalOpen(true);
              }}>
                Advanced Configuration
              </Button>
            </CardContent>
          </Card>
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
            deviceTypes.find(t => t.id === selectedDeviceType)?.defaultVendor : undefined}
        />
      )}
    </div>
  );
};

export default Deploy;
