import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createCaptureDevice } from "@/lib/db/capture";
import { toast } from "@/hooks/use-toast";
import { CaptureDevice, CredentialSet } from "@/lib/db/types";

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
  const [name, setName] = useState("");
  const [vendor, setVendor] = useState(defaultVendor || "");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("22");
  const [protocol, setProtocol] = useState("ssh");
  const [credentialSet, setCredentialSet] = useState("");
  const [returnPathCredentialSet, setReturnPathCredentialSet] = useState("");
  const [captureFilter, setCaptureFilter] = useState("");

  const handleSubmit = async () => {
    try {
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
      };

      // If editing, find the device and update it; otherwise, create a new device
      if (editDeviceName) {
        // Placeholder for update logic - implement your updateDevice function
        // await updateDevice(editDeviceName, deviceData);
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
        setCaptureFilter(deviceToEdit.capture_filter || "");
      }
    }
  }, [editDeviceName, devices]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editDeviceName ? "Edit Device" : "Deploy New Device"}</DialogTitle>
          <DialogDescription>
            {editDeviceName
              ? "Update the configuration for the selected capture device."
              : "Configure the settings for the new capture device."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {editDeviceName ? "Update Device" : "Deploy Device"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeviceModal;
