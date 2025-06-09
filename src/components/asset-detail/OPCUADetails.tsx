
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Server, Shield, Database } from 'lucide-react';

interface OPCUADetailsProps {
  protocolData: any;
}

export const OPCUADetails: React.FC<OPCUADetailsProps> = ({ protocolData }) => (
  <div className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Server className="h-4 w-4" />
          Server Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Server URI</label>
            <p className="font-mono text-sm break-all bg-muted p-2 rounded">
              {protocolData.server_uri || protocolData.opcua_uri || 'opc.tcp://192.168.1.100:4840'}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Session Status</label>
              <Badge variant="outline" className="text-green-600">
                {protocolData.session_status || 'Active'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Endpoint Count</label>
              <p className="text-sm">
                {protocolData.endpoint_count || '2'}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Namespace Count</label>
              <p className="text-sm">
                {protocolData.namespace_count || protocolData.opcua_namespaces || '2'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4" />
          Security Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Security Policy</label>
            <Badge variant="outline">
              {protocolData.security_policy || protocolData.opcua_security || 'None'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Authentication Mode</label>
            <Badge variant="secondary">
              {protocolData.authentication_mode || 'Anonymous'}
            </Badge>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Certificate Status</label>
            <Badge variant="outline" className="text-green-600">
              {protocolData.certificate_status || 'Valid'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Database className="h-4 w-4" />
          Subscriptions & Monitoring
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Active Subscriptions</label>
            <p className="text-sm font-semibold">
              {protocolData.subscription_count || protocolData.opcua_subscriptions || '3'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Monitored Items</label>
            <p className="text-sm font-semibold">
              {protocolData.monitored_items || protocolData.opcua_items || '45'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);
