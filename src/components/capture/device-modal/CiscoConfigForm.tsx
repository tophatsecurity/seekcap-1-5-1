
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

interface CiscoConfigFormProps {
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  certificate: string;
  setCertificate: (value: string) => void;
  enableRequired: boolean;
  setEnableRequired: (value: boolean) => void;
  enablePassword: string;
  setEnablePassword: (value: string) => void;
  autoDiscovery: boolean;
  setAutoDiscovery: (value: boolean) => void;
}

const CiscoConfigForm: React.FC<CiscoConfigFormProps> = ({
  username,
  setUsername,
  password,
  setPassword,
  certificate,
  setCertificate,
  enableRequired,
  setEnableRequired,
  enablePassword,
  setEnablePassword,
  autoDiscovery,
  setAutoDiscovery,
}) => {
  return (
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
  );
};

export default CiscoConfigForm;
