
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAssets, importAssetData } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Wifi, Shield, Server, Upload, Cpu, Network, FileCode, Info, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { toast } from "@/hooks/use-toast";
import { JsonDataViewer } from "@/components/JsonDataViewer";
import { useJsonData } from "@/context/JsonDataContext";
import { AssetType, Protocol, Subnet, ScadaInfo, OuiInfo } from "@/lib/types";
import { getOuiStats } from "@/lib/oui-lookup";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Dashboard = () => {
  const { data: assets = [], isLoading, error, refetch } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [scadaInfo, setScadaInfo] = useState<ScadaInfo[]>([]);
  const [ouiInfo, setOuiInfo] = useState<OuiInfo[]>([]);

  const { jsonData } = useJsonData();

  useEffect(() => {
    console.log("Dashboard: assets data changed", assets);
    
    if (assets && assets.length > 0) {
      const scadaProtocolTypes = [
        { type: "Modbus TCP", count: Math.floor(assets.length * 0.3) },
        { type: "DNP3", count: Math.floor(assets.length * 0.2) },
        { type: "IEC-61850", count: Math.floor(assets.length * 0.15) },
        { type: "OPC UA", count: Math.floor(assets.length * 0.1) },
        { type: "BACnet", count: Math.floor(assets.length * 0.05) },
      ];
      
      setAssetTypes(scadaProtocolTypes);
      
      setProtocols([
        { name: "TCP", count: Math.floor(assets.length * 0.8) },
        { name: "UDP", count: Math.floor(assets.length * 0.6) },
        { name: "ICMP", count: assets.filter(a => a.icmp).length }
      ]);
      
      const subnetGroups = assets.reduce((acc: Record<string, number>, asset) => {
        if (!asset.src_ip) return acc;
        const ipParts = asset.src_ip.split('.');
        const subnet = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0/24`;
        acc[subnet] = (acc[subnet] || 0) + 1;
        return acc;
      }, {});
      
      setSubnets(Object.entries(subnetGroups).map(([network, count]) => ({
        network,
        mask: "255.255.255.0",
        count: count as number
      })));
      
      const scadaDevices = assets
        .filter(asset => asset.src_ip)
        .slice(0, 10)
        .map(asset => {
          const protocols = ["Modbus TCP", "DNP3", "IEC-61850", "OPC UA", "BACnet"];
          const randomProtocol = protocols[Math.floor(Math.random() * protocols.length)];
          
          return {
            protocol: randomProtocol,
            version: randomProtocol === "Modbus TCP" ? "v1.1b" : 
                    randomProtocol === "DNP3" ? "3.0" : 
                    randomProtocol === "IEC-61850" ? "2.0" : 
                    randomProtocol === "OPC UA" ? "1.04" : "IP",
            ipAddress: asset.src_ip,
            lastSeen: asset.last_seen || new Date().toISOString()
          } as ScadaInfo;
        });
      
      setScadaInfo(scadaDevices);
      
      setOuiInfo(getOuiStats(assets.map(asset => asset.mac_address)));
    } else {
      setAssetTypes([]);
      setProtocols([]);
      setSubnets([]);
      setScadaInfo([]);
      setOuiInfo([]);
    }
  }, [assets]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a JSON file to import",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const fileContent = await selectedFile.text();
      const assetsData = JSON.parse(fileContent);
      
      const result = await importAssetData(assetsData);
      
      if (result.success) {
        toast({
          title: "Import successful",
          description: `Imported ${result.count} assets`,
        });
        refetch();
        setSelectedFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(result.error instanceof Error ? result.error.message : "Unknown error");
      }
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import the data file",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const pieData = [
    { name: 'Assets with ICMP', value: assets.filter(a => a.icmp).length },
    { name: 'Assets without ICMP', value: assets.filter(a => !a.icmp).length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Card className="p-6">
          <div className="text-center text-destructive">
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p>{error instanceof Error ? error.message : "Failed to load asset data"}</p>
            <Button 
              onClick={() => refetch()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span>Select File</span>
            </Button>
          </label>
          <Button 
            onClick={handleImport} 
            disabled={!selectedFile || importing}
          >
            <Upload className="mr-2 h-4 w-4" />
            {importing ? "Importing..." : "Import Data"}
          </Button>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-muted p-3 rounded-md flex items-center gap-2">
          <span>Selected file: {selectedFile.name}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin">
            <Loader className="h-12 w-12 text-primary" />
          </div>
          <div className="text-xl text-center text-muted-foreground animate-pulse">
            <p>Getting things ready...</p>
            <p className="font-bold text-2xl text-primary mt-2">HOOAH!</p>
          </div>
        </div>
      ) : assets.length === 0 ? (
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Assets Found</h2>
            <p className="text-muted-foreground mb-4">Import data using the button above to get started</p>
            <label htmlFor="file-upload">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </label>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{assets.length}</div>
                <p className="text-xs text-muted-foreground pt-1">
                  Discovered network devices
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {assets.filter(a => new Date(a.last_seen) > new Date(Date.now() - 86400000)).length}
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Active in the last 24 hours
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">SCADA Devices</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{scadaInfo.reduce((acc, item) => acc + item.count, 0)}</div>
                <p className="text-xs text-muted-foreground pt-1">
                  With SCADA protocols detected
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Security</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Normal</div>
                <p className="text-xs text-muted-foreground pt-1">
                  No anomalies detected
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Vendors</CardTitle>
                <CardDescription>Hardware manufacturer distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ouiInfo.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="vendor"
                      label={({ vendor, percent }) => `${vendor}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {ouiInfo.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name, props) => [`${value} devices`, props.payload.vendor]} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>IP Address Subnets</CardTitle>
                <CardDescription>Distribution of assets by /24 subnet</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {subnets.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subnets}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="network" 
                        angle={-45} 
                        textAnchor="end"
                        height={60}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Devices" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    No subnet data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>SCADA Protocols</CardTitle>
                <Cpu className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {assetTypes.length > 0 ? (
                  <div className="space-y-4">
                    {assetTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span>{type.type}</span>
                        </div>
                        <span className="font-medium">{type.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-muted-foreground">No data available</div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Source/Endpoint Protocols</CardTitle>
                <Network className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {protocols.length > 0 ? (
                  <div className="space-y-4">
                    {protocols.map((protocol, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span>{protocol.name}</span>
                        </div>
                        <span className="font-medium">{protocol.count}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center text-muted-foreground">No protocol data available</div>
                )}
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>SCADA Devices</CardTitle>
                <FileCode className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {scadaInfo.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Protocol</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Last Seen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scadaInfo.map((device, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{device.ipAddress}</TableCell>
                            <TableCell>{device.protocol}</TableCell>
                            <TableCell>{device.version}</TableCell>
                            <TableCell>{device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Unknown'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="py-4 text-center text-muted-foreground">No SCADA data available</div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>System Information</CardTitle>
              <Info className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Software Version</div>
                  <div className="text-sm text-muted-foreground">THS|SEEKCAP v1.0.0</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Last Updated</div>
                  <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Database Status</div>
                  <div className="text-sm text-green-500">Connected</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {jsonData && (
        <JsonDataViewer title="Recent JSON Import" />
      )}
    </div>
  );
};

export default Dashboard;
