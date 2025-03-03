
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchNetworkDevices, syncAssetsWithNetworkDevices } from "@/lib/db/network";
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
import { 
  Eye, Search, ArrowUpDown, Settings, RefreshCw, Wifi,
  Download, Upload, Activity, Signal, Cpu
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { NetworkDevice } from "@/lib/db/types";

type Column = {
  id: string;
  label: string;
  accessor: (device: NetworkDevice) => string | React.ReactNode;
  sortable: boolean;
  visible: boolean;
};

const NetworkDevices = () => {
  const { data: devices = [], isLoading, refetch } = useQuery({
    queryKey: ["network-devices"],
    queryFn: fetchNetworkDevices,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc' | null;
  }>({
    key: 'name',
    direction: 'asc',
  });
  
  const [columns, setColumns] = useState<Column[]>([
    { 
      id: 'name', 
      label: 'Name', 
      accessor: (device) => device.name,
      sortable: true,
      visible: true,
    },
    { 
      id: 'device_type', 
      label: 'Type', 
      accessor: (device) => (
        <Badge variant="outline" className="font-normal">
          {device.device_type || "—"}
        </Badge>
      ),
      sortable: true,
      visible: true,
    },
    { 
      id: 'application', 
      label: 'Application', 
      accessor: (device) => device.application || "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'status', 
      label: 'Status', 
      accessor: (device) => (
        <span className={device.status === 'Up to date' ? 'text-green-500' : 'text-amber-500'}>
          {device.status || "—"}
        </span>
      ),
      sortable: true,
      visible: true,
    },
    { 
      id: 'ip_address', 
      label: 'IP Address', 
      accessor: (device) => device.ip_address || "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'uplink', 
      label: 'Uplink', 
      accessor: (device) => device.uplink || "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'parent_device', 
      label: 'Parent Device', 
      accessor: (device) => device.parent_device || "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'connected', 
      label: 'Connected', 
      accessor: (device) => device.connected?.toString() || "0",
      sortable: true,
      visible: true,
    },
    { 
      id: 'experience', 
      label: 'Experience', 
      accessor: (device) => {
        if (!device.experience) return "—";
        if (device.experience === "Excellent") {
          return <span className="text-green-500">{device.experience}</span>;
        } else if (device.experience === "Poor") {
          return <span className="text-red-500">{device.experience}</span>;
        }
        return device.experience;
      },
      sortable: true,
      visible: true,
    },
    { 
      id: 'usage_24hr', 
      label: '24HR Usage', 
      accessor: (device) => device.usage_24hr || "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'download', 
      label: 'Download', 
      accessor: (device) => (
        <div className="flex items-center">
          <Download className="w-3 h-3 mr-1 text-blue-500" />
          {device.download || "—"}
        </div>
      ),
      sortable: true,
      visible: true,
    },
    { 
      id: 'upload', 
      label: 'Upload', 
      accessor: (device) => (
        <div className="flex items-center">
          <Upload className="w-3 h-3 mr-1 text-green-500" />
          {device.upload || "—"}
        </div>
      ),
      sortable: true,
      visible: true,
    },
    { 
      id: 'last_seen', 
      label: 'Last Seen', 
      accessor: (device) => device.last_seen ? formatDate(device.last_seen) : "—",
      sortable: true,
      visible: true,
    },
    { 
      id: 'actions', 
      label: 'Actions', 
      accessor: (device) => (
        <div className="flex justify-end">
          <Link to={`/network-devices/${device.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
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

  const handleSyncWithAssets = async () => {
    setIsUpdating(true);
    try {
      const result = await syncAssetsWithNetworkDevices();
      if (result.success) {
        toast({
          title: "Sync completed",
          description: `Synchronized asset data with network devices`,
        });
        refetch();
      }
    } catch (error) {
      console.error("Error syncing with assets:", error);
      toast({
        title: "Sync error",
        description: "Failed to sync assets with network devices",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredAndSortedDevices = useMemo(() => {
    let filteredDevices = devices.filter((device) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (device.name && device.name.toLowerCase().includes(searchLower)) ||
        (device.ip_address && device.ip_address.toLowerCase().includes(searchLower)) ||
        (device.device_type && device.device_type.toLowerCase().includes(searchLower)) ||
        (device.mac_address && device.mac_address.toLowerCase().includes(searchLower))
      );
    });
    
    if (sortConfig.key && sortConfig.direction) {
      filteredDevices = [...filteredDevices].sort((a, b) => {
        const aValue = a[sortConfig.key as keyof typeof a];
        const bValue = b[sortConfig.key as keyof typeof b];
        
        if (aValue === undefined || aValue === null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue === undefined || bValue === null) return sortConfig.direction === 'asc' ? 1 : -1;
        
        const aString = typeof aValue === 'string' ? aValue : String(aValue);
        const bString = typeof bValue === 'string' ? bValue : String(bValue);
        
        if (sortConfig.direction === 'asc') {
          return aString.localeCompare(bString);
        } else {
          return bString.localeCompare(aString);
        }
      });
    }
    
    return filteredDevices;
  }, [devices, searchTerm, sortConfig]);

  const visibleColumns = columns.filter(column => column.visible);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Wifi className="h-6 w-6" />
          Network Devices
        </h1>
        <div className="flex gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleSyncWithAssets}
            disabled={isUpdating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            Sync with Assets
          </Button>
          
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
            <p>Loading devices...</p>
          </div>
        ) : filteredAndSortedDevices.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <Cpu className="h-16 w-16 mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No network devices found</p>
            {searchTerm && (
              <Button 
                variant="link" 
                onClick={() => setSearchTerm("")}
                className="mt-2"
              >
                Clear search
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={handleSyncWithAssets}
              className="mt-4"
              disabled={isUpdating}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
              Sync with Assets
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                {filteredAndSortedDevices.map((device) => (
                  <TableRow key={device.id}>
                    {visibleColumns.map((column) => (
                      <TableCell 
                        key={`${device.id}-${column.id}`} 
                        className={column.id === 'name' ? "font-medium" : column.id === 'actions' ? "text-right" : ""}
                      >
                        {column.accessor(device)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
      
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          <p className="flex items-center">
            <Signal className="h-4 w-4 mr-2" />
            Network device information shows connection status and performance metrics for all connected network equipment
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkDevices;
