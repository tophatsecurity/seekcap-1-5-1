import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAssets } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Search, ArrowUpDown, Settings } from "lucide-react";
import { AssetDataViewer } from "@/components/AssetDataViewer";
import { AssetTreeView } from "@/components/AssetTreeView";
import { AssetFilters } from "@/components/AssetFilters";
import { AssetBulkActions } from "@/components/AssetBulkActions";
import { useJsonData } from "@/context/JsonDataContext";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

type Column = {
  id: string;
  label: string;
  accessor: (asset: any) => string | React.ReactNode;
  sortable: boolean;
  visible: boolean;
};

interface FilterState {
  deviceType: string;
  vendor: string;
  protocol: string;
  ipRange: string;
}

const Assets = () => {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssets, setSelectedAssets] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    deviceType: "",
    vendor: "",
    protocol: "",
    ipRange: "",
  });
  const { jsonData } = useJsonData();
  
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc' | null;
  }>({
    key: null,
    direction: null,
  });
  
  const [columns, setColumns] = useState<Column[]>([
    { 
      id: 'select', 
      label: '', 
      accessor: (asset) => (
        <Checkbox
          checked={selectedAssets.has(asset.mac_address)}
          onCheckedChange={(checked) => handleAssetSelect(asset.mac_address, !!checked)}
        />
      ),
      sortable: false,
      visible: true,
    },
    { 
      id: 'mac_address', 
      label: 'MAC Address', 
      accessor: (asset) => asset.mac_address,
      sortable: true,
      visible: true,
    },
    { 
      id: 'name', 
      label: 'Name', 
      accessor: (asset) => asset.name || "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'device_type', 
      label: 'Device Type', 
      accessor: (asset) => asset.device_type ? (
        <Badge variant="outline" className="text-xs">
          {asset.device_type}
        </Badge>
      ) : "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'ip_addresses', 
      label: 'IP Addresses', 
      accessor: (asset) => {
        const ips = [];
        
        // Check all possible IP address fields
        if (asset.src_ip) ips.push(asset.src_ip);
        if (asset.ip_address && asset.ip_address !== asset.src_ip) ips.push(asset.ip_address);
        
        console.log(`Asset ${asset.mac_address} IP data:`, {
          src_ip: asset.src_ip,
          ip_address: asset.ip_address,
          collected_ips: ips
        });
        
        return ips.length > 0 ? (
          <div className="flex flex-col gap-1">
            {ips.map((ip, index) => (
              <span key={index} className="text-sm font-mono">{ip}</span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      sortable: true,
      visible: true,
    },
    { 
      id: 'protocols', 
      label: 'Protocols', 
      accessor: (asset) => {
        const protocols = [];
        if (asset.eth_proto) protocols.push(asset.eth_proto);
        
        return protocols.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {protocols.map((protocol, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {protocol}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      sortable: false,
      visible: true,
    },
    { 
      id: 'vendor', 
      label: 'Vendor', 
      accessor: (asset) => asset.vendor || "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'first_seen', 
      label: 'First Seen', 
      accessor: (asset) => asset.first_seen ? formatDate(asset.first_seen) : "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'last_seen', 
      label: 'Last Seen', 
      accessor: (asset) => asset.last_seen ? formatDate(asset.last_seen) : "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'actions', 
      label: 'Actions', 
      accessor: (asset) => (
        <Link to={`/assets/${asset.mac_address}`}>
          <Button variant="ghost" size="icon">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
      ),
      sortable: false,
      visible: true,
    },
  ]);

  const toggleColumnVisibility = (columnId: string) => {
    setColumns(prev => 
      prev.map(column => 
        column.id === columnId 
          ? { ...column, visible: !column.visible } 
          : column
      )
    );
  };
  
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({ key, direction });
  };
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
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
    const visibleMacs = filteredAndSortedAssets.map(asset => asset.mac_address);
    const allSelected = visibleMacs.every(mac => selectedAssets.has(mac));
    
    if (allSelected) {
      // Deselect all visible
      setSelectedAssets(prev => {
        const newSet = new Set(prev);
        visibleMacs.forEach(mac => newSet.delete(mac));
        return newSet;
      });
    } else {
      // Select all visible
      setSelectedAssets(prev => {
        const newSet = new Set(prev);
        visibleMacs.forEach(mac => newSet.add(mac));
        return newSet;
      });
    }
  };

  const handleBulkReclassify = (newType: string) => {
    console.log(`Reclassifying ${selectedAssets.size} assets to ${newType}`);
    // TODO: Implement actual reclassification logic
    setSelectedAssets(new Set());
  };

  const handleBulkDelete = () => {
    console.log(`Deleting ${selectedAssets.size} assets`);
    // TODO: Implement actual deletion logic
    setSelectedAssets(new Set());
  };

  const handleBulkMarkSafe = () => {
    console.log(`Marking ${selectedAssets.size} assets as safe`);
    // TODO: Implement actual mark safe logic
    setSelectedAssets(new Set());
  };

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    // Log first few assets to debug
    if (assets.length > 0) {
      console.log("Sample assets data:", assets.slice(0, 3));
    }
    
    let filteredAssets = assets.filter((asset) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = (
        asset.mac_address.toLowerCase().includes(searchLower) ||
        (asset.name && asset.name.toLowerCase().includes(searchLower)) ||
        (asset.src_ip && asset.src_ip.toLowerCase().includes(searchLower)) ||
        (asset.ip_address && asset.ip_address.toLowerCase().includes(searchLower)) ||
        (asset.device_type && asset.device_type.toLowerCase().includes(searchLower)) ||
        (asset.vendor && asset.vendor.toLowerCase().includes(searchLower)) ||
        (asset.eth_proto && asset.eth_proto.toLowerCase().includes(searchLower))
      );

      const matchesFilters = (
        (!filters.deviceType || asset.device_type === filters.deviceType) &&
        (!filters.vendor || asset.vendor === filters.vendor) &&
        (!filters.protocol || asset.eth_proto === filters.protocol) &&
        (!filters.ipRange || 
          (asset.src_ip && asset.src_ip.includes(filters.ipRange)) ||
          (asset.ip_address && asset.ip_address.includes(filters.ipRange))
        )
      );

      return matchesSearch && matchesFilters;
    });
    
    if (sortConfig.key && sortConfig.direction) {
      filteredAssets = [...filteredAssets].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        const aString = typeof aValue === 'string' ? aValue : String(aValue || '');
        const bString = typeof bValue === 'string' ? bValue : String(bValue || '');
        
        if (sortConfig.direction === 'asc') {
          return aString.localeCompare(bString);
        } else {
          return bString.localeCompare(aString);
        }
      });
    }
    
    return filteredAssets;
  }, [assets, searchTerm, sortConfig, filters]);

  // Get unique values for filters
  const uniqueDeviceTypes = useMemo(() => 
    [...new Set(assets.map(asset => asset.device_type).filter(Boolean))].sort(),
    [assets]
  );

  const uniqueVendors = useMemo(() => 
    [...new Set(assets.map(asset => asset.vendor).filter(Boolean))].sort(),
    [assets]
  );

  const uniqueProtocols = useMemo(() => 
    [...new Set(assets.map(asset => asset.eth_proto).filter(Boolean))].sort(),
    [assets]
  );

  const visibleColumns = columns.filter(column => column.visible);
  const visibleMacs = filteredAndSortedAssets.map(asset => asset.mac_address);
  const allVisibleSelected = visibleMacs.length > 0 && visibleMacs.every(mac => selectedAssets.has(mac));
  const someVisibleSelected = visibleMacs.some(mac => selectedAssets.has(mac));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assets</h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background">
              <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {columns.map((column) => (
                column.id !== 'actions' && column.id !== 'select' && (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.visible}
                    onCheckedChange={() => toggleColumnVisibility(column.id)}
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                )
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AssetFilters
        filters={filters}
        onFiltersChange={setFilters}
        deviceTypes={uniqueDeviceTypes}
        vendors={uniqueVendors}
        protocols={uniqueProtocols}
      />

      <AssetBulkActions
        selectedCount={selectedAssets.size}
        onReclassify={handleBulkReclassify}
        onDelete={handleBulkDelete}
        onMarkSafe={handleBulkMarkSafe}
        onClearSelection={() => setSelectedAssets(new Set())}
      />
      
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Table View</TabsTrigger>
          <TabsTrigger value="tree">Tree View by Type</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="space-y-4">
          <div className="rounded-md border bg-card">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <p>Loading assets...</p>
              </div>
            ) : filteredAndSortedAssets.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-64">
                <p className="text-muted-foreground">No assets found</p>
                {(searchTerm || Object.values(filters).some(f => f)) && (
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({ deviceType: "", vendor: "", protocol: "", ipRange: "" });
                    }}
                    className="mt-2"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allVisibleSelected}
                        ref={(el) => {
                          if (el) el.indeterminate = someVisibleSelected && !allVisibleSelected;
                        }}
                        onCheckedChange={handleSelectAllVisible}
                      />
                    </TableHead>
                    {visibleColumns.slice(1).map((column) => (
                      <TableHead key={column.id}>
                        {column.sortable ? (
                          <Button 
                            variant="ghost" 
                            className="flex items-center gap-1 -ml-4 font-medium h-8"
                            onClick={() => requestSort(column.id)}
                          >
                            {column.label}
                            <ArrowUpDown className={`ml-1 h-3 w-3 ${
                              sortConfig.key === column.id 
                                ? 'opacity-100' 
                                : 'opacity-50'
                            } ${
                              sortConfig.key === column.id && sortConfig.direction === 'desc'
                                ? 'rotate-180 transition-transform'
                                : ''
                            }`} />
                          </Button>
                        ) : (
                          <div className={column.id === 'actions' ? "text-right" : ""}>
                            {column.label}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedAssets.map((asset) => (
                    <TableRow key={asset.mac_address}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAssets.has(asset.mac_address)}
                          onCheckedChange={(checked) => handleAssetSelect(asset.mac_address, !!checked)}
                        />
                      </TableCell>
                      {visibleColumns.slice(1).map((column) => (
                        <TableCell 
                          key={`${asset.mac_address}-${column.id}`} 
                          className={column.id === 'mac_address' ? "font-medium" : column.id === 'actions' ? "text-right" : ""}
                        >
                          {column.accessor(asset)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="tree" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading assets...</p>
            </div>
          ) : filteredAndSortedAssets.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-muted-foreground">No assets found</p>
              {(searchTerm || Object.values(filters).some(f => f)) && (
                <Button 
                  variant="link" 
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ deviceType: "", vendor: "", protocol: "", ipRange: "" });
                  }}
                  className="mt-2"
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <AssetTreeView
              assets={filteredAndSortedAssets}
              selectedAssets={selectedAssets}
              onAssetSelect={handleAssetSelect}
              onSelectAll={handleSelectAll}
            />
          )}
        </TabsContent>
      </Tabs>
      
      {jsonData && (
        <AssetDataViewer title="Assets from JSON Import" />
      )}
    </div>
  );
};

export default Assets;
