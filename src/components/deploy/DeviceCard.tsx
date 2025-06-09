
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceConfig } from "./deviceConfigurations";

interface DeviceCardProps {
  device: DeviceConfig;
  onClick: (deviceType: string) => void;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors"
      onClick={() => onClick(device.id)}
    >
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        {device.icon}
        <div>
          <CardTitle>{device.name}</CardTitle>
          <CardDescription>{device.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Default vendor: {device.defaultVendor}</p>
          <p>Supported protocols: SSH, Telnet</p>
          <p>Typical port: 22 (SSH), 23 (Telnet)</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Deploy {device.name}</Button>
      </CardFooter>
    </Card>
  );
};

export default DeviceCard;
