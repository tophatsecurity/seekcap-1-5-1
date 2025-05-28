
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Eye, Flag, Clock, Network, Shield } from 'lucide-react';
import { SecurityAlert } from '@/utils/securityDataGenerator';

interface IDSAlertsTabProps {
  alerts: SecurityAlert[];
  onMarkFalsePositive: (alertId: string) => void;
}

export const IDSAlertsTab: React.FC<IDSAlertsTabProps> = ({ alerts, onMarkFalsePositive }) => {
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

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
      case 'low': return <Eye className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Regular IDS Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedAlert(alert)}>
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {alert.rule}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <AlertDescription className="font-medium">
                        {alert.title}
                      </AlertDescription>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Network className="h-3 w-3" />
                            Asset: {alert.assetName} ({alert.assetIp})
                          </span>
                          <span>Protocol: {alert.protocol}</span>
                          <span>Port: {alert.port}</span>
                        </div>
                        <div>Source: {alert.sourceIp} → Destination: {alert.destinationIp}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAlert(alert);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkFalsePositive(alert.id);
                      }}
                    >
                      <Flag className="h-4 w-4 mr-1" />
                      False Positive
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Details Modal/Sidebar would go here */}
      {selectedAlert && (
        <Card>
          <CardHeader>
            <CardTitle>Alert Details: {selectedAlert.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Severity</TableCell>
                  <TableCell>
                    <Badge variant={getSeverityColor(selectedAlert.severity)}>
                      {selectedAlert.severity.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Asset Name</TableCell>
                  <TableCell>{selectedAlert.assetName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Asset IP</TableCell>
                  <TableCell>{selectedAlert.assetIp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Asset MAC</TableCell>
                  <TableCell>{selectedAlert.assetMac}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Protocol</TableCell>
                  <TableCell>{selectedAlert.protocol}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Source IP</TableCell>
                  <TableCell>{selectedAlert.sourceIp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Destination IP</TableCell>
                  <TableCell>{selectedAlert.destinationIp}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Port</TableCell>
                  <TableCell>{selectedAlert.port}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Rule ID</TableCell>
                  <TableCell>{selectedAlert.rule}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Category</TableCell>
                  <TableCell>{selectedAlert.category}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Packets</TableCell>
                  <TableCell>{selectedAlert.details.packets}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bytes</TableCell>
                  <TableCell>{selectedAlert.details.bytes.toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Duration</TableCell>
                  <TableCell>{selectedAlert.details.duration}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Signature</TableCell>
                  <TableCell>{selectedAlert.details.signature}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
