
import { useState, useEffect } from "react";
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
import { Eye, Search, AlertCircle } from "lucide-react";
import { JsonDataViewer } from "@/components/JsonDataViewer";
import { useJsonData } from "@/context/JsonDataContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Assets = () => {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  const { jsonData, bannersData } = useJsonData();
  const [combinedAssets, setCombinedAssets] = useState<any[]>([]);
  
  // Combine database assets with banner data
  useEffect(() => {
    if (bannersData) {
      // Create combined assets from banners data
      const bannersAssets = Object.entries(bannersData).map(([mac, details]: [string, any]) => {
        // Get first record for simplicity (can be enhanced to show more)
        const recordKey = Object.keys(details.records)[0];
        const firstRecord = recordKey ? details.records[recordKey] : null;
        
        return {
          mac_address: mac,
          src_ip: firstRecord?.src_ip || null,
          eth_proto: firstRecord?.protocol || null,
          hostname: details.hostname || null,
          service: firstRecord?.service || null,
          icmp: false, // Default value for banners data
          is_from_banners: true
        };
      });
      
      // Combine with database assets, prioritizing database records
      const dbMacs = new Set(assets.map(asset => asset.mac_address));
      const uniqueBannerAssets = bannersAssets.filter(asset => !dbMacs.has(asset.mac_address));
      
      setCombinedAssets([...assets, ...uniqueBannerAssets]);
    } else {
      setCombinedAssets(assets);
    }
  }, [assets, bannersData]);
  
  const filteredAssets = combinedAssets.filter((asset) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      asset.mac_address.toLowerCase().includes(searchLower) ||
      (asset.src_ip && asset.src_ip.toLowerCase().includes(searchLower)) ||
      (asset.eth_proto && asset.eth_proto.toLowerCase().includes(searchLower)) ||
      (asset.hostname && asset.hostname.toLowerCase().includes(searchLower)) ||
      (asset.service && asset.service.toLowerCase().includes(searchLower))
    );
  });
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assets</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {bannersData && (
        <Card className="bg-muted/50 border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
              Banners Data Imported
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {Object.keys(bannersData).length} MAC addresses loaded from banners.json
            </p>
          </CardContent>
        </Card>
      )}
      
      <div className="rounded-md border bg-card">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading assets...</p>
          </div>
        ) : filteredAssets.length === 0 ? (
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
                <TableHead>MAC Address</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Hostname</TableHead>
                <TableHead>First Seen</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.mac_address}>
                  <TableCell className="font-medium">
                    {asset.mac_address}
                    {asset.is_from_banners && (
                      <Badge variant="outline" className="ml-2 text-xs">Banner</Badge>
                    )}
                  </TableCell>
                  <TableCell>{asset.src_ip || "—"}</TableCell>
                  <TableCell>{asset.eth_proto || "—"}</TableCell>
                  <TableCell>{asset.service || "—"}</TableCell>
                  <TableCell>{asset.hostname || "—"}</TableCell>
                  <TableCell>{asset.first_seen ? formatDate(asset.first_seen) : "—"}</TableCell>
                  <TableCell>{asset.last_seen ? formatDate(asset.last_seen) : "—"}</TableCell>
                  <TableCell className="text-right">
                    <Link to={`/assets/${asset.mac_address}`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      
      {jsonData && (
        <JsonDataViewer title="Assets from JSON Import" />
      )}
    </div>
  );
};

export default Assets;
