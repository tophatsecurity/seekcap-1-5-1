
import { useState } from "react";
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
import { Eye, Search } from "lucide-react";

const Assets = () => {
  const { data: assets = [], isLoading } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredAssets = assets.filter((asset) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      asset.mac_address.toLowerCase().includes(searchLower) ||
      (asset.src_ip && asset.src_ip.toLowerCase().includes(searchLower)) ||
      (asset.eth_proto && asset.eth_proto.toLowerCase().includes(searchLower))
    );
  });

  // Function to format the date
  const formatDate = (dateString: string) => {
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
                <TableHead>ICMP</TableHead>
                <TableHead>First Seen</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.map((asset) => (
                <TableRow key={asset.mac_address}>
                  <TableCell className="font-medium">{asset.mac_address}</TableCell>
                  <TableCell>{asset.src_ip || "—"}</TableCell>
                  <TableCell>{asset.eth_proto || "—"}</TableCell>
                  <TableCell>{asset.icmp ? "Yes" : "No"}</TableCell>
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
    </div>
  );
};

export default Assets;
