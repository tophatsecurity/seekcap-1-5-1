
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Upload } from "lucide-react";
import { handlePcapFileUpload } from "@/lib/utils/pcapFileUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { fetchCaptureSettings } from "@/lib/db/capture";

interface UploadPcapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function UploadPcapModal({ open, onOpenChange, onSuccess }: UploadPcapModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["captureSettings"],
    queryFn: fetchCaptureSettings,
    enabled: open
  });
  
  const devices = settings?.devices || [];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a PCAP file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const deviceIdNum = deviceId ? parseInt(deviceId) : null;
      await handlePcapFileUpload(file, deviceIdNum);
      onOpenChange(false);
      setFile(null);
      setDeviceId(null);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error uploading PCAP file:", error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload PCAP File</DialogTitle>
          <DialogDescription>
            Upload a packet capture file and associate it with a device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="pcap-file" className="mb-2 block">PCAP File</Label>
            <div className="flex items-center justify-center w-full">
              <label htmlFor="pcap-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to select</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PCAP, PCAPNG (Max 500MB)
                  </p>
                </div>
                <input 
                  id="pcap-file" 
                  type="file" 
                  className="hidden" 
                  accept=".pcap,.pcapng" 
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-500">
                Selected: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="device-select" className="mb-2 block">Associated Device (Optional)</Label>
            <Select value={deviceId || ''} onValueChange={setDeviceId}>
              <SelectTrigger id="device-select">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={String(device.id)}>
                    {device.name} ({device.vendor})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!file || isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : "Upload"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
