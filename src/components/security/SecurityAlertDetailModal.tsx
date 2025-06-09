
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SecurityAlert } from '@/utils/securityDataGenerator';
import { 
  AlertTriangle,
  Shield,
  Network,
  Clock,
  Database,
  Activity,
  Flag,
  Copy,
  Factory
} from 'lucide-react';

interface SecurityAlertDetailModalProps {
  alert: SecurityAlert;
  open: boolean;
  onClose: () => void;
}

export const SecurityAlertDetailModal: React.FC<SecurityAlertDetailModalProps> = ({
  alert,
  open,
  onClose,
}) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      case 'low': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isScadaAlert = alert.type === 'scada';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isScadaAlert ? (
              <Factory className="h-5 w-5 text-orange-600" />
            ) : (
              <Shield className="h-5 w-5" />
            )}
            {isScadaAlert ? 'SCADA' : 'Regular'} IDS Alert Details
          </DialogTitle>
          <DialogDescription>
            Alert ID: {alert.id} • {new Date(alert.timestamp).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alert Overview */}
          <Card className={isScadaAlert ? 'border-orange-200' : ''}>
            <CardHeader className={isScadaAlert ? 'bg-orange-50' : ''}>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(alert.severity)}
                  <span className={isScadaAlert ? 'text-orange-800' : ''}>{alert.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(alert.severity)}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  {isScadaAlert && (
                    <Badge className="bg-orange-500">SCADA</Badge>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Alert Category</label>
                    <p className={`font-medium ${isScadaAlert ? 'text-orange-700' : ''}`}>{alert.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Rule ID</label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm">{alert.rule}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(alert.rule)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Protocol</label>
                    <Badge className={isScadaAlert ? 'bg-orange-500' : 'bg-blue-500'}>
                      {alert.protocol}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Timestamp
                    </label>
                    <p>{new Date(alert.timestamp).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Port</label>
                    <p className="font-mono">{alert.port}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Signature</label>
                    <p className="font-mono text-sm break-all">{alert.details.signature}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Asset Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                {isScadaAlert ? 'ICS Asset Information' : 'Asset Information'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {isScadaAlert ? 'ICS Asset Name' : 'Asset Name'}
                    </label>
                    <p className={`font-medium ${isScadaAlert ? 'text-orange-700' : ''}`}>{alert.assetName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono">{alert.assetIp}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(alert.assetIp)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">MAC Address</label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono">{alert.assetMac}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(alert.assetMac)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Source IP</label>
                    <p className="font-mono">{alert.sourceIp}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Destination IP</label>
                    <p className="font-mono">{alert.destinationIp}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {isScadaAlert ? 'Industrial Protocol' : 'Network Protocol'}
                    </label>
                    <Badge className={isScadaAlert ? 'bg-orange-500' : 'bg-blue-500'}>
                      {alert.protocol}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Traffic Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                Traffic Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Packets</label>
                  <p className="text-2xl font-bold">{alert.details.packets.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bytes</label>
                  <p className="text-2xl font-bold">{alert.details.bytes.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Duration</label>
                  <p className="text-2xl font-bold">{alert.details.duration}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threat Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Threat Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Risk Level</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getSeverityColor(alert.severity)} className="text-sm">
                      {alert.severity.toUpperCase()} RISK
                    </Badge>
                    {isScadaAlert && (
                      <Badge className="bg-orange-500 text-sm">
                        INDUSTRIAL SYSTEM
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recommended Actions</label>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-1">
                    {alert.severity === 'high' ? (
                      <>
                        <li>Immediate investigation required</li>
                        <li>Isolate affected {isScadaAlert ? 'industrial system' : 'asset'} if necessary</li>
                        <li>Check for signs of compromise</li>
                        <li>Review firewall and access logs</li>
                      </>
                    ) : alert.severity === 'medium' ? (
                      <>
                        <li>Investigate within 4 hours</li>
                        <li>Monitor {isScadaAlert ? 'industrial system' : 'asset'} for unusual activity</li>
                        <li>Review related security events</li>
                      </>
                    ) : (
                      <>
                        <li>Review during next security assessment</li>
                        <li>Document for trend analysis</li>
                        <li>Consider tuning detection rules</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Raw Alert Data */}
          <Card>
            <CardHeader>
              <CardTitle>Raw Alert Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-xs font-mono whitespace-pre-wrap break-all">
                  {JSON.stringify({
                    id: alert.id,
                    timestamp: alert.timestamp,
                    severity: alert.severity,
                    category: alert.category,
                    rule: alert.rule,
                    title: alert.title,
                    protocol: alert.protocol,
                    source: alert.sourceIp,
                    destination: alert.destinationIp,
                    port: alert.port,
                    asset: {
                      name: alert.assetName,
                      ip: alert.assetIp,
                      mac: alert.assetMac
                    },
                    details: alert.details
                  }, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
