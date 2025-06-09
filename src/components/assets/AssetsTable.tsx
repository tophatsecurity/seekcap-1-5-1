
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, ArrowUp, ArrowDown } from "lucide-react";
import { Asset } from "@/lib/db/types";
import { SortField, SortDirection } from "@/hooks/useAssetSorting";

interface AssetsTableProps {
  assets: Asset[];
  selectedAssets: string[];
  onAssetSelect: (macAddress: string) => void;
  onSelectAll: () => void;
  onViewAsset: (asset: Asset) => void;
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}

export const AssetsTable = ({
  assets,
  selectedAssets,
  onAssetSelect,
  onSelectAll,
  onViewAsset,
  sortField,
  sortDirection,
  onSort
}: AssetsTableProps) => {
  const formatBandwidth = (bps?: number) => {
    if (!bps) return "0 bps";
    if (bps > 1000000000) return `${(bps / 1000000000).toFixed(1)} Gbps`;
    if (bps > 1000000) return `${(bps / 1000000).toFixed(1)} Mbps`;
    if (bps > 1000) return `${(bps / 1000).toFixed(1)} Kbps`;
    return `${bps} bps`;
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === 'desc') return <ArrowDown className="h-4 w-4" />;
    return null;
  };

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {getSortIcon(field)}
      </div>
    </TableHead>
  );

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
          <SortableHeader field="name">Name</SortableHeader>
          <SortableHeader field="ip_address">IP Address</SortableHeader>
          <SortableHeader field="mac_address">MAC Address</SortableHeader>
          <SortableHeader field="vendor">Vendor</SortableHeader>
          <SortableHeader field="device_type">Type</SortableHeader>
          <SortableHeader field="eth_proto">Protocol</SortableHeader>
          <SortableHeader field="download_bps">Download</SortableHeader>
          <SortableHeader field="upload_bps">Upload</SortableHeader>
          <SortableHeader field="last_seen">Last Seen</SortableHeader>
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
