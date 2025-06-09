
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "@/lib/supabase";
import { AssetType } from "@/lib/types";
import { Asset } from "@/lib/db/types";
import { generateDetailedSampleAssets } from "@/utils/generators/assetGenerator";

export const useAssetData = () => {
  const { data: dbAssets = [], isLoading, error } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);

  // Use sample data with 1812 assets if no real data is available
  const sampleAssets = dbAssets.length === 0 ? generateDetailedSampleAssets() : [];
  const assets: Asset[] = dbAssets.length === 0 ? sampleAssets : dbAssets;

  useEffect(() => {
    if (assets && assets.length > 0) {
      const types = assets.reduce((acc: Record<string, number>, asset) => {
        const type = asset.device_type || 'Unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      
      const sortedTypes = Object.entries(types)
        .map(([type, count]) => ({ type, count: count as number }))
        .sort((a, b) => b.count - a.count);
      
      setAssetTypes(sortedTypes);
    }
  }, [assets]);

  // Count Rockwell/Allen-Bradley devices
  const rockwellCount = assets.filter(asset => 
    asset.vendor?.includes("Rockwell") || asset.vendor?.includes("Allen-Bradley")
  ).length;

  // Count Modbus devices
  const modbusCount = assets.filter(asset => 
    ('scada_protocols' in asset && asset.scada_protocols?.some(protocol => protocol.includes("Modbus"))) ||
    asset.eth_proto?.includes("Modbus")
  ).length;

  return {
    assets,
    assetTypes,
    rockwellCount,
    modbusCount,
    isLoading,
    error
  };
};
