
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createCaptureDevice, updateCaptureDevice } from "@/lib/db/capture";
import { toast } from "@/hooks/use-toast";
import { CaptureDevice, CredentialSet } from "@/lib/db/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const DEFAULT_CAPTURE_FILTER = "not host 127.0.0.1";
const DEFAULT_SCADA_PROTOCOLS = [
  "s7comm", "modbus", "dnp3", "iec61850", "bacnet", "mqtt", 
  "profinet", "ethernetip", "mms", "goose", "sv", "opcda", 
  "ffhse", "ethernetpowerlink", "opcua", "hartip", "coap", 
  "omronfins", "opensafety", "egd", "sinch1", "ethercat", 
  "sercosiii", "rtps", "tteethernet", "cdt", "cip", 
  "cipsafety", "devicenet", "knxnetip", "lontalk", 
  "canopen", "saej1939", "usittdmx512a", "bssapbsap", 
  "gryphon", "zigbee"
];

const DEFAULT_INTERFACES = [
  "lo", "enp0s31f6", "wlp2s0", "enp0s20f0u7u1"
];

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
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState(defaultVendor || "");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("22");
  const [protocol, setProtocol] = useState("ssh");
  const [credentialSet, setCredentialSet] = useState("");
  const [returnPathCredentialSet, setReturnPathCredentialSet] = useState("");
  const [captureFilter, setCaptureFilter] = useState(DEFAULT_CAPTURE_FILTER);
  
  // New form fields for Cisco configuration
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [certificate, setCertificate] = useState("");
  const [enableRequired, setEnableRequired] = useState(true);
  const [enablePassword, setEnablePassword] = useState("");
  const [autoDiscovery, setAutoDiscovery] = useState(true);
  const [rawScada, setRawScada] = useState(true);
  const [scadaProtocols, setScadaProtocols] = useState<string>(DEFAULT_SCADA_PROTOCOLS.join(", "));
  const [interfaces, setInterfaces] = useState<string>(DEFAULT_INTERFACES.join(", "));
  const [activeTab, setActiveTab] = useState("basic");

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

  // Find device if in edit mode
  useEffect(() => {
    if (editDeviceName && devices) {
      const deviceToEdit = devices.find(device => device.name === editDeviceName);
      if (deviceToEdit) {
        setName(deviceToEdit.name);
        setVendor(deviceToEdit.vendor);
        setIp(deviceToEdit.ip);
        setPort(deviceToEdit.port.toString());
        setProtocol(deviceToEdit.protocol);
        setCredentialSet(deviceToEdit.credential_set);
        setReturnPathCredentialSet(deviceToEdit.return_path_credential_set);
        setCaptureFilter(deviceToEdit.capture_filter || DEFAULT_CAPTURE_FILTER);
        
        // Set Cisco configuration fields if available in the device data
        if (deviceToEdit.config) {
          setUsername(deviceToEdit.config.username || "");
          setPassword(deviceToEdit.config.password || "");
          setCertificate(deviceToEdit.config.certificate || "");
          setEnableRequired(deviceToEdit.config.enable_required !== undefined 
            ? deviceToEdit.config.enable_required : true);
          setEnablePassword(deviceToEdit.config.enable_password || "");
          setAutoDiscovery(deviceToEdit.config.auto_discovery !== undefined 
            ? deviceToEdit.config.auto_discovery : true);
          
          if (deviceToEdit.config.advanced) {
            setRawScada(deviceToEdit.config.advanced.raw_scada === "True");
            
            if (Array.isArray(deviceToEdit.config.advanced.scada_protocols)) {
              setScadaProtocols(deviceToEdit.config.advanced.scada_protocols.join(", "));
            }
            
            if (Array.isArray(deviceToEdit.config.advanced.interfaces)) {
              setInterfaces(deviceToEdit.config.advanced.interfaces.join(", "));
            }
          }
        }
      }
    }
  }, [editDeviceName, devices]);

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
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Device Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="vendor" className="text-right">
                  Vendor
                </Label>
                <Select value={vendor} onValueChange={setVendor}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(vendors).map((key) => (
                      <SelectItem key={key} value={key} disabled={!vendors[key].enabled}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ip" className="text-right">
                  IP Address
                </Label>
                <Input
                  id="ip"
                  value={ip}
                  onChange={(e) => setIp(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="port" className="text-right">
                  Port
                </Label>
                <Input
                  id="port"
                  type="number"
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="protocol" className="text-right">
                  Protocol
                </Label>
                <Select value={protocol} onValueChange={setProtocol}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ssh">SSH</SelectItem>
                    <SelectItem value="telnet">Telnet</SelectItem>
                    <SelectItem value="snmp">SNMP</SelectItem>
                    <SelectItem value="https">HTTPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="credentialSet" className="text-right">
                  Credential Set
                </Label>
                <Select value={credentialSet} onValueChange={setCredentialSet}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a credential set" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(credentials).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="returnPathCredentialSet" className="text-right">
                  Return Path Credential Set
                </Label>
                <Select value={returnPathCredentialSet} onValueChange={setReturnPathCredentialSet}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a return path credential set" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(credentials).map((key) => (
                      <SelectItem key={key} value={key}>
                        {key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cisco" className="space-y-4">
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="certificate" className="text-right">
                  Certificate (Optional)
                </Label>
                <Input
                  id="certificate"
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  className="col-span-3"
                  placeholder="Path to certificate file"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="enableRequired" className="text-right">
                  Enable Mode Required
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="enableRequired" 
                    checked={enableRequired} 
                    onCheckedChange={setEnableRequired} 
                  />
                  <Label htmlFor="enableRequired" className="cursor-pointer">
                    {enableRequired ? "Yes" : "No"}
                  </Label>
                </div>
              </div>
              {enableRequired && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="enablePassword" className="text-right">
                    Enable Password
                  </Label>
                  <Input
                    id="enablePassword"
                    type="password"
                    value={enablePassword}
                    onChange={(e) => setEnablePassword(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="autoDiscovery" className="text-right">
                  Auto Discovery
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="autoDiscovery" 
                    checked={autoDiscovery} 
                    onCheckedChange={setAutoDiscovery} 
                  />
                  <Label htmlFor="autoDiscovery" className="cursor-pointer">
                    {autoDiscovery ? "On" : "Off"}
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-4">
            <div className="grid gap-4 py-2">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="captureFilter" className="text-right">
                  Capture Filter
                </Label>
                <Input
                  id="captureFilter"
                  value={captureFilter}
                  onChange={(e) => setCaptureFilter(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="rawScada" className="text-right">
                  Raw SCADA
                </Label>
                <div className="flex items-center space-x-2 col-span-3">
                  <Switch 
                    id="rawScada" 
                    checked={rawScada} 
                    onCheckedChange={setRawScada} 
                  />
                  <Label htmlFor="rawScada" className="cursor-pointer">
                    {rawScada ? "True" : "False"}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="scadaProtocols" className="text-right pt-2">
                  SCADA Protocols
                </Label>
                <Textarea
                  id="scadaProtocols"
                  value={scadaProtocols}
                  onChange={(e) => setScadaProtocols(e.target.value)}
                  className="col-span-3 min-h-[100px]"
                  placeholder="Comma-separated list of SCADA protocols"
                />
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="interfaces" className="text-right pt-2">
                  Interfaces
                </Label>
                <Textarea
                  id="interfaces"
                  value={interfaces}
                  onChange={(e) => setInterfaces(e.target.value)}
                  className="col-span-3"
                  placeholder="Comma-separated list of network interfaces"
                />
              </div>
            </div>
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
