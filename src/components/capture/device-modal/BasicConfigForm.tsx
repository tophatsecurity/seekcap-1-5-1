
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CredentialSet } from "@/lib/db/types";

interface BasicConfigFormProps {
  name: string;
  setName: (value: string) => void;
  vendor: string;
  setVendor: (value: string) => void;
  ip: string;
  setIp: (value: string) => void;
  port: string;
  setPort: (value: string) => void;
  protocol: string;
  setProtocol: (value: string) => void;
  credentialSet: string;
  setCredentialSet: (value: string) => void;
  returnPathCredentialSet: string;
  setReturnPathCredentialSet: (value: string) => void;
  credentials: Record<string, CredentialSet>;
  vendors: Record<string, { enabled: boolean }>;
}

const BasicConfigForm: React.FC<BasicConfigFormProps> = ({
  name,
  setName,
  vendor,
  setVendor,
  ip,
  setIp,
  port,
  setPort,
  protocol,
  setProtocol,
  credentialSet,
  setCredentialSet,
  returnPathCredentialSet,
  setReturnPathCredentialSet,
  credentials,
  vendors,
}) => {
  return (
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
  );
};

export default BasicConfigForm;
