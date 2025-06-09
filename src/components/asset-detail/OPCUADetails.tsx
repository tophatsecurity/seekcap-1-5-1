
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface OPCUADetailsProps {
  protocolData: any;
}

export const OPCUADetails: React.FC<OPCUADetailsProps> = ({ protocolData }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
    <div>
      <label className="text-sm font-medium text-muted-foreground">Server URI</label>
      <p className="font-mono text-sm break-all">
        {protocolData.server_uri || protocolData.opcua_uri || 'opc.tcp://192.168.1.100:4840'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Security Policy</label>
      <p className="font-mono text-sm">
        {protocolData.security_policy || protocolData.opcua_security || 'None'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Session Status</label>
      <Badge variant="outline" className="text-green-600">
        {protocolData.session_status || 'Active'}
      </Badge>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Subscriptions</label>
      <p className="text-sm">
        {protocolData.subscription_count || protocolData.opcua_subscriptions || '3'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Monitored Items</label>
      <p className="text-sm">
        {protocolData.monitored_items || protocolData.opcua_items || '45'}
      </p>
    </div>
    <div>
      <label className="text-sm font-medium text-muted-foreground">Namespace Count</label>
      <p className="text-sm">
        {protocolData.namespace_count || protocolData.opcua_namespaces || '2'}
      </p>
    </div>
  </div>
);
