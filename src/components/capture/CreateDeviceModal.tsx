
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createCaptureDevice, updateCaptureDevice } from "@/lib/db/capture";
import { toast } from "@/hooks/use-toast";
import { CaptureDevice, CredentialSet } from "@/lib/db/types";
import BasicConfigForm from "./device-modal/BasicConfigForm";
import CiscoConfigForm from "./device-modal/CiscoConfigForm";
import AdvancedConfigForm from "./device-modal/AdvancedConfigForm";
import { useDeviceForm } from "./device-modal/useDeviceForm";

export interface CreateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceCreated: () => void;
  credentials: Record<string, CredentialSet>;
  vendors: Record<string, { enabled: boolean }>;
  defaultVendor?: string;
  editDeviceName?: string | null;
  devices?: CaptureDevice[];
}

const CreateDeviceModal: React.FC<CreateDeviceModalProps> = ({
  isOpen,
  onClose,
  onDeviceCreated,
  credentials,
  vendors,
  defaultVendor,
  editDeviceName,
  devices = [],
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  
  const {
    // Basic config
    name, setName,
    vendor, setVendor,
    ip, setIp,
    port, setPort,
    protocol, setProtocol,
    credentialSet, setCredentialSet,
    returnPathCredentialSet, setReturnPathCredentialSet,
    captureFilter, setCaptureFilter,
    
    // Cisco config
    username, setUsername,
    password, setPassword,
    certificate, setCertificate,
    enableRequired, setEnableRequired,
    enablePassword, setEnablePassword,
    autoDiscovery, setAutoDiscovery,
    
    // Advanced config
    rawScada, setRawScada,
    scadaProtocols, setScadaProtocols,
    interfaces, setInterfaces,
  } = useDeviceForm(editDeviceName, devices);

  // Set default vendor when modal opens
  React.useEffect(() => {
    if (defaultVendor && !editDeviceName) {
      setVendor(defaultVendor);
    }
  }, [defaultVendor, editDeviceName, setVendor]);

  const handleSubmit = async () => {
    try {
      // Prepare the advanced configuration data
      const advancedConfig = {
        raw_scada: rawScada ? "True" : "False",
        scada_protocols: scadaProtocols.split(",").map(p => p.trim()),
        interfaces: interfaces.split(",").map(i => i.trim())
      };
      
      // Prepare the device data
      const deviceData = {
        name,
        vendor,
        ip,
        port: parseInt(port, 10),
        protocol,
        credential_set: credentialSet,
        return_path_credential_set: returnPathCredentialSet,
        capture_filter: captureFilter,
        enabled: true,
        config: {
          username,
          password,
          certificate: certificate || undefined,
          enable_required: enableRequired,
          enable_password: enablePassword || undefined,
          auto_discovery: autoDiscovery,
          advanced: advancedConfig
        }
      };

      // If editing, update the device; otherwise, create a new device
      if (editDeviceName) {
        await updateCaptureDevice(deviceData);
        toast({
          title: "Device updated successfully",
          description: `${name} has been updated.`,
        });
      } else {
        await createCaptureDevice(deviceData);
        toast({
          title: "Device created successfully",
          description: `${name} has been deployed.`,
        });
      }

      onDeviceCreated();
      onClose();
    } catch (error) {
      toast({
        title: "Error deploying device",
        description: "Failed to configure the capture device. Please check the settings and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editDeviceName ? "Edit Device" : "Deploy New Device"}</DialogTitle>
          <DialogDescription>
            {editDeviceName
              ? "Update the configuration for the selected capture device."
              : "Configure the settings for the new capture device."}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Settings</TabsTrigger>
            <TabsTrigger value="cisco">Cisco Configuration</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <BasicConfigForm
              name={name}
              setName={setName}
              vendor={vendor}
              setVendor={setVendor}
              ip={ip}
              setIp={setIp}
              port={port}
              setPort={setPort}
              protocol={protocol}
              setProtocol={setProtocol}
              credentialSet={credentialSet}
              setCredentialSet={setCredentialSet}
              returnPathCredentialSet={returnPathCredentialSet}
              setReturnPathCredentialSet={setReturnPathCredentialSet}
              credentials={credentials}
              vendors={vendors}
            />
          </TabsContent>
          
          <TabsContent value="cisco" className="space-y-4">
            <CiscoConfigForm
              username={username}
              setUsername={setUsername}
              password={password}
              setPassword={setPassword}
              certificate={certificate}
              setCertificate={setCertificate}
              enableRequired={enableRequired}
              setEnableRequired={setEnableRequired}
              enablePassword={enablePassword}
              setEnablePassword={setEnablePassword}
              autoDiscovery={autoDiscovery}
              setAutoDiscovery={setAutoDiscovery}
            />
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <AdvancedConfigForm
              captureFilter={captureFilter}
              setCaptureFilter={setCaptureFilter}
              rawScada={rawScada}
              setRawScada={setRawScada}
              scadaProtocols={scadaProtocols}
              setScadaProtocols={setScadaProtocols}
              interfaces={interfaces}
              setInterfaces={setInterfaces}
            />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            {editDeviceName ? "Update Device" : "Deploy Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeviceModal;
