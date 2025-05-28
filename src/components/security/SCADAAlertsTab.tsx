
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Factory, Eye, Flag, Clock, Network, Cpu } from 'lucide-react';
import { SecurityAlert } from '@/utils/securityDataGenerator';

interface SCADAAlertsTabProps {
  alerts: SecurityAlert[];
  onMarkFalsePositive: (alertId: string) => void;
}

export const SCADAAlertsTab: React.FC<SCADAAlertsTabProps> = ({ alerts, onMarkFalsePositive }) => {
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
      case 'high': return <Factory className="h-4 w-4 text-red-600" />;
      case 'medium': return <Cpu className="h-4 w-4 text-yellow-600" />;
      case 'low': return <Network className="h-4 w-4 text-blue-600" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Factory className="h-5 w-5" />
            SCADA IDS Alerts
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
                        <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200">
                          ICS: {alert.rule}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <AlertDescription className="font-medium text-orange-800">
                        {alert.title}
                      </AlertDescription>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Factory className="h-3 w-3" />
                            ICS Asset: {alert.assetName} ({alert.assetIp})
                          </span>
                          <span className="text-orange-600 font-medium">Protocol: {alert.protocol}</span>
                          <span>Port: {alert.port}</span>
                        </div>
                        <div>Source: {alert.sourceIp} → Destination: {alert.destinationIp}</div>
                        <div className="text-orange-700 font-medium">
                          Category: {alert.category}
                        </div>
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

      {/* SCADA Alert Details */}
      {selectedAlert && (
        <Card className="border-orange-200">
          <CardHeader className="bg-orange-50">
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Factory className="h-5 w-5" />
              SCADA Alert Details: {selectedAlert.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="mt-4">
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
                  <TableCell className="font-medium">ICS Asset Name</TableCell>
                  <TableCell className="font-medium text-orange-700">{selectedAlert.assetName}</TableCell>
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
                  <TableCell className="font-medium">Industrial Protocol</TableCell>
                  <TableCell className="font-medium text-orange-600">{selectedAlert.protocol}</TableCell>
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
                  <TableCell className="font-medium">ICS Rule ID</TableCell>
                  <TableCell>{selectedAlert.rule}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Threat Category</TableCell>
                  <TableCell className="font-medium text-orange-700">{selectedAlert.category}</TableCell>
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
                  <TableCell className="font-medium">ICS Signature</TableCell>
                  <TableCell className="font-mono text-sm">{selectedAlert.details.signature}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
