
import { useState, useMemo, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ChevronRight, ChevronDown, FileJson, Search } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useJsonData } from "@/context/JsonDataContext";

type JsonTreeNode = {
  key: string;
  value: any;
  type: string;
  children?: JsonTreeNode[];
  isExpanded?: boolean;
};

const Data = () => {
  const { jsonData, treeData, setJsonData, setTreeData, setBannersData } = useJsonData();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Preload banners.json data for demo purposes
  useEffect(() => {
    const loadBannersData = async () => {
      try {
        // This is the JSON data provided by the user
        const bannersData = {
          "01:00:5e:00:00:fb": {
            "hostname": "ddx1",
            "records": {
              "5353": {
                "protocol": "udp",
                "service": "mdns",
                "src_ip": "172.19.254.1",
                "dst_ip": "224.0.0.251",
                "sport": 5353,
                "dport": 5353,
                "src_mac": "26:5a:4c:80:e5:60",
                "dst_mac": "01:00:5e:00:00:fb",
                "banner": "",
                "entropy": 0.0,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              }
            }
          },
          "33:33:00:00:00:fb": {
            "hostname": "ddx1",
            "records": {
              "5353": {
                "protocol": "udp",
                "service": "mdns",
                "src_ip": "fe80::245a:4cff:fe80:e560",
                "dst_ip": "ff02::fb",
                "sport": 5353,
                "dport": 5353,
                "src_mac": "26:5a:4c:80:e5:60",
                "dst_mac": "33:33:00:00:00:fb",
                "banner": "",
                "entropy": 0.0,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              }
            }
          },
          "24:5a:4c:80:e5:68": {
            "hostname": "ddx1",
            "records": {
              "53": {
                "protocol": "udp",
                "service": "domain",
                "src_ip": "172.20.158.21",
                "dst_ip": "8.8.8.8",
                "sport": 39757,
                "dport": 53,
                "src_mac": "00:05:1b:54:06:64",
                "dst_mac": "24:5a:4c:80:e5:68",
                "banner": "",
                "entropy": 0.0,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              },
              "7442": {
                "protocol": "tcp",
                "service": "Unknown",
                "src_ip": "172.20.158.105",
                "dst_ip": "192.168.1.1",
                "sport": 55580,
                "dport": 7442,
                "src_mac": "00:05:1b:54:06:64",
                "dst_mac": "24:5a:4c:80:e5:68",
                "banner": "",
                "entropy": 0.0,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              },
              "2049": {
                "protocol": "tcp",
                "service": "nfs",
                "src_ip": "172.19.2.121",
                "dst_ip": "172.19.1.4",
                "sport": 821,
                "dport": 2049,
                "src_mac": "00:05:1b:54:06:64",
                "dst_mac": "24:5a:4c:80:e5:68",
                "banner": "\\u0000\\u0000p Q\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0002\\u0000\\u0001\\u0000\\u0000\\u0000\\u0004\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0018\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0004ddx1\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u00005r(g\\n\\u0000\\u0000\\u0000\\t\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000",
                "entropy": 0.0,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              },
              "3306": {
                "protocol": "tcp",
                "service": "mysql",
                "src_ip": "172.19.2.121",
                "dst_ip": "172.19.77.110",
                "sport": 54054,
                "dport": 3306,
                "src_mac": "00:05:1b:54:06:64",
                "dst_mac": "24:5a:4c:80:e5:68",
                "banner": "",
                "entropy": 0.0,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              }
            }
          },
          "01:00:5e:00:25:2a": {
            "hostname": "ddx1",
            "records": {
              "2647": {
                "protocol": "udp",
                "service": "syncserver",
                "src_ip": "172.19.254.1",
                "dst_ip": "224.0.37.42",
                "sport": 2647,
                "dport": 2647,
                "src_mac": "26:5a:4c:80:e5:60",
                "dst_mac": "01:00:5e:00:25:2a",
                "banner": "<LUTRON=1><LUTRON=1><LUTRON=1><LUTRON=1><LUTRON=1>",
                "entropy": 3.321928094887362,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              }
            }
          },
          "00:05:1b:54:06:64": {
            "hostname": "ddx1",
            "records": {
              "22": {
                "protocol": "tcp",
                "service": "ssh",
                "src_ip": "172.19.254.244",
                "dst_ip": "172.19.2.121",
                "sport": 21168,
                "dport": 22,
                "src_mac": "24:5a:4c:80:e5:68",
                "dst_mac": "00:05:1b:54:06:64",
                "banner": "",
                "entropy": 0.0,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              },
              "821": {
                "protocol": "tcp",
                "service": "Unknown",
                "src_ip": "172.19.1.4",
                "dst_ip": "172.19.2.121",
                "sport": 2049,
                "dport": 821,
                "src_mac": "24:5a:4c:80:e5:68",
                "dst_mac": "00:05:1b:54:06:64",
                "banner": "\\u0000\\u0000P Q\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u00005\\u0000\\u0000\\u0000\\u0000r(g\\n\\u0000\\u0000\\u0000\\t\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u001e\\u0000\\u0000\\u0000\\u001e\\u0000\\u0000\\u0000\\u0000",
                "entropy": 0.0,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              }
            }
          },
          "01:00:5e:59:bc:01": {
            "hostname": "ddx1",
            "records": {
              "10001": {
                "protocol": "udp",
                "service": "scp-config",
                "src_ip": "172.19.254.1",
                "dst_ip": "233.89.188.1",
                "sport": 58009,
                "dport": 10001,
                "src_mac": "26:5a:4c:80:e5:60",
                "dst_mac": "01:00:5e:59:bc:01",
                "banner": "\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000",
                "entropy": 0.8112781244591328,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              }
            }
          },
          "ff:ff:ff:ff:ff:ff": {
            "hostname": "ddx1",
            "records": {
              "10001": {
                "protocol": "udp",
                "service": "scp-config",
                "src_ip": "172.19.254.1",
                "dst_ip": "172.19.254.255",
                "sport": 58009,
                "dport": 10001,
                "src_mac": "26:5a:4c:80:e5:60",
                "dst_mac": "ff:ff:ff:ff:ff:ff",
                "banner": "\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000",
                "entropy": 0.8112781244591328,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              },
              "56700": {
                "protocol": "udp",
                "service": "Unknown",
                "src_ip": "172.19.254.185",
                "dst_ip": "255.255.255.255",
                "sport": 56700,
                "dport": 56700,
                "src_mac": "34:19:4d:8f:7d:3c",
                "dst_mac": "ff:ff:ff:ff:ff:ff",
                "banner": "$\\u0000\\u00004\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0001\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0000\\u0002\\u0000\\u0000\\u0000",
                "entropy": 0.725480556997868,
                "matches": {
                  "version": [],
                  "date": [],
                  "url": [],
                  "email": [],
                  "phone": [],
                  "location": [],
                  "ipv4": [],
                  "ipv6": [],
                  "mac": [],
                  "uuid": [],
                  "firmware_keywords": [],
                  "scada_keywords": []
                }
              }
            }
          }
        };
        
        if (jsonData === null) {
          setJsonData(bannersData);
          setBannersData(bannersData);
          const tree = createJsonTree(bannersData);
          setTreeData(tree);
        }
      } catch (error) {
        console.error("Error loading banners data:", error);
      }
    };

    loadBannersData();
  }, [jsonData, setJsonData, setBannersData, setTreeData, createJsonTree]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Import JSON Data</CardTitle>
          <CardDescription>Upload JSON files to visualize and analyze their structure</CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      {treeData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileJson className="h-5 w-5" />
              JSON Structure
            </CardTitle>
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
          </CardHeader>
          <CardContent>
            <div className="overflow-auto max-h-[600px] border rounded-lg p-4">
              {filteredTreeData.map((node) => renderTreeNode(node))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Data;
