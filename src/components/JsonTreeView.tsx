
import { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export type JsonTreeNode = {
  key: string;
  value: any;
  type: string;
  children?: JsonTreeNode[];
  isExpanded?: boolean;
};

interface JsonTreeViewProps {
  treeData: JsonTreeNode[];
  setTreeData: (data: JsonTreeNode[] | ((prevData: JsonTreeNode[]) => JsonTreeNode[])) => void;
}

export const JsonTreeView = ({ treeData, setTreeData }: JsonTreeViewProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const toggleNode = (nodePath: string[]) => {
    const toggleNodeRecursive = (nodes: JsonTreeNode[], pathParts: string[], currentLevel = 0): JsonTreeNode[] => {
      return nodes.map(node => {
        if (node.key === pathParts[currentLevel]) {
          if (currentLevel === pathParts.length - 1) {
            return { ...node, isExpanded: !node.isExpanded };
          } else if (node.children) {
            return {
              ...node,
              children: toggleNodeRecursive(node.children, pathParts, currentLevel + 1)
            };
          }
        }
        return node;
      });
    };

    setTreeData((prevTreeData: JsonTreeNode[]) => toggleNodeRecursive([...prevTreeData], nodePath));
  };

  const filteredTreeData = useMemo(() => {
    if (!searchTerm.trim()) return treeData;
    
    const searchLowerCase = searchTerm.toLowerCase();
    
    const filterNode = (node: JsonTreeNode): JsonTreeNode | null => {
      const keyMatches = node.key.toLowerCase().includes(searchLowerCase);
      const valueMatches = 
        typeof node.value === 'string' && 
        node.value.toLowerCase().includes(searchLowerCase);
      
      if (node.children && node.children.length > 0) {
        const matchingChildren = node.children
          .map(filterNode)
          .filter((child): child is JsonTreeNode => child !== null);
        
        if (matchingChildren.length > 0 || keyMatches || valueMatches) {
          return {
            ...node,
            children: matchingChildren,
            isExpanded: matchingChildren.length > 0 ? true : node.isExpanded
          };
        }
      }
      
      return (keyMatches || valueMatches) ? node : null;
    };
    
    return treeData.map(filterNode).filter((node): node is JsonTreeNode => node !== null);
  }, [treeData, searchTerm]);

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="flex items-center gap-2 mt-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by key or value..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-md"
        />
      </div>
      <div className="overflow-auto max-h-[600px] border rounded-lg p-4 mt-4">
        {filteredTreeData.map((node) => renderTreeNode(node))}
      </div>
    </>
  );
};
