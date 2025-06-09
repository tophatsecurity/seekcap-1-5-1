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
  TrendingUp
} from "lucide-react";
import { Asset } from "@/lib/db/types";
import { generateDetailedSampleAssets } from "@/utils/sampleTopologyData";

// API service for fetching assets from the external API
const fetchAssetsFromAPI = async (): Promise<Asset[]> => {
  try {
    const response = await fetch('/api/assets');
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const data = await response.json();
    
    // Transform API data to match our Asset type
    return data.results?.map((item: any): Asset => ({
      mac_address: item.mac_address || item.id || '',
      name: item.hostname || item.name || 'Unknown',
      device_type: item.device_type || 'Unknown',
      src_ip: item.ip || item.ip_address || null,
      ip_address: item.ip || item.ip_address || null,
      vendor: item.vendor || 'Unknown',
      first_seen: item.timestamp_first_seen || new Date().toISOString(),
      last_seen: item.timestamp_last_seen || new Date().toISOString(),
      eth_proto: item.eth_proto || null,
      icmp: item.icmp || false,
      experience: (['Excellent', 'Good', 'Fair', 'Poor'].includes(item.experience)) 
        ? item.experience as 'Excellent' | 'Good' | 'Fair' | 'Poor'
        : 'Fair',
      technology: item.technology || null,
      signal_strength: item.signal_strength || null,
      channel: item.channel || null,
      usage_mb: item.usage_mb || 0,
      download_bps: item.download_bps || 0,
      upload_bps: item.upload_bps || 0,
      uptime: item.uptime || null,
      channel_width: item.channel_width || null,
      noise_floor: item.noise_floor || null,
      tx_rate: item.tx_rate || null,
      rx_rate: item.rx_rate || null,
      tx_power: item.tx_power || null,
      distance: item.distance || null,
      ccq: item.ccq || null,
      airtime: item.airtime || null,
      connection: item.connection || null,
      network: item.network || null,
      wifi: item.wifi || null,
    })) || [];
  } catch (error) {
    console.error('Error fetching from API:', error);
    return [];
  }
};

const Assets = () => {
  const { data: dbAssets = [], isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  const { data: apiAssets = [], isLoading: isApiLoading } = useQuery({
    queryKey: ["api-assets"],
    queryFn: fetchAssetsFromAPI,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);

  // Combine API assets with database assets, prioritizing API data
  const assets: Asset[] = apiAssets.length > 0 ? apiAssets : 
    dbAssets.length > 0 ? dbAssets : generateDetailedSampleAssets();

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

  if (isLoading || isApiLoading) {
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
        <h1 className="text-3xl font-bold">Network Assets</h1>
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
              {apiAssets.length > 0 ? 'From API' : dbAssets.length > 0 ? 'From Database' : 'Sample Data'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Assets</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter(a => a.last_seen && new Date(a.last_seen) > new Date(Date.now() - 86400000)).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active in the last 24 hours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Bandwidth</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatBandwidth(assets.reduce((sum, asset) => sum + (asset.download_bps || 0) + (asset.upload_bps || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined network traffic
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Talkers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assets.filter(a => (a.download_bps || 0) + (a.upload_bps || 0) > 100000000).length}
            </div>
            <p className="text-xs text-muted-foreground">
              High bandwidth devices
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
                        <Badge variant="secondary">{asset.eth_proto || 'Unknown'}</Badge>
                      </TableCell>
                      <TableCell>{getExperienceBadge(asset.experience)}</TableCell>
                      <TableCell>{formatBandwidth(asset.download_bps)}</TableCell>
                      <TableCell>{formatBandwidth(asset.upload_bps)}</TableCell>
                      <TableCell>
                        {asset.last_seen ? new Date(asset.last_seen).toLocaleString() : 'Unknown'}
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
    </div>
  );
};

export default Assets;
