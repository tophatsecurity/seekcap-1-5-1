
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface AdvancedConfigFormProps {
  captureFilter: string;
  setCaptureFilter: (value: string) => void;
  rawScada: boolean;
  setRawScada: (value: boolean) => void;
  scadaProtocols: string;
  setScadaProtocols: (value: string) => void;
  interfaces: string;
  setInterfaces: (value: string) => void;
}

const AdvancedConfigForm: React.FC<AdvancedConfigFormProps> = ({
  captureFilter,
  setCaptureFilter,
  rawScada,
  setRawScada,
  scadaProtocols,
  setScadaProtocols,
  interfaces,
  setInterfaces,
}) => {
  return (
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
  );
};

export default AdvancedConfigForm;
