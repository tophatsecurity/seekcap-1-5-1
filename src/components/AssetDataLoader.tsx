
import { useEffect } from "react";
import { useJsonData } from "@/context/JsonDataContext";
import { JsonTreeNode } from "./JsonTreeView";

// This component doesn't render anything, it just loads sample data if none exists
export const JsonDataLoader = () => {
  const { jsonData, setJsonData, setTreeData, setBannersData } = useJsonData();

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
          // ... more data would be here in the original file
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
  }, [jsonData, setJsonData, setBannersData, setTreeData]);

  return null;
};
