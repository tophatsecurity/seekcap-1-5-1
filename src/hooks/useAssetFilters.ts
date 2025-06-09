
import { useState, useMemo } from "react";
import { Asset } from "@/lib/db/types";

export const useAssetFilters = (assets: Asset[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.src_ip?.includes(searchTerm) ||
                           asset.mac_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           asset.vendor?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterType === "all" || asset.device_type === filterType;
      
      return matchesSearch && matchesFilter;
    });
  }, [assets, searchTerm, filterType]);

  return {
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    filteredAssets
  };
};
