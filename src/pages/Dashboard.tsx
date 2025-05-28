
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets, importAssetData } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AssetDataViewer } from "@/components/AssetDataViewer";
import { useJsonData } from "@/context/JsonDataContext";
import { NetworkMap } from "@/components/NetworkMap";
import { generateSampleAssets } from "@/utils/sampleDataGenerator";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { ProtocolsSection } from "@/components/dashboard/ProtocolsSection";
import { SystemInfo } from "@/components/dashboard/SystemInfo";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const { data: dbAssets = [], isLoading, error, refetch } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);

  const { jsonData } = useJsonData();

  // Use sample data if no real data is available or if explicitly requested
  const assets = useSampleData || dbAssets.length === 0 ? generateSampleAssets() : dbAssets;

  const { assetTypes, protocols, subnets, scadaInfo, ouiInfo } = useDashboardData(assets);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a JSON file to import",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const fileContent = await selectedFile.text();
      const assetsData = JSON.parse(fileContent);
      
      const result = await importAssetData(assetsData);
      
      if (result.success) {
        toast({
          title: "Import successful",
          description: `Imported ${result.count} assets`,
        });
        refetch();
        setSelectedFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(result.error instanceof Error ? result.error.message : "Unknown error");
      }
    } catch (error) {
      console.error("Error importing data:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Failed to import the data file",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <Card className="p-6">
          <div className="text-center text-destructive">
            <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
            <p>{error instanceof Error ? error.message : "Failed to load asset data"}</p>
            <Button 
              onClick={() => refetch()} 
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader
        useSampleData={useSampleData}
        setUseSampleData={setUseSampleData}
        selectedFile={selectedFile}
        importing={importing}
        handleFileChange={handleFileChange}
        handleImport={handleImport}
      />

      {selectedFile && (
        <div className="bg-muted p-3 rounded-md flex items-center gap-2">
          <span>Selected file: {selectedFile.name}</span>
        </div>
      )}

      {isLoading && !useSampleData ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-4">
          <div className="animate-spin">
            <Loader className="h-12 w-12 text-primary" />
          </div>
          <div className="text-xl text-center text-muted-foreground animate-pulse">
            <p>Getting things ready...</p>
            <p className="font-bold text-2xl text-primary mt-2">HOOAH!</p>
          </div>
        </div>
      ) : assets.length === 0 && !useSampleData ? (
        <Card className="p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">No Assets Found</h2>
            <p className="text-muted-foreground mb-4">Import data using the button above or use sample data to get started</p>
            <div className="flex justify-center gap-2">
              <Button onClick={() => setUseSampleData(true)}>
                Use Sample Data
              </Button>
              <label htmlFor="file-upload">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import Data
                </Button>
              </label>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <MetricsCards
            totalAssets={assets.length}
            activeAssets={assets.filter(a => new Date(a.last_seen) > new Date(Date.now() - 86400000)).length}
            scadaDevices={assetTypes.reduce((acc, item) => acc + item.count, 0)}
            useSampleData={useSampleData}
          />

          <NetworkMap assets={assets} />

          <ChartsSection ouiInfo={ouiInfo} subnets={subnets} />

          <ProtocolsSection assetTypes={assetTypes} protocols={protocols} scadaInfo={scadaInfo} />

          <SystemInfo />
        </>
      )}

      {jsonData && (
        <AssetDataViewer title="Recent JSON Import" />
      )}
    </div>
  );
};

export default Dashboard;
