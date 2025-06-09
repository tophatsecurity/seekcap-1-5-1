
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetBulkActions } from "@/components/AssetBulkActions";
import { TopTalkersView } from "@/components/TopTalkersView";
import { DevicePortView } from "@/components/topology/DevicePortView";
import { Asset } from "@/lib/db/types";
import { AssetDetailModal } from "@/components/AssetDetailModal";
import { AssetsHeader } from "@/components/assets/AssetsHeader";
import { AssetsMetricsCards } from "@/components/assets/AssetsMetricsCards";
import { AssetsSearchAndFilter } from "@/components/assets/AssetsSearchAndFilter";
import { AssetsTable } from "@/components/assets/AssetsTable";
import { useAssetData } from "@/hooks/useAssetData";
import { useAssetFilters } from "@/hooks/useAssetFilters";
import { useAssetSelection } from "@/hooks/useAssetSelection";

const Assets = () => {
  const { assets, assetTypes, rockwellCount, modbusCount, isLoading, error } = useAssetData();
  const { searchTerm, setSearchTerm, filterType, setFilterType, filteredAssets } = useAssetFilters(assets);
  const { 
    selectedAssets, 
    handleAssetSelect, 
    handleSelectAll, 
    handleReclassify, 
    handleDelete, 
    handleMarkSafe,
    setSelectedAssets
  } = useAssetSelection();
  
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading assets: {error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AssetsHeader 
        totalAssets={assets.length}
        rockwellCount={rockwellCount}
        modbusCount={modbusCount}
      />

      <AssetsMetricsCards 
        assets={assets}
        rockwellCount={rockwellCount}
        modbusCount={modbusCount}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="top-talkers">Top Talkers</TabsTrigger>
          <TabsTrigger value="port-mappings">Port Mappings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <AssetsSearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filterType={filterType}
            onFilterChange={setFilterType}
            assetTypes={assetTypes}
          />

          {selectedAssets.length > 0 && (
            <AssetBulkActions
              selectedCount={selectedAssets.length}
              onReclassify={handleReclassify}
              onDelete={handleDelete}
              onMarkSafe={handleMarkSafe}
              onClearSelection={() => setSelectedAssets([])}
            />
          )}

          <Card>
            <CardHeader>
              <CardTitle>Assets ({filteredAssets.length})</CardTitle>
              <CardDescription>
                Network devices and their connection details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssetsTable
                assets={filteredAssets}
                selectedAssets={selectedAssets}
                onAssetSelect={handleAssetSelect}
                onSelectAll={() => handleSelectAll(filteredAssets)}
                onViewAsset={setSelectedAssetForDetail}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top-talkers">
          <TopTalkersView assets={assets} />
        </TabsContent>

        <TabsContent value="port-mappings">
          <DevicePortView networkDevices={[]} assets={assets} />
        </TabsContent>
      </Tabs>

      {selectedAssetForDetail && (
        <AssetDetailModal
          asset={selectedAssetForDetail}
          open={!!selectedAssetForDetail}
          onClose={() => setSelectedAssetForDetail(null)}
        />
      )}
    </div>
  );
};

export default Assets;
