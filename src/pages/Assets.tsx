
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Eye, Download, Upload, Wifi, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchAssets } from "@/lib/db/asset";
import { AssetTreeView } from "@/components/AssetTreeView";
import { AssetFilters } from "@/components/AssetFilters";
import { AssetBulkActions } from "@/components/AssetBulkActions";
import { TopTalkersView } from "@/components/TopTalkersView";
import { toast } from "@/hooks/use-toast";

interface FilterState {
  deviceType: string;
  vendor: string;
  protocol: string;
  ipRange: string;
}

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState<FilterState>({
    deviceType: "",
    vendor: "",
    protocol: "",
    ipRange: "",
  });

  const { data: assets = [], isLoading, error, refetch } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  console.log("Assets data:", assets);

  const deviceTypes = useMemo(() => {
    const types = new Set(assets.map(asset => asset.device_type).filter(Boolean));
    return Array.from(types).sort();
  }, [assets]);

  const vendors = useMemo(() => {
    const vendorSet = new Set(assets.map(asset => asset.vendor).filter(Boolean));
    return Array.from(vendorSet).sort();
  }, [assets]);

  const protocols = useMemo(() => {
    const protocolSet = new Set(assets.map(asset => asset.eth_proto).filter(Boolean));
    return Array.from(protocolSet).sort();
  }, [assets]);

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = searchTerm === "" || 
        asset.mac_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.device_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.src_ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ip_address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDeviceType = filters.deviceType === "" || asset.device_type === filters.deviceType;
      const matchesVendor = filters.vendor === "" || asset.vendor === filters.vendor;
      const matchesProtocol = filters.protocol === "" || asset.eth_proto === filters.protocol;
      
      // IP Range filtering (simplified - checks if IP starts with range)
      const matchesIpRange = filters.ipRange === "" || 
        (asset.src_ip && asset.src_ip.startsWith(filters.ipRange)) ||
        (asset.ip_address && asset.ip_address.startsWith(filters.ipRange));

      return matchesSearch && matchesDeviceType && matchesVendor && matchesProtocol && matchesIpRange;
    });
  }, [assets, searchTerm, filters]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAssetSelect = (macAddress: string, selected: boolean) => {
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(macAddress);
      } else {
        newSet.delete(macAddress);
      }
      return newSet;
    });
  };

  const handleSelectAll = (assetsToSelect: any[]) => {
    const macAddresses = assetsToSelect.map(asset => asset.mac_address);
    setSelectedAssets(prev => {
      const newSet = new Set(prev);
      macAddresses.forEach(mac => newSet.add(mac));
      return newSet;
    });
  };

  const handleSelectAllVisible = () => {
    const allMacs = filteredAssets.map(asset => asset.mac_address);
    setSelectedAssets(new Set(allMacs));
  };

  const handleClearSelection = () => {
    setSelectedAssets(new Set());
  };

  const getSelectAllStatus = () => {
    if (selectedAssets.size === 0) return "none";
    if (selectedAssets.size === filteredAssets.length && filteredAssets.length > 0) return "all";
    return "some";
  };

  const handleSelectAllChange = () => {
    const status = getSelectAllStatus();
    if (status === "all") {
      handleClearSelection();
    } else {
      handleSelectAllVisible();
    }
  };

  // Bulk action handlers
  const handleReclassify = (newType: string) => {
    toast({
      title: "Reclassify Assets",
      description: `Reclassifying ${selectedAssets.size} assets to ${newType}`,
    });
    // TODO: Implement actual reclassification logic
    console.log("Reclassifying assets:", Array.from(selectedAssets), "to type:", newType);
  };

  const handleDelete = () => {
    toast({
      title: "Delete Assets",
      description: `Deleting ${selectedAssets.size} assets`,
      variant: "destructive",
    });
    // TODO: Implement actual deletion logic
    console.log("Deleting assets:", Array.from(selectedAssets));
  };

  const handleMarkSafe = () => {
    toast({
      title: "Mark Assets Safe",
      description: `Marking ${selectedAssets.size} assets as safe`,
    });
    // TODO: Implement actual mark safe logic
    console.log("Marking assets as safe:", Array.from(selectedAssets));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">Loading asset inventory...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-64 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground text-red-600">
            Error loading assets: {error instanceof Error ? error.message : 'Unknown error'}
          </p>
        </div>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assets</h1>
          <p className="text-muted-foreground">
            {assets.length} assets discovered across your network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => refetch()} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets by MAC, name, vendor, type, or IP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <AssetFilters
        filters={filters}
        onFiltersChange={setFilters}
        deviceTypes={deviceTypes}
        vendors={vendors}
        protocols={protocols}
      />

      <AssetBulkActions
        selectedCount={selectedAssets.size}
        onReclassify={handleReclassify}
        onDelete={handleDelete}
        onMarkSafe={handleMarkSafe}
        onClearSelection={handleClearSelection}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="tree">Tree View by Type</TabsTrigger>
          <TabsTrigger value="toptalkers">Top Talkers</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredAssets.length > 0 && (
            <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/20">
              <Checkbox
                checked={getSelectAllStatus() === "all"}
                ref={(el) => {
                  if (el && 'indeterminate' in el) {
                    (el as any).indeterminate = getSelectAllStatus() === "some";
                  }
                }}
                onCheckedChange={handleSelectAllChange}
              />
              <span className="text-sm">
                Select all {filteredAssets.length} visible assets
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAssets.map((asset) => {
              // Get IP address from src_ip or ip_address
              const ipAddress = asset.src_ip || asset.ip_address;
              
              return (
                <Card key={asset.mac_address} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedAssets.has(asset.mac_address)}
                          onCheckedChange={(checked) => handleAssetSelect(asset.mac_address, !!checked)}
                        />
                        <div className="flex-1">
                          <CardTitle className="text-base flex items-center gap-2">
                            <span className="font-mono">{asset.mac_address}</span>
                            {asset.name && (
                              <Badge variant="secondary" className="text-xs">
                                {asset.name}
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {asset.device_type || "Unknown Device Type"}
                            {asset.vendor && ` • ${asset.vendor}`}
                          </CardDescription>
                        </div>
                      </div>
                      <Link to={`/assets/${asset.mac_address}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Network Information */}
                    <div className="space-y-2">
                      {ipAddress && (
                        <div className="flex items-center gap-2 text-sm">
                          <Activity className="h-4 w-4 text-blue-500" />
                          <span className="text-muted-foreground">IP:</span>
                          <span className="font-mono">{ipAddress}</span>
                        </div>
                      )}
                      
                      {asset.eth_proto && (
                        <div className="flex items-center gap-2 text-sm">
                          <Wifi className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">Protocol:</span>
                          <span>{asset.eth_proto}</span>
                        </div>
                      )}
                    </div>

                    {/* Activity Information */}
                    {(asset.download_bps || asset.upload_bps || asset.usage_mb) && (
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        {asset.download_bps !== undefined && asset.download_bps > 0 && (
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3 text-blue-500" />
                            <span>{formatBytes(asset.download_bps)}/s</span>
                          </div>
                        )}
                        {asset.upload_bps !== undefined && asset.upload_bps > 0 && (
                          <div className="flex items-center gap-1">
                            <Upload className="h-3 w-3 text-green-500" />
                            <span>{formatBytes(asset.upload_bps)}/s</span>
                          </div>
                        )}
                        {asset.usage_mb !== undefined && asset.usage_mb > 0 && (
                          <div className="text-muted-foreground">
                            {asset.usage_mb} MB total
                          </div>
                        )}
                      </div>
                    )}

                    {/* Connection Info */}
                    {(asset.connection || asset.network || asset.wifi) && (
                      <div className="flex flex-wrap gap-1">
                        {asset.connection && (
                          <Badge variant="outline" className="text-xs">{asset.connection}</Badge>
                        )}
                        {asset.network && (
                          <Badge variant="outline" className="text-xs">{asset.network}</Badge>
                        )}
                        {asset.wifi && (
                          <Badge variant="outline" className="text-xs">WiFi: {asset.wifi}</Badge>
                        )}
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="text-xs text-muted-foreground space-y-1">
                      {asset.first_seen && (
                        <div>First seen: {formatDate(asset.first_seen)}</div>
                      )}
                      {asset.last_seen && (
                        <div>Last seen: {formatDate(asset.last_seen)}</div>
                      )}
                    </div>

                    {/* Experience Badge */}
                    {asset.experience && (
                      <div className="flex justify-end">
                        <Badge 
                          variant={
                            asset.experience === 'Excellent' ? 'default' :
                            asset.experience === 'Good' ? 'secondary' :
                            asset.experience === 'Fair' ? 'outline' : 'destructive'
                          }
                          className="text-xs"
                        >
                          {asset.experience}
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No assets found matching your criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="tree" className="space-y-4">
          <AssetTreeView
            assets={filteredAssets}
            selectedAssets={selectedAssets}
            onAssetSelect={handleAssetSelect}
            onSelectAll={handleSelectAll}
          />
        </TabsContent>

        <TabsContent value="toptalkers" className="space-y-4">
          <TopTalkersView assets={filteredAssets} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assets;
