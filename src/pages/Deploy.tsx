
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchCaptureSettings } from "@/lib/db/capture";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import CreateDeviceModal from "@/components/capture/CreateDeviceModal";
import QuickActionButtons from "@/components/deploy/QuickActionButtons";
import DeviceTypeTabs from "@/components/deploy/DeviceTypeTabs";
import { useCredentialTransformation } from "@/hooks/useCredentialTransformation";
import { allDevices } from "@/components/deploy/deviceConfigurations";

const Deploy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null);
  const [editDeviceName, setEditDeviceName] = useState<string | null>(null);
  
  const { data: captureSettings, isLoading, error } = useQuery({
    queryKey: ["captureSettings"],
    queryFn: fetchCaptureSettings,
  });

  const transformedCredentials = useCredentialTransformation(captureSettings?.credentials);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editParam = searchParams.get('edit');
    if (editParam) {
      setEditDeviceName(editParam);
      setIsCreateModalOpen(true);
    }
  }, [location]);

  const handleDeviceCreated = () => {
    toast({
      title: "Device deployed successfully",
      description: "The new capture device has been configured.",
    });
    navigate("/capture");
  };

  const handleCardClick = (deviceType: string) => {
    setSelectedDeviceType(deviceType);
    setEditDeviceName(null);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate("/capture")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {editDeviceName ? `Edit Device: ${editDeviceName}` : "Deploy New Device"}
          </h2>
          <p className="text-muted-foreground">
            {editDeviceName 
              ? "Update configuration for an existing capture device" 
              : "Configure and deploy a new capture connector"}
          </p>
        </div>
      </div>

      {!editDeviceName && (
        <QuickActionButtons onDeviceClick={handleCardClick} />
      )}

      <DeviceTypeTabs 
        onDeviceClick={handleCardClick} 
        transformedCredentials={transformedCredentials}
      />

      {captureSettings && (
        <CreateDeviceModal 
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            if (editDeviceName) {
              navigate('/deploy', { replace: true });
              setEditDeviceName(null);
            }
          }}
          onDeviceCreated={handleDeviceCreated}
          credentials={transformedCredentials}
          vendors={captureSettings.vendors || {}}
          defaultVendor={selectedDeviceType ? 
            allDevices.find(d => d.id === selectedDeviceType)?.defaultVendor : undefined}
          editDeviceName={editDeviceName}
          devices={captureSettings.devices || []}
        />
      )}
    </div>
  );
};

export default Deploy;
