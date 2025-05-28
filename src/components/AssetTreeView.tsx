
import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface Asset {
  mac_address: string;
  name?: string;
  device_type?: string;
  src_ip?: string;
  ip_address?: string;
  vendor?: string;
  first_seen?: string;
  last_seen?: string;
  eth_proto?: string;
}

interface AssetTreeNode {
  type: string;
  count: number;
  assets: Asset[];
  isExpanded: boolean;
}

interface AssetTreeViewProps {
  assets: Asset[];
  selectedAssets: Set<string>;
  onAssetSelect: (macAddress: string, selected: boolean) => void;
  onSelectAll: (assets: Asset[]) => void;
}

export const AssetTreeView = ({ 
  assets, 
  selectedAssets, 
  onAssetSelect, 
  onSelectAll 
}: AssetTreeViewProps) => {
  const [expandedTypes, setExpandedTypes] = useState<Set<string>>(new Set());

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const assetsByType = useMemo(() => {
    const grouped = assets.reduce((acc, asset) => {
      const type = asset.device_type || "Unknown";
      if (!acc[type]) {
        acc[type] = {
          type,
          count: 0,
          assets: [],
          isExpanded: expandedTypes.has(type),
        };
      }
      acc[type].assets.push(asset);
      acc[type].count++;
      return acc;
    }, {} as Record<string, AssetTreeNode>);

    return Object.values(grouped).sort((a, b) => b.count - a.count);
  }, [assets, expandedTypes]);

  const toggleTypeExpansion = (type: string) => {
    setExpandedTypes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const getTypeSelectStatus = (typeAssets: Asset[]) => {
    const selectedCount = typeAssets.filter(asset => selectedAssets.has(asset.mac_address)).length;
    if (selectedCount === 0) return "none";
    if (selectedCount === typeAssets.length) return "all";
    return "some";
  };

  const handleTypeSelect = (typeAssets: Asset[], currentStatus: string) => {
    if (currentStatus === "all") {
      // Deselect all in this type
      typeAssets.forEach(asset => onAssetSelect(asset.mac_address, false));
    } else {
      // Select all in this type
      onSelectAll(typeAssets);
    }
  };

  return (
    <div className="space-y-2">
      {assetsByType.map((typeNode) => {
        const isExpanded = expandedTypes.has(typeNode.type);
        const selectStatus = getTypeSelectStatus(typeNode.assets);
        
        return (
          <div key={typeNode.type} className="border rounded-lg">
            <Collapsible open={isExpanded} onOpenChange={() => toggleTypeExpansion(typeNode.type)}>
              <div className="flex items-center justify-between p-4 hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectStatus === "all"}
                    ref={(el) => {
                      if (el && 'indeterminate' in el) {
                        (el as any).indeterminate = selectStatus === "some";
                      }
                    }}
                    onCheckedChange={() => handleTypeSelect(typeNode.assets, selectStatus)}
                  />
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Badge variant="outline" className="text-sm">
                    {typeNode.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    ({typeNode.count} {typeNode.count === 1 ? 'asset' : 'assets'})
                  </span>
                </div>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </Button>
                </CollapsibleTrigger>
              </div>
              
              <CollapsibleContent>
                <div className="border-t">
                  {typeNode.assets.map((asset) => (
                    <div 
                      key={asset.mac_address} 
                      className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-muted/25"
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={selectedAssets.has(asset.mac_address)}
                          onCheckedChange={(checked) => onAssetSelect(asset.mac_address, !!checked)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-sm font-medium">
                              {asset.mac_address}
                            </span>
                            {asset.name && (
                              <span className="text-sm">{asset.name}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {(asset.src_ip || asset.ip_address) && (
                              <span>
                                IP: {asset.src_ip || asset.ip_address}
                              </span>
                            )}
                            {asset.vendor && (
                              <span>Vendor: {asset.vendor}</span>
                            )}
                            {asset.eth_proto && (
                              <span>Protocol: {asset.eth_proto}</span>
                            )}
                            {asset.first_seen && (
                              <span>First seen: {formatDate(asset.first_seen)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Link to={`/assets/${asset.mac_address}`}>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      })}
    </div>
  );
};
