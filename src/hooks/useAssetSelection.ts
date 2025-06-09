
import { useState } from "react";

export const useAssetSelection = () => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);

  const handleAssetSelect = (macAddress: string) => {
    setSelectedAssets(prev => 
      prev.includes(macAddress) 
        ? prev.filter(mac => mac !== macAddress)
        : [...prev, macAddress]
    );
  };

  const handleSelectAll = (allAssets: { mac_address: string }[]) => {
    if (selectedAssets.length === allAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(allAssets.map(asset => asset.mac_address));
    }
  };

  const handleReclassify = (newType: string) => {
    console.log(`Reclassifying ${selectedAssets.length} assets to ${newType}`);
    setSelectedAssets([]);
  };

  const handleDelete = () => {
    console.log(`Deleting ${selectedAssets.length} assets`);
    setSelectedAssets([]);
  };

  const handleMarkSafe = () => {
    console.log(`Marking ${selectedAssets.length} assets as safe`);
    setSelectedAssets([]);
  };

  return {
    selectedAssets,
    handleAssetSelect,
    handleSelectAll,
    handleReclassify,
    handleDelete,
    handleMarkSafe,
    setSelectedAssets
  };
};
