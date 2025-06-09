import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssetFilters } from "@/components/AssetFilters";
import { AssetBulkActions } from "@/components/AssetBulkActions";
import { AssetType } from "@/lib/types";
import { TopTalkersView } from "@/components/TopTalkersView";
import { DevicePortView } from "@/components/topology/DevicePortView";
import { getOuiStats } from "@/lib/oui-lookup";
import { 
  Database, 
  Search, 
  Filter, 
  Download,
  Network,
  Activity,
  TrendingUp,
  Eye
} from "lucide-react";
import { Asset } from "@/lib/db/types";
import { generateDetailedSampleAssets } from "@/utils/sampleDataGenerator";
import { AssetDetailModal } from "@/components/AssetDetailModal";

const Assets = () => {
  const { data: dbAssets = [], isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);

  // Use sample data with 1812 assets if no real data is available, properly typed
  const assets: Asset[] = dbAssets.length === 0 ? generateDetailedSampleAssets() as Asset[] : dbAssets;

  useEffect(() => {
    if (assets && assets.length > 0) {
      const types = assets.reduce((acc: Record<string, number>, asset) => {
        const type = asset.device_type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      
      const sortedTypes = Object.entries(types)
        .map(([type, count]) => ({ type, count: count as number }))
        .sort((a, b) => b.count - a.count);
      
      setAssetTypes(sortedTypes);
    }
  }, [assets]);

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.src_ip?.includes(searchTerm) ||
                         asset.mac_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || asset.device_type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const formatBandwidth = (bps?: number) => {
    if (!bps) return "0 bps";
    if (bps > 1000000000) return `${(bps / 1000000000).toFixed(1)} Gbps`;
    if (bps > 1000000) return `${(bps / 1000000).toFixed(1)} Mbps`;
    if (bps > 1000) return `${(bps / 1000).toFixed(1)} Kbps`;
    return `${bps} bps`;
  };

  const getExperienceBadge = (experience?: string) => {
    switch (experience) {
      case "Excellent":
        return <Badge className="bg-green-500">Excellent</Badge>;
      case "Good":
        return <Badge className="bg-blue-500">Good</Badge>;
      case "Fair":
        return <Badge className="bg-yellow-500">Fair</Badge>;
      case "Poor":
        return <Badge className="bg-red-500">Poor</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleAssetSelect = (macAddress: string) => {
    setSelectedAssets(prev => 
      prev.includes(macAddress) 
        ? prev.filter(mac => mac !== macAddress)
        : [...prev, macAddress]
    );
  };

  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.mac_address));
    }
  };

  const handleReclassify = (newType: string) => {
    console.log(`Reclassifying ${selectedAssets.length} assets to ${newType}`);
    setSelectedAssets([]);
  };

  const handleDelete = () => {
    console.log(`Deleting ${selectedAssets.length} assets`);
    setSelectedAssets([]);
  };

  const handleMarkSafe = () => {
    console.log(`Marking ${selectedAssets.length} assets as safe`);
    setSelectedAssets([]);
  };

  // Count Rockwell/Allen-Bradley devices
  const rockwellCount = assets.filter(asset => 
    asset.vendor?.includes("Rockwell") || asset.vendor?.includes("Allen-Bradley")
  ).length;

  // Count Modbus devices
  const modbusCount = assets.filter(asset => 
    asset.scada_protocols?.some(protocol => protocol.includes("Modbus")) ||
    asset.eth_proto?.includes("Modbus")
  ).length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading assets: {error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Network Assets</h1>
          <p className="text-muted-foreground mt-1">
            {assets.length} total assets • {rockwellCount} Rockwell/Allen-Bradley • {modbusCount} Modbus devices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assets.length}</div>
            <p className="text-xs text-muted-foreground">
              Network devices discovered
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rockwell/AB Devices</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rockwellCount}</div>
            <p className="text-xs text-muted-foreground">
              Rockwell Automation & Allen-Bradley
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Modbus Devices</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{modbusCount}</div>
            <p className="text-xs text-muted-foreground">
              Using Modbus protocol
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connected Assets</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter(a => a.connection === 'Connected').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently online
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="top-talkers">Top Talkers</TabsTrigger>
          <TabsTrigger value="port-mappings">Port Mappings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Assets</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, IP, MAC, or vendor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <AssetFilters
              filterType={filterType}
              onFilterChange={setFilterType}
              assetTypes={assetTypes}
            />
          </div>

          {selectedAssets.length > 0 && (
            <AssetBulkActions
              selectedCount={selectedAssets.length}
              onReclassify={handleReclassify}
              onDelete={handleDelete}
              onMarkSafe={handleMarkSafe}
              onClearSelection={() => setSelectedAssets([])}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Assets ({filteredAssets.length})</CardTitle>
              <CardDescription>
                Network devices and their connection details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedAssets.length === filteredAssets.length && filteredAssets.length > 0}
                        onChange={handleSelectAll}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>MAC Address</TableHead>
                    <TableHead>Vendor</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Download</TableHead>
                    <TableHead>Upload</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.map((asset) => (
                    <TableRow key={asset.mac_address}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(asset.mac_address)}
                          onChange={() => handleAssetSelect(asset.mac_address)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {asset.name || 'Unknown'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {asset.src_ip || asset.ip_address || 'Unknown'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {asset.mac_address}
                      </TableCell>
                      <TableCell>{asset.vendor || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{asset.device_type || 'Unknown'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{asset.eth_proto || asset.scada_protocols?.[0] || 'Unknown'}</Badge>
                      </TableCell>
                      <TableCell>{getExperienceBadge(asset.experience)}</TableCell>
                      <TableCell>{formatBandwidth(asset.download_bps)}</TableCell>
                      <TableCell>{formatBandwidth(asset.upload_bps)}</TableCell>
                      <TableCell>
                        {asset.last_seen ? new Date(asset.last_seen).toLocaleString() : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedAssetForDetail(asset)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-talkers">
          <TopTalkersView assets={assets} />
        </TabsContent>

        <TabsContent value="port-mappings">
          <DevicePortView networkDevices={[]} assets={assets} />
        </TabsContent>
      </Tabs>

      {selectedAssetForDetail && (
        <AssetDetailModal
          asset={selectedAssetForDetail}
          open={!!selectedAssetForDetail}
          onClose={() => setSelectedAssetForDetail(null)}
        />
      )}
    </div>
  );
};

export default Assets;
