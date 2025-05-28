
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Undo, Clock, Network, AlertCircle } from 'lucide-react';
import { SecurityAlert } from '@/utils/securityDataGenerator';

interface FalsePositivesTabProps {
  falsePositives: (SecurityAlert & { markedAt: string })[];
  setFalsePositives: React.Dispatch<React.SetStateAction<any[]>>;
}

export const FalsePositivesTab: React.FC<FalsePositivesTabProps> = ({ 
  falsePositives, 
  setFalsePositives 
}) => {
  const handleRemove = (alertId: string) => {
    setFalsePositives(prev => prev.filter(fp => fp.id !== alertId));
  };

  const handleRestore = (alertId: string) => {
    // In a real app, this would restore the alert to the active alerts list
    setFalsePositives(prev => prev.filter(fp => fp.id !== alertId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    return type === 'scada' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-blue-50 border-blue-200 text-blue-700';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            False Positives
          </CardTitle>
        </CardHeader>
        <CardContent>
          {falsePositives.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No false positives marked yet.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alert</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Asset IP</TableHead>
                  <TableHead>Protocol</TableHead>
                  <TableHead>Marked At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {falsePositives.map((alert) => (
                  <TableRow key={alert.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.title}</div>
                        <div className="text-sm text-muted-foreground">{alert.rule}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(alert.type)}>
                        {alert.type === 'scada' ? 'SCADA IDS' : 'Regular IDS'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{alert.assetName}</div>
                        <div className="text-sm text-muted-foreground">{alert.assetMac}</div>
                      </div>
                    </TableCell>
                    <TableCell>{alert.assetIp}</TableCell>
                    <TableCell>{alert.protocol}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(alert.markedAt).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRestore(alert.id)}
                        >
                          <Undo className="h-4 w-4 mr-1" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(alert.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
