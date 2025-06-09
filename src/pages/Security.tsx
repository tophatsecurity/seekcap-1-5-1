
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, ShieldAlert, Filter, Download, Eye } from 'lucide-react';
import { IDSAlertsTab } from '@/components/security/IDSAlertsTab';
import { SCADAAlertsTab } from '@/components/security/SCADAAlertsTab';
import { FalsePositivesTab } from '@/components/security/FalsePositivesTab';
import { SecurityAlertDetailModal } from '@/components/security/SecurityAlertDetailModal';
import { generateSecurityAlerts } from '@/utils/securityDataGenerator';
import { SecurityAlert } from '@/utils/securityDataGenerator';

const Security = () => {
  const [alerts] = useState(() => generateSecurityAlerts(150)); // Generate more alerts for demo
  const [falsePositives, setFalsePositives] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  const regularAlerts = alerts.filter(alert => alert.type === 'regular');
  const scadaAlerts = alerts.filter(alert => alert.type === 'scada');

  const handleMarkFalsePositive = (alertId: string) => {
    const alert = alerts.find(a => a.id === alertId);
    if (alert) {
      setFalsePositives(prev => [...prev, { ...alert, markedAt: new Date().toISOString() }]);
    }
  };

  const handleViewAlert = (alert: SecurityAlert) => {
    setSelectedAlert(alert);
  };

  const criticalCount = alerts.filter(a => a.severity === 'high').length;
  const mediumCount = alerts.filter(a => a.severity === 'medium').length;
  const lowCount = alerts.filter(a => a.severity === 'low').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor IDS alerts and manage security events across your network • {alerts.length} total alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medium Alerts</CardTitle>
            <ShieldAlert className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{mediumCount}</div>
            <p className="text-xs text-muted-foreground">
              Need investigation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Alerts</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{lowCount}</div>
            <p className="text-xs text-muted-foreground">
              Informational
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">False Positives</CardTitle>
            <Badge variant="secondary">{falsePositives.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{falsePositives.length}</div>
            <p className="text-xs text-muted-foreground">
              Marked as false positives
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Recent Regular IDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {regularAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.assetName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'default'} className="text-xs">
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleViewAlert(alert)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Recent SCADA IDS
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scadaAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 border rounded border-orange-200">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-orange-800">{alert.title}</p>
                    <p className="text-xs text-muted-foreground">{alert.assetName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.severity === 'high' ? 'destructive' : 'default'} className="text-xs">
                      {alert.severity.toUpperCase()}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => handleViewAlert(alert)}>
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alert Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Network Intrusion', 'Malware Detection', 'Unauthorized Access', 'Protocol Anomaly', 'Data Exfiltration'].map((category) => {
                const count = alerts.filter(a => a.category === category).length;
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-sm">{category}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="regular-ids" className="space-y-4">
        <TabsList>
          <TabsTrigger value="regular-ids">
            Regular IDS 
            <Badge variant="secondary" className="ml-2">
              {regularAlerts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="scada-ids">
            SCADA IDS
            <Badge variant="secondary" className="ml-2">
              {scadaAlerts.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="false-positives">
            False Positives
            <Badge variant="secondary" className="ml-2">
              {falsePositives.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regular-ids">
          <IDSAlertsTab 
            alerts={regularAlerts} 
            onMarkFalsePositive={handleMarkFalsePositive}
            onViewAlert={handleViewAlert}
          />
        </TabsContent>

        <TabsContent value="scada-ids">
          <SCADAAlertsTab 
            alerts={scadaAlerts} 
            onMarkFalsePositive={handleMarkFalsePositive}
            onViewAlert={handleViewAlert}
          />
        </TabsContent>

        <TabsContent value="false-positives">
          <FalsePositivesTab 
            falsePositives={falsePositives}
            setFalsePositives={setFalsePositives}
          />
        </TabsContent>
      </Tabs>

      {selectedAlert && (
        <SecurityAlertDetailModal
          alert={selectedAlert}
          open={!!selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
};

export default Security;
