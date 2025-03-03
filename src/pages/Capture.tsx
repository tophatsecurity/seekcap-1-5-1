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
  MinusCircle,
  Upload
} from "lucide-react";
import { fetchCaptureSettings, importVendorConfiguration } from "@/lib/db/capture";
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
import { toast } from "@/hooks/use-toast";

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

  const handleImportConfiguration = async () => {
    const configData = {
      "capture_directory": "/opt/SEEKCAP/captures",
      "storage_mode": "seconds",
      "capture_server": {
        "hostname": "ddx1",
        "ip": "192.168.1.100"
      },
      "storage_timeout": 30,
      "return_paths": {
        "scp": {
          "enabled": true,
          "base_path": "/opt/SEEKCAP/captures/{switchname}/scp",
          "ip": "172.19.2.121",
          "port": 22,
          "credentials": "return_set"
        },
        "ftp": {
          "enabled": true,
          "base_path": "/opt/SEEKCAP/captures/{switchname}/ftp",
          "host": "172.19.2.121",
          "credentials": "return_set"
        },
        "tftp": {
          "enabled": true,
          "base_path": "/opt/SEEKCAP/captures/{switchname}/tftp",
          "host": "172.19.2.121"
        },
        "direct": {
          "enabled": true,
          "base_path": "/opt/SEEKCAP/captures/{switchname}/direct"
        }
      },
      "credentials": {
        "admin_set": {
          "user": "root",
          "password": "!Seek4Packet!",
          "enable_required": false,
          "enable_password": "enable_pass"
        },
        "readonly_set": {
          "user": "readonly",
          "password": "readonly_pass",
          "enable_required": false
        },
        "return_set": {
          "user": "ths",
          "password": "readys3tg0!",
          "enable_required": false
        }
      },
      "devices": [
        {
          "name": "udm-datacenter",
          "vendor": "Ubiquiti",
          "ip": "172.19.224.1",
          "port": 22,
          "protocol": "ssh",
          "enabled": true,
          "credential_set": "admin_set",
          "return_path_credential_set": "return_set",
          "capture_filter": ""
        },
        {
          "name": "primus",
          "vendor": "Ubiquiti",
          "ip": "172.19.2.1",
          "port": 22,
          "protocol": "ssh",
          "enabled": true,
          "credential_set": "admin_set",
          "return_path_credential_set": "return_set",
          "capture_filter": ""
        }
      ],
      "vendors": {
        "Cisco": { "enabled": true },
        "Juniper": { "enabled": true },
        "Fortinet": { "enabled": true },
        "Netgear": { "enabled": true },
        "Ubiquiti": { "enabled": true },
        "Huawei": { "enabled": true },
        "Arista": { "enabled": true },
        "Dell": { "enabled": true },
        "Palo Alto": { "enabled": true },
        "MikroTik": { "enabled": true },
        "Extreme Networks": { "enabled": true }
      },
      "interface_commands": {
        "Cisco": "show interfaces switchport",
        "Juniper": "show interfaces extensive",
        "Fortinet": "get hardware nic",
        "Netgear": "show interfaces all",
        "Ubiquiti": "ifconfig",
        "Huawei": "display interface brief",
        "Arista": "show interfaces status",
        "Dell": "show interfaces status",
        "Palo Alto": "show interface all",
        "MikroTik": "interface print",
        "Extreme Networks": "show ports"
      },
      "capture_commands": {
        "Cisco": "monitor capture remote_capture interface {interface} start",
        "Juniper": "monitor traffic interface {interface} size 1500 write-file {pcap_filename}",
        "Fortinet": "diagnose sniffer packet {interface} 'tcp and port 80' -c 100 -i 1 -w {pcap_filename}",
        "Netgear": "debug monitor capture start interface {interface} file {pcap_filename}",
        "Ubiquiti": "tcpdump -i {interface} -w {pcap_filename}",
        "Huawei": "observe interface {interface} to-file {pcap_filename}",
        "Arista": "tcpdump -i {interface} -w {pcap_filename}",
        "Dell": "capture interface {interface} file {pcap_filename}",
        "Palo Alto": "tcpdump filter 'port 80' snaplen 65535 count 100 interface {interface} write {pcap_filename}",
        "MikroTik": "tool sniffer start interface={interface} file-name={pcap_filename}",
        "Extreme Networks": "debug packet interface {interface} start {pcap_filename}"
      },
      "stop_capture_commands": {
        "Cisco": "monitor capture remote_capture interface {interface} stop",
        "Juniper": "monitor traffic stop",
        "Fortinet": "diagnose sniffer stop",
        "Netgear": "debug monitor capture stop",
        "Ubiquiti": "killall tcpdump",
        "Huawei": "stop observe interface {interface}",
        "Arista": "killall tcpdump",
        "Dell": "stop capture interface {interface}",
        "Palo Alto": "tcpdump stop",
        "MikroTik": "tool sniffer stop",
        "Extreme Networks": "debug packet interface {interface} stop"
      },
      "remove_pcap_commands": {
        "Cisco": "rm -f {pcap_filename}",
        "Juniper": "rm -f {pcap_filename}",
        "Fortinet": "execute rm {pcap_filename}",
        "Netgear": "rm -f {pcap_filename}",
        "Ubiquiti": "rm -f {pcap_filename}",
        "Huawei": "delete /force {pcap_filename}",
        "Arista": "rm -f {pcap_filename}",
        "Dell": "rm -f {pcap_filename}",
        "Palo Alto": "delete {pcap_filename}",
        "MikroTik": "file remove {pcap_filename}",
        "Extreme Networks": "delete {pcap_filename}"
      },
      "tmp_directories": {
        "Cisco": "/tmp",
        "Juniper": "/var/tmp",
        "Fortinet": "/var/log",
        "Netgear": "/tmp",
        "Ubiquiti": "/volume1/seekcap",
        "Huawei": "/tmp",
        "Arista": "/var/log",
        "Dell": "/tmp",
        "Palo Alto": "/var/tmp",
        "MikroTik": "/disk1",
        "Extreme Networks": "/tmp"
      },
      "interface_regex": {
        "Cisco": "^(\\S+) is up",
        "Juniper": "^(\\S+)\\s+up",
        "Fortinet": "^(\\S+)\\s+link up",
        "Netgear": "^(\\S+)\\s+Link is Up",
        "Ubiquiti": "^(\\S+): flags=.*<UP",
        "Huawei": "^(\\S+)\\s+UP",
        "Arista": "^(\\S+)\\s+connected",
        "Dell": "^(\\S+)\\s+up",
        "Palo Alto": "^(\\S+)\\s+Up",
        "MikroTik": "^(\\S+)\\s+running",
        "Extreme Networks": "^(\\S+)\\s+Enabled"
      },
      "extract_pcap_commands": {
        "Cisco": [
          {"method": "scp", "command": "scp {pcap_filename} {scp_user}@172.19.2.121:/home/{interface}.pcap", "storage_path": "/opt/SEEKCAP/captures/{switchname}/scp"},
          {"method": "ftp", "command": "ftp upload address=172.19.2.121 src-file={pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/ftp"},
          {"method": "tftp", "command": "copy flash:/{interface}.pcap tftp://172.19.2.121/{interface}.pcap", "storage_path": "/opt/SEEKCAP/captures/{switchname}/tftp"},
          {"method": "direct", "command": "base64 {pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/direct"}
        ],
        "Juniper": [
          {"method": "scp", "command": "file copy {pcap_filename} scp://{scp_user}@172.19.2.121/home/{interface}.pcap", "storage_path": "/opt/SEEKCAP/captures/{switchname}/scp"},
          {"method": "ftp", "command": "ftp upload address=172.19.2.121 src-file={pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/ftp"},
          {"method": "tftp", "command": "tftp put {pcap_filename} 172.19.2.121", "storage_path": "/opt/SEEKCAP/captures/{switchname}/tftp"},
          {"method": "direct", "command": "base64 {pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/direct"}
        ],
        "Fortinet": [
          {"method": "scp", "command": "exec scp {pcap_filename} {scp_user}@172.19.2.121:/home/{interface}.pcap", "storage_path": "/opt/SEEKCAP/captures/{switchname}/scp"},
          {"method": "ftp", "command": "ftp upload address=172.19.2.121 src-file={pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/ftp"},
          {"method": "tftp", "command": "tftp put {pcap_filename} 172.19.2.121", "storage_path": "/opt/SEEKCAP/captures/{switchname}/tftp"},
          {"method": "direct", "command": "base64 {pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/direct"}
        ],
        "Netgear": [
          {"method": "scp", "command": "scp {pcap_filename} {scp_user}@172.19.2.121:/home/{interface}.pcap", "storage_path": "/opt/SEEKCAP/captures/{switchname}/scp"},
          {"method": "ftp", "command": "ftp upload address=172.19.2.121 src-file={pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/ftp"},
          {"method": "tftp", "command": "tftp put {pcap_filename} 172.19.2.121", "storage_path": "/opt/SEEKCAP/captures/{switchname}/tftp"},
          {"method": "direct", "command": "base64 {pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/direct"}
        ],
        "Ubiquiti": [
          {"method": "scp", "command": "scp {pcap_filename} {scp_user}@172.19.2.121:/home/{interface}.pcap", "storage_path": "/opt/SEEKCAP/captures/{switchname}/scp"},
          {"method": "ftp", "command": "ftp upload address=172.19.2.121 src-file={pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/ftp"},
          {"method": "tftp", "command": "tftp put {pcap_filename} 172.19.2.121", "storage_path": "/opt/SEEKCAP/captures/{switchname}/tftp"},
          {"method": "direct", "command": "base64 {pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/direct"}
        ],
        "Huawei": [
          {"method": "scp", "command": "sftp {scp_user}@172.19.2.121:/home/{interface}.pcap", "storage_path": "/opt/SEEKCAP/captures/{switchname}/scp"},
          {"method": "ftp", "command": "ftp {pcap_filename} 172.19.2.121", "storage_path": "/opt/SEEKCAP/captures/{switchname}/ftp"},
          {"method": "tftp", "command": "tftp put {pcap_filename} 172.19.2.121", "storage_path": "/opt/SEEKCAP/captures/{switchname}/tftp"},
          {"method": "direct", "command": "base64 {pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/direct"}
        ],
        "Arista": [
          {"method": "scp", "command": "scp {pcap_filename} {scp_user}@172.19.2.121:/home/{interface}.pcap", "storage_path": "/opt/SEEKCAP/captures/{switchname}/scp"},
          {"method": "ftp", "command": "ftp upload address=172.19.2.121 src-file={pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/ftp"},
          {"method": "tftp", "command": "tftp put {pcap_filename} 172.19.2.121", "storage_path": "/opt/SEEKCAP/captures/{switchname}/tftp"},
          {"method": "direct", "command": "base64 {pcap_filename}", "storage_path": "/opt/SEEKCAP/captures/{switchname}/direct"}
        ]
      }
    };

    const result = await importVendorConfiguration(configData);
    
    if (result.success) {
      toast({
        title: "Configuration imported",
        description: "Successfully imported vendor profiles and configurations",
      });
      refetch();
    }
  };

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

  const getConnectionType = (device: any) => {
    if (device.protocol === "ssh" || device.protocol === "telnet") {
      return CONNECTION_TYPES.DIRECT;
    } else if (device.return_path_credential_set) {
      return CONNECTION_TYPES.RELAYED;
    } else {
      return CONNECTION_TYPES.UNKNOWN;
    }
  };

  const getDeviceStatus = (device: any) => {
    return device.enabled ? STATUS_TYPES.ONLINE : STATUS_TYPES.OFFLINE;
  };

  const getLastHeardTime = (device: any) => {
    return device.enabled ? "Just now" : "N/A";
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
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            className="flex items-center gap-1"
          >
            Refresh Devices
          </Button>
          <Button 
            variant="outline" 
            onClick={handleImportConfiguration}
            className="flex items-center gap-1"
          >
            <Upload className="w-4 h-4" />
            Import Config
          </Button>
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
              <div className="flex justify-between">
                <span className="font-medium">Vendors:</span>
                <span>
                  {captureSettings?.vendors ? Object.keys(captureSettings.vendors).length : 0}
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

      {captureSettings?.vendors && Object.keys(captureSettings.vendors).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Vendor Profiles</CardTitle>
            <CardDescription>Configured vendor-specific capture profiles</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Interface Command</TableHead>
                  <TableHead>Tmp Directory</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(captureSettings.vendors).map(([vendor, config]) => (
                  <TableRow key={vendor}>
                    <TableCell className="font-medium">{vendor}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${config.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {config.enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-xs max-w-[250px] truncate">
                      {captureSettings.interface_commands[vendor]}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {captureSettings.tmp_directories[vendor]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Capture;
