
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson } from "lucide-react";
import { useJsonData } from "@/context/JsonDataContext";
import { AssetFileImporter } from "@/components/AssetFileImporter";
import { JsonTreeView } from "@/components/JsonTreeView";
import { AssetDataLoader } from "@/components/AssetDataLoader";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { importAssetData } from "@/lib/db/asset";

const Data = () => {
  const { treeData, setTreeData, jsonData } = useJsonData();
  const [isImporting, setIsImporting] = useState(false);

  // Function to import data to Supabase database
  const handlePublishData = async () => {
    if (!jsonData) {
      toast({
        title: "No data to publish",
        description: "Please import or load asset data first",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const result = await importAssetData(jsonData);
      if (result.success) {
        toast({
          title: "Data published successfully",
          description: `${result.count} assets have been published to the database`,
        });
      } else {
        toast({
          title: "Error publishing data",
          description: "There was an issue publishing the asset data",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error publishing data:", error);
      toast({
        title: "Error publishing data",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <AssetDataLoader />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Import Asset Data</CardTitle>
          <CardDescription>Upload asset files to visualize and analyze their structure</CardDescription>
        </CardHeader>
        <CardContent>
          <AssetFileImporter />
          
          {jsonData && (
            <div className="mt-4">
              <Button 
                onClick={handlePublishData} 
                disabled={isImporting}
                className="w-full md:w-auto"
              >
                {isImporting ? "Publishing..." : "Publish Data to Database"}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will publish the currently loaded data to the database for use throughout the application.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {treeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              Asset Structure
            </CardTitle>
            <JsonTreeView treeData={treeData} setTreeData={setTreeData} />
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default Data;
