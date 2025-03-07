
import { useEffect } from "react";
import { useJsonData } from "@/context/JsonDataContext";
import { JsonTreeNode } from "./JsonTreeView";
import { importAssetData } from "@/lib/db/asset";
import { toast } from "@/hooks/use-toast";

// This component doesn't render anything, it just loads sample data if none exists
export const AssetDataLoader = () => {
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
        // Comprehensive sample asset data for the demo
        const sampleAssetsData = {
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
          "00:1a:22:05:75:43": {
            "hostname": "plc-controller",
            "records": {
              "502": {
                "protocol": "tcp",
                "service": "modbus",
                "src_ip": "192.168.1.50",
                "dst_ip": "192.168.1.100",
                "sport": 49211,
                "dport": 502,
                "src_mac": "00:1a:22:05:75:43",
                "dst_mac": "00:60:52:20:15:77",
                "banner": "Modbus/TCP",
                "entropy": 3.2,
                "matches": {
                  "scada_keywords": ["modbus", "plc", "industrial"]
                }
              }
            },
            "scada_protocols": ["modbus"],
            "device_type": "PLC"
          },
          "00:60:52:20:15:77": {
            "hostname": "scada-server",
            "records": {
              "44818": {
                "protocol": "tcp",
                "service": "ethernet-ip",
                "src_ip": "192.168.1.100",
                "dst_ip": "192.168.1.55",
                "sport": 44818,
                "dport": 54123,
                "src_mac": "00:60:52:20:15:77",
                "dst_mac": "00:11:43:eb:dc:21",
                "banner": "EtherNet/IP",
                "entropy": 2.8,
                "matches": {
                  "scada_keywords": ["ethernet-ip", "scada", "hmi", "industrial"]
                }
              }
            },
            "scada_protocols": ["ethernet-ip"],
            "device_type": "Server"
          },
          "00:11:43:eb:dc:21": {
            "hostname": "hmi-panel",
            "records": {
              "102": {
                "protocol": "tcp",
                "service": "s7comm",
                "src_ip": "192.168.1.55",
                "dst_ip": "192.168.1.60",
                "sport": 54678,
                "dport": 102,
                "src_mac": "00:11:43:eb:dc:21",
                "dst_mac": "00:0e:8c:93:aa:18",
                "banner": "S7Communication",
                "entropy": 4.1,
                "matches": {
                  "scada_keywords": ["s7", "siemens", "hmi", "industrial"]
                }
              }
            },
            "scada_protocols": ["s7comm"],
            "device_type": "HMI"
          },
          "00:0e:8c:93:aa:18": {
            "hostname": "siemens-s7-1500",
            "records": {
              "20000": {
                "protocol": "tcp",
                "service": "dnp3",
                "src_ip": "192.168.1.60",
                "dst_ip": "192.168.1.65",
                "sport": 58921,
                "dport": 20000,
                "src_mac": "00:0e:8c:93:aa:18",
                "dst_mac": "d4:54:8b:c2:17:6d",
                "banner": "DNP3",
                "entropy": 3.5,
                "matches": {
                  "scada_keywords": ["dnp3", "controls", "industrial"]
                }
              }
            },
            "scada_protocols": ["dnp3"],
            "device_type": "PLC"
          },
          "d4:54:8b:c2:17:6d": {
            "hostname": "rtu-controller",
            "records": {
              "47808": {
                "protocol": "udp",
                "service": "bacnet",
                "src_ip": "192.168.1.65",
                "dst_ip": "192.168.1.70",
                "sport": 47808,
                "dport": 47808,
                "src_mac": "d4:54:8b:c2:17:6d",
                "dst_mac": "2c:ab:10:97:e5:50",
                "banner": "BACnet/IP",
                "entropy": 2.9,
                "matches": {
                  "scada_keywords": ["bacnet", "building", "automation"]
                }
              }
            },
            "scada_protocols": ["bacnet"],
            "device_type": "RTU"
          },
          "2c:ab:10:97:e5:50": {
            "hostname": "building-controller",
            "records": {
              "1911": {
                "protocol": "tcp",
                "service": "fox",
                "src_ip": "192.168.1.70",
                "dst_ip": "192.168.1.75",
                "sport": 52410,
                "dport": 1911,
                "src_mac": "2c:ab:10:97:e5:50",
                "dst_mac": "34:29:8f:7d:e3:21",
                "banner": "Niagara Fox Protocol",
                "entropy": 3.7,
                "matches": {
                  "scada_keywords": ["fox", "niagara", "automation"]
                }
              }
            },
            "scada_protocols": ["fox"],
            "device_type": "Controller"
          },
          "34:29:8f:7d:e3:21": {
            "hostname": "niagara-server",
            "records": {
              "2404": {
                "protocol": "tcp",
                "service": "iec104",
                "src_ip": "192.168.1.75",
                "dst_ip": "192.168.1.80",
                "sport": 55123,
                "dport": 2404,
                "src_mac": "34:29:8f:7d:e3:21",
                "dst_mac": "98:76:d4:36:ff:41",
                "banner": "IEC 60870-5-104",
                "entropy": 4.2,
                "matches": {
                  "scada_keywords": ["iec104", "power", "grid"]
                }
              }
            },
            "scada_protocols": ["iec104"],
            "device_type": "Server"
          },
          "98:76:d4:36:ff:41": {
            "hostname": "power-rtu",
            "records": {
              "789": {
                "protocol": "tcp",
                "service": "crimson-v3",
                "src_ip": "192.168.1.80",
                "dst_ip": "192.168.1.85",
                "sport": 59871,
                "dport": 789,
                "src_mac": "98:76:d4:36:ff:41",
                "dst_mac": "4a:31:78:9c:0e:22",
                "banner": "Red Lion Crimson v3",
                "entropy": 3.3,
                "matches": {
                  "scada_keywords": ["crimson", "red-lion", "hmi"]
                }
              }
            },
            "scada_protocols": ["crimson-v3"],
            "device_type": "RTU"
          },
          "4a:31:78:9c:0e:22": {
            "hostname": "red-lion-hmi",
            "records": {
              "18245": {
                "protocol": "udp",
                "service": "codesys",
                "src_ip": "192.168.1.85",
                "dst_ip": "192.168.1.90",
                "sport": 18245,
                "dport": 18245,
                "src_mac": "4a:31:78:9c:0e:22",
                "dst_mac": "5e:bc:34:a1:89:d7",
                "banner": "CoDeSys Runtime",
                "entropy": 2.7,
                "matches": {
                  "scada_keywords": ["codesys", "runtime", "plc"]
                }
              }
            },
            "scada_protocols": ["codesys"],
            "device_type": "HMI"
          },
          "5e:bc:34:a1:89:d7": {
            "hostname": "codesys-plc",
            "records": {
              "1962": {
                "protocol": "tcp",
                "service": "pcworx",
                "src_ip": "192.168.1.90",
                "dst_ip": "192.168.1.95",
                "sport": 51247,
                "dport": 1962,
                "src_mac": "5e:bc:34:a1:89:d7",
                "dst_mac": "7c:f9:0e:55:2d:18",
                "banner": "PC WORX Protocol",
                "entropy": 3.0,
                "matches": {
                  "scada_keywords": ["pcworx", "phoenix", "contact"]
                }
              }
            },
            "scada_protocols": ["pcworx"],
            "device_type": "PLC"
          }
        };
        
        if (jsonData === null) {
          setJsonData(sampleAssetsData);
          setBannersData(sampleAssetsData);
          const tree = createJsonTree(sampleAssetsData);
          setTreeData(tree);
          
          // Import data to Supabase
          try {
            await importAssetData(sampleAssetsData);
            console.log("Demo data imported to Supabase");
          } catch (error) {
            console.error("Error importing to Supabase:", error);
          }
        }
      } catch (error) {
        console.error("Error loading sample data:", error);
        toast({
          title: "Error loading sample data",
          description: "There was an issue loading the sample data",
          variant: "destructive",
        });
      }
    };

    loadBannersData();
  }, [jsonData, setJsonData, setBannersData, setTreeData]);

  return null;
};
