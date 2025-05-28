import { useEffect } from "react";
import { useJsonData } from "@/context/JsonDataContext";
import { JsonTreeNode } from "./JsonTreeView";
import { importAssetData } from "@/lib/db/asset";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

  const insertSampleAssets = async () => {
    try {
      // Create comprehensive sample assets that match the imported JSON structure
      const sampleAssets = [
        {
          mac_address: "01:00:5e:00:00:fb",
          src_ip: "172.19.254.1",
          eth_proto: "udp",
          name: "DDX1 MDNS Device",
          vendor: "Multicast",
          device_type: "Network Service",
          experience: "Excellent",
          signal_strength: -45,
          download_bps: 1500000,
          upload_bps: 750000,
          usage_mb: 125,
          first_seen: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date().toISOString(),
        },
        {
          mac_address: "00:1a:22:05:75:43",
          src_ip: "192.168.1.50",
          eth_proto: "tcp",
          name: "PLC Controller",
          vendor: "Schneider Electric",
          device_type: "PLC",
          experience: "Good",
          signal_strength: -52,
          download_bps: 850000,
          upload_bps: 425000,
          usage_mb: 89,
          first_seen: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "00:60:52:20:15:77",
          src_ip: "192.168.1.100",
          eth_proto: "tcp",
          name: "SCADA Server",
          vendor: "Rockwell Automation",
          device_type: "Server",
          experience: "Excellent",
          signal_strength: -38,
          download_bps: 12500000,
          upload_bps: 8750000,
          usage_mb: 2450,
          first_seen: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "00:11:43:eb:dc:21",
          src_ip: "192.168.1.55",
          eth_proto: "tcp",
          name: "HMI Panel",
          vendor: "Siemens",
          device_type: "HMI",
          experience: "Good",
          signal_strength: -48,
          download_bps: 3250000,
          upload_bps: 1625000,
          usage_mb: 567,
          first_seen: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "00:0e:8c:93:aa:18",
          src_ip: "192.168.1.60",
          eth_proto: "tcp",
          name: "Siemens S7-1500 PLC",
          vendor: "Siemens",
          device_type: "PLC",
          experience: "Excellent",
          signal_strength: -41,
          download_bps: 2100000,
          upload_bps: 1050000,
          usage_mb: 234,
          first_seen: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "d4:54:8b:c2:17:6d",
          src_ip: "192.168.1.65",
          eth_proto: "udp",
          name: "RTU Controller",
          vendor: "ABB",
          device_type: "RTU",
          experience: "Good",
          signal_strength: -55,
          download_bps: 950000,
          upload_bps: 475000,
          usage_mb: 178,
          first_seen: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "2c:ab:10:97:e5:50",
          src_ip: "192.168.1.70",
          eth_proto: "udp",
          name: "Building Controller",
          vendor: "Johnson Controls",
          device_type: "Controller",
          experience: "Fair",
          signal_strength: -63,
          download_bps: 750000,
          upload_bps: 375000,
          usage_mb: 145,
          first_seen: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "34:29:8f:7d:e3:21",
          src_ip: "192.168.1.75",
          eth_proto: "tcp",
          name: "Niagara Server",
          vendor: "Tridium",
          device_type: "Server",
          experience: "Excellent",
          signal_strength: -39,
          download_bps: 8500000,
          upload_bps: 4250000,
          usage_mb: 1890,
          first_seen: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "98:76:d4:36:ff:41",
          src_ip: "192.168.1.80",
          eth_proto: "tcp",
          name: "Power RTU",
          vendor: "GE",
          device_type: "RTU",
          experience: "Good",
          signal_strength: -47,
          download_bps: 1250000,
          upload_bps: 625000,
          usage_mb: 298,
          first_seen: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "4a:31:78:9c:0e:22",
          src_ip: "192.168.1.85",
          eth_proto: "tcp",
          name: "Red Lion HMI",
          vendor: "Red Lion",
          device_type: "HMI",
          experience: "Good",
          signal_strength: -51,
          download_bps: 2750000,
          upload_bps: 1375000,
          usage_mb: 445,
          first_seen: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "5e:bc:34:a1:89:d7",
          src_ip: "192.168.1.90",
          eth_proto: "udp",
          name: "CoDeSys PLC",
          vendor: "3S-Smart Software",
          device_type: "PLC",
          experience: "Fair",
          signal_strength: -58,
          download_bps: 1850000,
          upload_bps: 925000,
          usage_mb: 367,
          first_seen: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        },
        {
          mac_address: "7c:f9:0e:55:2d:18",
          src_ip: "192.168.1.95",
          eth_proto: "tcp",
          name: "Phoenix Contact PLC",
          vendor: "Phoenix Contact",
          device_type: "PLC",
          experience: "Good",
          signal_strength: -44,
          download_bps: 1650000,
          upload_bps: 825000,
          usage_mb: 289,
          first_seen: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
        }
      ];

      // Insert assets using upsert to avoid duplicates
      for (const asset of sampleAssets) {
        const { error } = await supabase
          .from('assets')
          .upsert(asset, { onConflict: 'mac_address' });

        if (error) {
          console.error('Error inserting asset:', error);
        }
      }

      console.log(`Successfully inserted ${sampleAssets.length} sample assets`);
    } catch (error) {
      console.error('Error inserting sample assets:', error);
    }
  };

  const insertSampleNetworkDevices = async () => {
    try {
      const sampleNetworkDevices = [
        {
          name: "Core Router",
          device_type: "router",
          ip_address: "192.168.1.1",
          mac_address: "00:11:22:33:44:55",
          status: "Online",
          application: "Network Infrastructure",
          experience: "Excellent",
          connected: 45,
          upload: "125 Mbps",
          download: "250 Mbps",
          usage_24hr: "2.4 GB"
        },
        {
          name: "Main Switch",
          device_type: "switch",
          ip_address: "192.168.1.2",
          mac_address: "00:22:33:44:55:66",
          status: "Online",
          application: "Network Infrastructure", 
          experience: "Good",
          connected: 32,
          upload: "85 Mbps",
          download: "170 Mbps",
          usage_24hr: "1.8 GB"
        },
        {
          name: "Access Point A",
          device_type: "access_point",
          ip_address: "192.168.1.10",
          mac_address: "00:33:44:55:66:77",
          status: "Online",
          application: "Wireless Access",
          experience: "Good",
          connected: 18,
          upload: "45 Mbps",
          download: "95 Mbps",
          usage_24hr: "890 MB",
          ch_24_ghz: "6",
          ch_5_ghz: "36"
        },
        {
          name: "Firewall",
          device_type: "firewall",
          ip_address: "192.168.1.254",
          mac_address: "00:44:55:66:77:88",
          status: "Online",
          application: "Security",
          experience: "Excellent",
          connected: 1,
          upload: "200 Mbps",
          download: "400 Mbps",
          usage_24hr: "5.2 GB"
        }
      ];

      for (const device of sampleNetworkDevices) {
        const { error } = await supabase
          .from('network_devices')
          .upsert(device, { onConflict: 'mac_address' });

        if (error) {
          console.error('Error inserting network device:', error);
        }
      }

      console.log(`Successfully inserted ${sampleNetworkDevices.length} sample network devices`);
    } catch (error) {
      console.error('Error inserting sample network devices:', error);
    }
  };

  const insertSampleDeviceStats = async () => {
    try {
      const sampleDeviceStats = [
        {
          device_name: "router-main",
          load_avg_1m: 1.25,
          load_avg_5m: 1.18,
          load_avg_15m: 1.05,
          memory_used_percent: 45.8,
          storage_used_percent: 62.3,
          traffic_in_mbps: 125.4,
          traffic_out_mbps: 89.7,
          collection_status: "active"
        },
        {
          device_name: "switch-core",
          load_avg_1m: 0.85,
          load_avg_5m: 0.92,
          load_avg_15m: 0.78,
          memory_used_percent: 38.2,
          storage_used_percent: 55.7,
          traffic_in_mbps: 98.3,
          traffic_out_mbps: 67.1,
          collection_status: "active"
        },
        {
          device_name: "firewall-edge",
          load_avg_1m: 2.15,
          load_avg_5m: 2.08,
          load_avg_15m: 1.95,
          memory_used_percent: 72.4,
          storage_used_percent: 48.9,
          traffic_in_mbps: 245.8,
          traffic_out_mbps: 189.3,
          collection_status: "active"
        },
        {
          device_name: "access-point-1",
          load_avg_1m: 0.45,
          load_avg_5m: 0.52,
          load_avg_15m: 0.48,
          memory_used_percent: 28.7,
          storage_used_percent: 34.2,
          traffic_in_mbps: 45.2,
          traffic_out_mbps: 32.8,
          collection_status: "active"
        },
        {
          device_name: "server-primary",
          load_avg_1m: 3.82,
          load_avg_5m: 3.65,
          load_avg_15m: 3.45,
          memory_used_percent: 85.6,
          storage_used_percent: 78.3,
          traffic_in_mbps: 156.7,
          traffic_out_mbps: 134.2,
          collection_status: "limited",
          status_reason: "High Load"
        }
      ];

      for (const stats of sampleDeviceStats) {
        const { error } = await supabase
          .from('device_load_stats')
          .insert(stats);

        if (error && !error.message.includes('duplicate')) {
          console.error('Error inserting device stats:', error);
        }
      }

      console.log(`Successfully inserted ${sampleDeviceStats.length} sample device stats`);
    } catch (error) {
      console.error('Error inserting sample device stats:', error);
    }
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
            await insertSampleAssets();
            await insertSampleNetworkDevices();
            await insertSampleDeviceStats();
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
