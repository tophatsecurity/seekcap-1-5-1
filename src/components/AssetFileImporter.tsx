
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { useJsonData } from "@/context/JsonDataContext";
import { JsonTreeNode } from "./JsonTreeView";

interface JsonFileImporterProps {
  onImportSuccess?: () => void;
}

export const JsonFileImporter = ({ onImportSuccess }: JsonFileImporterProps) => {
  const { setJsonData, setTreeData, setBannersData } = useJsonData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const createJsonTree = (data: any, parentKey = "root"): JsonTreeNode[] => {
    if (!data) return [];
    
    if (Array.isArray(data)) {
      return [
        {
          key: parentKey,
          value: `Array(${data.length})`,
          type: "array",
          children: data.map((item, index) => {
            if (typeof item === "object" && item !== null) {
              return {
                key: `${parentKey}[${index}]`,
                value: Array.isArray(item) ? `Array(${item.length})` : "Object",
                type: Array.isArray(item) ? "array" : "object",
                children: createJsonTree(item, `${parentKey}[${index}]`),
                isExpanded: false,
              };
            } else {
              return {
                key: `${parentKey}[${index}]`,
                value: item,
                type: typeof item,
              };
            }
          }),
          isExpanded: true,
        },
      ];
    } else if (typeof data === "object" && data !== null) {
      const entries = Object.entries(data);
      if (entries.length === 0) {
        return [{ key: parentKey, value: "{}", type: "object" }];
      }
      
      return [
        {
          key: parentKey,
          value: "Object",
          type: "object",
          children: entries.map(([key, value]) => {
            if (typeof value === "object" && value !== null) {
              return {
                key,
                value: Array.isArray(value) ? `Array(${value.length})` : "Object",
                type: Array.isArray(value) ? "array" : "object",
                children: createJsonTree(value, key),
                isExpanded: false,
              };
            } else {
              return {
                key,
                value,
                type: typeof value,
              };
            }
          }),
          isExpanded: true,
        },
      ];
    }
    
    return [{ key: parentKey, value: data, type: typeof data }];
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

    setLoading(true);
    try {
      const fileContent = await selectedFile.text();
      const data = JSON.parse(fileContent);
      setJsonData(data);
      
      // Detect if this is banners.json format by checking structure
      const isBannersFormat = Object.values(data).length > 0 && 
                            Object.values(data).every((item: any) => 
                              item && typeof item === 'object' && 
                              'hostname' in item && 'records' in item);
      
      if (isBannersFormat) {
        setBannersData(data);
        toast({
          title: "Banners data imported",
          description: `Imported data for ${Object.keys(data).length} MAC addresses`,
        });
      }
      
      const tree = createJsonTree(data);
      setTreeData(tree);
      
      toast({
        title: "Import successful",
        description: "JSON data imported successfully",
      });
      
      setSelectedFile(null);
      const fileInput = document.getElementById('json-file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (error) {
      console.error("Error importing JSON:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Invalid JSON format",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <div className="flex-1 w-full">
        <Input 
          id="json-file-upload"
          type="file" 
          accept=".json"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
      </div>
      <Button 
        className="flex items-center gap-2" 
        onClick={handleImport}
        disabled={loading}
      >
        {loading ? "Importing..." : "Import JSON"}
        <Upload className="h-4 w-4" />
      </Button>
    </div>
  );
};
