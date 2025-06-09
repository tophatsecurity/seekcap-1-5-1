
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Factory, Eye, Flag, Clock, Network, Cpu, Search } from 'lucide-react';
import { SecurityAlert } from '@/utils/securityDataGenerator';

interface SCADAAlertsTabProps {
  alerts: SecurityAlert[];
  onMarkFalsePositive: (alertId: string) => void;
  onViewAlert: (alert: SecurityAlert) => void;
}

export const SCADAAlertsTab: React.FC<SCADAAlertsTabProps> = ({ 
  alerts, 
  onMarkFalsePositive,
  onViewAlert 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.sourceIp.includes(searchTerm) ||
                         alert.destinationIp.includes(searchTerm) ||
                         alert.protocol.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

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
      {/* Filters */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="text-orange-800">Filter SCADA IDS Alerts</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search SCADA alerts, ICS assets, protocols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {['all', 'high', 'medium', 'low'].map((severity) => (
                <Button
                  key={severity}
                  variant={severityFilter === severity ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSeverityFilter(severity)}
                  className={severityFilter === severity ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  {severity === 'all' ? 'All' : severity.charAt(0).toUpperCase() + severity.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SCADA Alerts Table */}
      <Card className="border-orange-200">
        <CardHeader className="bg-orange-50">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Factory className="h-5 w-5" />
            SCADA IDS Alerts ({filteredAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>ICS Alert</TableHead>
                <TableHead>ICS Asset</TableHead>
                <TableHead>Industrial Protocol</TableHead>
                <TableHead>Source → Destination</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id} className="hover:bg-orange-50/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getSeverityIcon(alert.severity)}
                      <Badge variant={getSeverityColor(alert.severity)} className="text-xs">
                        {alert.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-orange-800">{alert.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs bg-orange-50 border-orange-200">
                          ICS: {alert.rule}
                        </Badge>
                        <span className="text-xs text-orange-700 font-medium">{alert.category}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-orange-700">{alert.assetName}</p>
                      <p className="text-xs text-muted-foreground font-mono">{alert.assetIp}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-orange-500">{alert.protocol}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-mono text-xs">
                      <div>{alert.sourceIp}</div>
                      <div className="text-muted-foreground">↓</div>
                      <div>{alert.destinationIp}:{alert.port}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewAlert(alert)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkFalsePositive(alert.id)}
                      >
                        <Flag className="h-3 w-3 mr-1" />
                        FP
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
