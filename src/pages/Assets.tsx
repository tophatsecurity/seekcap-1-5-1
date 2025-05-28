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
import { Eye, Search, ArrowUpDown, Settings } from "lucide-react";
import { AssetDataViewer } from "@/components/AssetDataViewer";
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

type Column = {
  id: string;
  label: string;
  accessor: (asset: any) => string | React.ReactNode;
  sortable: boolean;
  visible: boolean;
};

const Assets = () => {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredAndSortedAssets = useMemo(() => {
    // Log first few assets to debug
    if (assets.length > 0) {
      console.log("Sample assets data:", assets.slice(0, 3));
    }
    
    let filteredAssets = assets.filter((asset) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        asset.mac_address.toLowerCase().includes(searchLower) ||
        (asset.name && asset.name.toLowerCase().includes(searchLower)) ||
        (asset.src_ip && asset.src_ip.toLowerCase().includes(searchLower)) ||
        (asset.ip_address && asset.ip_address.toLowerCase().includes(searchLower)) ||
        (asset.device_type && asset.device_type.toLowerCase().includes(searchLower)) ||
        (asset.vendor && asset.vendor.toLowerCase().includes(searchLower)) ||
        (asset.eth_proto && asset.eth_proto.toLowerCase().includes(searchLower))
      );
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
  }, [assets, searchTerm, sortConfig]);

  const visibleColumns = columns.filter(column => column.visible);

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
                column.id !== 'actions' && (
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
      
      <div className="rounded-md border bg-card">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading assets...</p>
          </div>
        ) : filteredAndSortedAssets.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-muted-foreground">No assets found</p>
            {searchTerm && (
              <Button 
                variant="link" 
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.map((column) => (
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
                  {visibleColumns.map((column) => (
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
      
      {jsonData && (
        <AssetDataViewer title="Assets from JSON Import" />
      )}
    </div>
  );
};

export default Assets;
