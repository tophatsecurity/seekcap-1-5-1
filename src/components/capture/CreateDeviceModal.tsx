
import React, { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { CaptureDevice } from "@/lib/db/types";
import { supabase } from "@/integrations/supabase/client";

interface CreateDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceCreated: () => void;
  credentials: Record<string, any>;
  vendors: Record<string, { enabled: boolean }>;
  defaultVendor?: string;
  editDeviceName?: string;
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
  devices = []
}) => {
  const [formData, setFormData] = useState<Partial<CaptureDevice>>({
    name: "",
    vendor: defaultVendor || "",
    ip: "",
    port: 22,
    protocol: "ssh",
    enabled: true,
    credential_set: "",
    return_path_credential_set: "",
    capture_filter: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load device data if in edit mode
  useEffect(() => {
    if (editDeviceName && devices) {
      const deviceToEdit = devices.find(device => device.name === editDeviceName);
      if (deviceToEdit) {
        setFormData(deviceToEdit);
      }
    }
  }, [editDeviceName, devices]);
  
  // Update vendor when defaultVendor changes
  useEffect(() => {
    if (defaultVendor && !editDeviceName) {
      setFormData(prev => ({ ...prev, vendor: defaultVendor }));
    }
  }, [defaultVendor, editDeviceName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ip || !formData.vendor || !formData.credential_set) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If editing, update the device
      if (editDeviceName) {
        const { error } = await supabase
          .from('capture_devices')
          .update({
            name: formData.name,
            vendor: formData.vendor,
            ip: formData.ip,
            port: formData.port,
            protocol: formData.protocol,
            enabled: formData.enabled,
            credential_set: formData.credential_set,
            return_path_credential_set: formData.return_path_credential_set || formData.credential_set,
            capture_filter: formData.capture_filter
          })
          .eq('name', editDeviceName);
          
        if (error) throw error;
        
        toast({
          title: "Device Updated",
          description: `${formData.name} has been updated successfully`,
        });
      } else {
        // If creating new, insert the device
        const { error } = await supabase
          .from('capture_devices')
          .insert({
            name: formData.name,
            vendor: formData.vendor,
            ip: formData.ip,
            port: formData.port,
            protocol: formData.protocol,
            enabled: formData.enabled,
            credential_set: formData.credential_set,
            return_path_credential_set: formData.return_path_credential_set || formData.credential_set,
            capture_filter: formData.capture_filter
          });
          
        if (error) throw error;
        
        toast({
          title: "Device Created",
          description: `${formData.name} has been added successfully`,
        });
      }
      
      onDeviceCreated();
      onClose();
    } catch (error) {
      console.error("Error saving device:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save device",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const vendorOptions = Object.entries(vendors || {})
    .filter(([_, value]) => value.enabled)
    .map(([key]) => key);

  const credentialOptions = Object.keys(credentials || {});

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editDeviceName ? 'Edit Capture Device' : 'Add New Capture Device'}</DialogTitle>
            <DialogDescription>
              {editDeviceName ? 'Update the configuration for this device' : 'Configure a new device for network capture'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="vendor" className="text-right">
                Vendor*
              </Label>
              <Select
                value={formData.vendor}
                onValueChange={(value) => handleSelectChange("vendor", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendorOptions.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.vendor === "custom" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="custom_vendor" className="text-right">
                  Custom Vendor
                </Label>
                <Input
                  id="custom_vendor"
                  name="vendor"
                  value={formData.vendor === "custom" ? "" : formData.vendor}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Enter vendor name"
                />
              </div>
            )}
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ip" className="text-right">
                IP Address*
              </Label>
              <Input
                id="ip"
                name="ip"
                value={formData.ip}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="port" className="text-right">
                Port
              </Label>
              <Input
                id="port"
                name="port"
                type="number"
                value={formData.port}
                onChange={handleNumberChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protocol" className="text-right">
                Protocol
              </Label>
              <Select
                value={formData.protocol}
                onValueChange={(value) => handleSelectChange("protocol", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select protocol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssh">SSH</SelectItem>
                  <SelectItem value="telnet">Telnet</SelectItem>
                  <SelectItem value="serial">Serial</SelectItem>
                  <SelectItem value="snmp">SNMP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="credential_set" className="text-right">
                Credentials*
              </Label>
              <Select
                value={formData.credential_set}
                onValueChange={(value) => handleSelectChange("credential_set", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select credential set" />
                </SelectTrigger>
                <SelectContent>
                  {credentialOptions.map((cred) => (
                    <SelectItem key={cred} value={cred}>
                      {cred}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="return_path_credential_set" className="text-right">
                Return Path
              </Label>
              <Select
                value={formData.return_path_credential_set}
                onValueChange={(value) => handleSelectChange("return_path_credential_set", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Same as credentials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Same as credentials</SelectItem>
                  {credentialOptions.map((cred) => (
                    <SelectItem key={cred} value={cred}>
                      {cred}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capture_filter" className="text-right">
                Capture Filter
              </Label>
              <Input
                id="capture_filter"
                name="capture_filter"
                value={formData.capture_filter || ""}
                onChange={handleChange}
                className="col-span-3"
                placeholder="e.g. port 80 or host 192.168.1.1"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (editDeviceName ? "Updating..." : "Creating...") : (editDeviceName ? "Update Device" : "Create Device")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeviceModal;
