
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
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { startPacketCapture } from "@/lib/utils/pcapFileUtils";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCaptureSettings } from "@/lib/db/capture";

interface StartCaptureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function StartCaptureModal({ open, onOpenChange, onSuccess }: StartCaptureModalProps) {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [captureFilter, setCaptureFilter] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["captureSettings"],
    queryFn: fetchCaptureSettings,
    enabled: open
  });
  
  const devices = settings?.devices.filter(d => d.enabled) || [];
  
  const handleStartCapture = async () => {
    if (!deviceId) {
      toast({
        title: "No device selected",
        description: "Please select a device to capture traffic from.",
        variant: "destructive"
      });
      return;
    }
    
    setIsStarting(true);
    
    try {
      await startPacketCapture(parseInt(deviceId), captureFilter || undefined);
      onOpenChange(false);
      setDeviceId(null);
      setCaptureFilter("");
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error starting packet capture:", error);
    } finally {
      setIsStarting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Start Packet Capture</DialogTitle>
          <DialogDescription>
            Capture network traffic from a selected device.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="device-select" className="mb-2 block">Device</Label>
            <Select value={deviceId || ''} onValueChange={setDeviceId}>
              <SelectTrigger id="device-select">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={String(device.id)}>
                    {device.name} ({device.vendor})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {devices.length === 0 && !isLoadingSettings && (
              <p className="mt-2 text-sm text-yellow-500">
                No enabled devices found. Enable devices in settings first.
              </p>
            )}
          </div>
          
          <div>
            <Label htmlFor="capture-filter" className="mb-2 block">Capture Filter (Optional)</Label>
            <Input
              id="capture-filter"
              placeholder="E.g., tcp port 80 or host 192.168.1.1"
              value={captureFilter}
              onChange={(e) => setCaptureFilter(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              BPF syntax filter to apply to the capture
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isStarting}>
            Cancel
          </Button>
          <Button onClick={handleStartCapture} disabled={!deviceId || isStarting}>
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting...
              </>
            ) : "Start Capture"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
