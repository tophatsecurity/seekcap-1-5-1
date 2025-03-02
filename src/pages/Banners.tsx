
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
import { useJsonData } from "@/context/JsonDataContext";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Banners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { bannersData } = useJsonData();
  const [bannerAssets, setBannerAssets] = useState<any[]>([]);
  
  // Create assets from banners data
  useEffect(() => {
    if (bannersData) {
      // Transform banners data into asset-like format
      const assets = Object.entries(bannersData).map(([mac, details]: [string, any]) => {
        // Get first record for simplicity (can be enhanced to show more)
        const recordKey = Object.keys(details.records)[0];
        const firstRecord = recordKey ? details.records[recordKey] : null;
        
        return {
          mac_address: mac,
          src_ip: firstRecord?.src_ip || null,
          eth_proto: firstRecord?.protocol || null,
          hostname: details.hostname || null,
          service: firstRecord?.service || null,
          is_from_banners: true
        };
      });
      
      setBannerAssets(assets);
    } else {
      setBannerAssets([]);
    }
  }, [bannersData]);
  
  const filteredAssets = bannerAssets.filter((asset) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      asset.mac_address.toLowerCase().includes(searchLower) ||
      (asset.src_ip && asset.src_ip.toLowerCase().includes(searchLower)) ||
      (asset.eth_proto && asset.eth_proto.toLowerCase().includes(searchLower)) ||
      (asset.hostname && asset.hostname.toLowerCase().includes(searchLower)) ||
      (asset.service && asset.service.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Banners</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search banners..."
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
              Banners Data
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
        {!bannersData ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">No banners data available</p>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64">
            <p className="text-muted-foreground">No banners found</p>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.mac_address}>
                  <TableCell className="font-medium">
                    {asset.mac_address}
                    <Badge variant="outline" className="ml-2 text-xs">Banner</Badge>
                  </TableCell>
                  <TableCell>{asset.src_ip || "—"}</TableCell>
                  <TableCell>{asset.eth_proto || "—"}</TableCell>
                  <TableCell>{asset.service || "—"}</TableCell>
                  <TableCell>{asset.hostname || "—"}</TableCell>
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
    </div>
  );
};

export default Banners;
