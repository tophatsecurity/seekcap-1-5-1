
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PortsTabContentProps {
  tcpPorts: number[];
  udpPorts: number[];
}

export const PortsTabContent: React.FC<PortsTabContentProps> = ({
  tcpPorts,
  udpPorts
}) => (
  <>
    <Card>
      <CardHeader>
        <CardTitle>TCP Ports</CardTitle>
        <CardDescription>Open TCP ports on this device</CardDescription>
      </CardHeader>
      <CardContent>
        {tcpPorts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {tcpPorts.map((port: number) => (
              <Badge key={port} variant="outline">
                {port}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No TCP ports detected</p>
        )}
      </CardContent>
    </Card>
    
    <Card>
      <CardHeader>
        <CardTitle>UDP Ports</CardTitle>
        <CardDescription>Open UDP ports on this device</CardDescription>
      </CardHeader>
      <CardContent>
        {udpPorts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {udpPorts.map((port: number) => (
              <Badge key={port} variant="outline">
                {port}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No UDP ports detected</p>
        )}
      </CardContent>
    </Card>
  </>
);
