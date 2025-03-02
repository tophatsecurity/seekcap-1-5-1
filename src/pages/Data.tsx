
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, ChevronRight, ChevronDown, FileJson } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type JsonTreeNode = {
  key: string;
  value: any;
  type: string;
  children?: JsonTreeNode[];
  isExpanded?: boolean;
};

const Data = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [treeData, setTreeData] = useState<JsonTreeNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

    setLoading(true);
    try {
      const fileContent = await selectedFile.text();
      const data = JSON.parse(fileContent);
      setJsonData(data);
      
      // Generate tree from JSON
      const tree = createJsonTree(data);
      setTreeData(tree);
      
      toast({
        title: "Import successful",
        description: "JSON data imported successfully",
      });
      
      // Reset file input
      setSelectedFile(null);
      const fileInput = document.getElementById('json-file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
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

  const toggleNode = (nodePath: string[]) => {
    const toggleNodeRecursive = (nodes: JsonTreeNode[], pathParts: string[], currentLevel = 0): JsonTreeNode[] => {
      return nodes.map(node => {
        if (node.key === pathParts[currentLevel]) {
          if (currentLevel === pathParts.length - 1) {
            // Toggle the node
            return { ...node, isExpanded: !node.isExpanded };
          } else if (node.children) {
            // Continue traversing
            return {
              ...node,
              children: toggleNodeRecursive(node.children, pathParts, currentLevel + 1)
            };
          }
        }
        return node;
      });
    };

    setTreeData(prevTreeData => toggleNodeRecursive(prevTreeData, nodePath));
  };

  const renderTreeNode = (node: JsonTreeNode, path: string[] = []) => {
    const currentPath = [...path, node.key];
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={currentPath.join('-')} className="ml-4">
        <div className="flex items-center py-1">
          {hasChildren ? (
            <Collapsible open={node.isExpanded} onOpenChange={() => toggleNode(currentPath)}>
              <div className="flex items-center">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                    {node.isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                <span className="font-medium">{node.key}: </span>
                <span className="ml-1 text-muted-foreground">{node.value}</span>
              </div>
              <CollapsibleContent>
                {node.children?.map((childNode) => renderTreeNode(childNode, currentPath))}
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <div className="flex items-center ml-5">
              <span className="font-medium">{node.key}: </span>
              <span className="ml-1 text-muted-foreground">
                {typeof node.value === 'string' ? `"${node.value}"` : node.value}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Data Explorer</h1>
        <div className="flex items-center gap-3">
          <input
            type="file"
            id="json-file-upload"
            className="hidden"
            accept=".json"
            onChange={handleFileChange}
          />
          <label htmlFor="json-file-upload">
            <Button variant="outline" asChild>
              <span>Select JSON File</span>
            </Button>
          </label>
          <Button 
            onClick={handleImport} 
            disabled={!selectedFile || loading}
          >
            <Upload className="mr-2 h-4 w-4" />
            {loading ? "Importing..." : "Import JSON"}
          </Button>
        </div>
      </div>

      {selectedFile && (
        <div className="bg-muted p-3 rounded-md flex items-center gap-2">
          <FileJson className="h-5 w-5" />
          <span>Selected file: {selectedFile.name}</span>
        </div>
      )}

      {treeData.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>JSON Tree View</CardTitle>
            <CardDescription>Interactive visualization of imported JSON data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="json-tree-container max-h-[60vh] overflow-auto">
              {treeData.map(node => renderTreeNode(node))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileJson className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              No JSON data imported yet. Import a JSON file to visualize it as a tree.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Data;
