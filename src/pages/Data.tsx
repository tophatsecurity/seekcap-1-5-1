
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson } from "lucide-react";
import { useJsonData } from "@/context/JsonDataContext";
import { AssetFileImporter } from "@/components/AssetFileImporter";
import { JsonTreeView } from "@/components/JsonTreeView";
import { AssetDataLoader } from "@/components/AssetDataLoader";

const Data = () => {
  const { treeData, setTreeData } = useJsonData();

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
