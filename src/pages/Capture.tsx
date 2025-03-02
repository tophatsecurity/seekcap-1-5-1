
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  Server, 
  Router, 
  Network, 
  PlugZap, 
  AlertCircle,
  CheckCircle,
  MinusCircle
} from "lucide-react";
import { fetchCaptureSettings } from "@/lib/db/capture";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Connection type constants
const CONNECTION_TYPES = {
  DIRECT: "Direct",
  RELAYED: "Relayed",
  UNKNOWN: "Unknown"
};

const STATUS_TYPES = {
  ONLINE: "Online",
  OFFLINE: "Offline",
  WARNING: "Warning",
  UNKNOWN: "Unknown"
};

const Capture = () => {
  const navigate = useNavigate();
  
  const { data: captureSettings, isLoading, error, refetch } = useQuery({
    queryKey: ["captureSettings"],
    queryFn: fetchCaptureSettings,
  });

  const handleNavigateToDeploy = () => {
    navigate("/deploy");
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading capture settings...</h2>
          <p className="text-muted-foreground">Please wait while we fetch the configuration.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-destructive">Error loading capture settings</h2>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : "Unknown error occurred"}
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Function to determine device icon based on vendor type
  const DeviceIcon = ({ vendor }: { vendor: string }) => {
    const vendorLower = vendor.toLowerCase();
    
    if (vendorLower.includes("router") || vendorLower.includes("switch")) {
      return <Router className="h-5 w-5 text-blue-500" />;
    } else if (vendorLower.includes("vmware") || vendorLower.includes("server")) {
      return <Server className="h-5 w-5 text-purple-500" />;
    } else {
      return <Network className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to determine connection icon
  const ConnectionIcon = ({ type }: { type: string }) => {
    switch (type) {
      case CONNECTION_TYPES.DIRECT:
        return <PlugZap className="h-5 w-5 text-green-500" />;
      case CONNECTION_TYPES.RELAYED:
        return <Network className="h-5 w-5 text-orange-500" />;
      default:
        return <MinusCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to display status icon
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case STATUS_TYPES.ONLINE:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case STATUS_TYPES.OFFLINE:
        return <MinusCircle className="h-5 w-5 text-gray-500" />;
      case STATUS_TYPES.WARNING:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-300" />;
    }
  };

  // Helper function to determine connection type based on device data
  const getConnectionType = (device: any) => {
    if (device.protocol === "ssh" || device.protocol === "telnet") {
      return CONNECTION_TYPES.DIRECT;
    } else if (device.return_path_credential_set) {
      return CONNECTION_TYPES.RELAYED;
    } else {
      return CONNECTION_TYPES.UNKNOWN;
    }
  };

  // Helper function to determine device status (mocked for now)
  const getDeviceStatus = (device: any) => {
    // This would ideally come from real-time data
    // For now, we'll use a simple algorithm based on enabled flag
    return device.enabled ? STATUS_TYPES.ONLINE : STATUS_TYPES.OFFLINE;
  };

  // Helper function to format the last heard time
  const getLastHeardTime = (device: any) => {
    // In a real system, this would be from actual monitoring data
    // For now, we'll just return "Just now" for enabled devices
    return device.enabled ? "Just now" : "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Capture Configuration</h2>
          <p className="text-muted-foreground">
            Monitor and manage capture device connections
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>Refresh Devices</Button>
          <Button variant="default" onClick={handleNavigateToDeploy}>
            Deploy New Device
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Configuration Summary</CardTitle>
            <CardDescription>Capture server and connection details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Capture Server:</span>
                <span>{captureSettings?.capture_server?.hostname || "Not configured"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Server IP:</span>
                <span>{captureSettings?.capture_server?.ip || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Storage Mode:</span>
                <span className="capitalize">{captureSettings?.storage_mode || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Devices:</span>
                <span>{captureSettings?.devices?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Active Devices:</span>
                <span>
                  {captureSettings?.devices?.filter(device => device.enabled).length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>Real-time status of capture devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {captureSettings?.devices?.filter(d => d.enabled).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Active</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {captureSettings?.devices?.filter(d => !d.enabled).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Inactive</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {captureSettings?.devices?.filter(d => 
                    getConnectionType(d) === CONNECTION_TYPES.DIRECT).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Direct</div>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">
                  {captureSettings?.devices?.filter(d => 
                    getConnectionType(d) === CONNECTION_TYPES.RELAYED).length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Relayed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Devices</CardTitle>
          <CardDescription>All configured capture devices and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {captureSettings?.devices && captureSettings.devices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Connection</TableHead>
                  <TableHead>Last Heard</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {captureSettings.devices.map((device) => (
                  <TableRow key={device.name}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <DeviceIcon vendor={device.vendor} />
                      {device.name}
                    </TableCell>
                    <TableCell>{device.ip}</TableCell>
                    <TableCell>{device.vendor}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ConnectionIcon type={getConnectionType(device)} />
                        {getConnectionType(device)}
                      </div>
                    </TableCell>
                    <TableCell>{getLastHeardTime(device)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StatusIcon status={getDeviceStatus(device)} />
                        {getDeviceStatus(device)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => navigate(`/deploy?edit=${device.name}`)}
                        >
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No capture devices configured</p>
              <Button className="mt-4" onClick={handleNavigateToDeploy}>
                Deploy Your First Device
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Capture;
