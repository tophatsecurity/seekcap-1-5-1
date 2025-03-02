
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson } from "lucide-react";
import { useJsonData } from "@/context/JsonDataContext";
import { JsonFileImporter } from "@/components/JsonFileImporter";
import { JsonTreeView } from "@/components/JsonTreeView";
import { JsonDataLoader } from "@/components/JsonDataLoader";

const Data = () => {
  const { treeData, setTreeData } = useJsonData();

  return (
    <div className="container mx-auto p-4">
      <JsonDataLoader />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Import JSON Data</CardTitle>
          <CardDescription>Upload JSON files to visualize and analyze their structure</CardDescription>
        </CardHeader>
        <CardContent>
          <JsonFileImporter />
        </CardContent>
      </Card>

      {treeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              JSON Structure
            </CardTitle>
            <JsonTreeView treeData={treeData} setTreeData={setTreeData} />
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default Data;
