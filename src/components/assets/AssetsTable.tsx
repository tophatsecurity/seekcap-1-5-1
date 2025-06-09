
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Asset } from "@/lib/db/types";

interface AssetsTableProps {
  assets: Asset[];
  selectedAssets: string[];
  onAssetSelect: (macAddress: string) => void;
  onSelectAll: () => void;
  onViewAsset: (asset: Asset) => void;
}

export const AssetsTable = ({
  assets,
  selectedAssets,
  onAssetSelect,
  onSelectAll,
  onViewAsset
}: AssetsTableProps) => {
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">
            <input
              type="checkbox"
              checked={selectedAssets.length === assets.length && assets.length > 0}
              onChange={onSelectAll}
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
        {assets.map((asset) => (
          <TableRow key={asset.mac_address}>
            <TableCell>
              <input
                type="checkbox"
                checked={selectedAssets.includes(asset.mac_address)}
                onChange={() => onAssetSelect(asset.mac_address)}
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
              <Badge variant="secondary">
                {asset.eth_proto || 
                 ('scada_protocols' in asset && asset.scada_protocols?.[0]) || 
                 'Unknown'}
              </Badge>
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
                onClick={() => onViewAsset(asset)}
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
