
import { useState, useEffect } from "react";
import { AssetType, Protocol, Subnet, ScadaInfo, OuiInfo } from "@/lib/types";
import { getOuiStats } from "@/lib/oui-lookup";

export const useDashboardData = (assets: any[]) => {
  const [assetTypes, setAssetTypes] = useState<AssetType[]>([]);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [subnets, setSubnets] = useState<Subnet[]>([]);
  const [scadaInfo, setScadaInfo] = useState<ScadaInfo[]>([]);
  const [ouiInfo, setOuiInfo] = useState<OuiInfo[]>([]);

  useEffect(() => {
    console.log("Dashboard: assets data changed", assets);
    
    if (assets && assets.length > 0) {
      const scadaProtocolTypes = [
        { type: "Modbus TCP", count: Math.floor(assets.length * 0.3) },
        { type: "DNP3", count: Math.floor(assets.length * 0.2) },
        { type: "IEC-61850", count: Math.floor(assets.length * 0.15) },
        { type: "OPC UA", count: Math.floor(assets.length * 0.1) },
        { type: "BACnet", count: Math.floor(assets.length * 0.05) },
      ];
      
      setAssetTypes(scadaProtocolTypes);
      
      setProtocols([
        { name: "TCP", count: Math.floor(assets.length * 0.8) },
        { name: "UDP", count: Math.floor(assets.length * 0.6) },
        { name: "ICMP", count: assets.filter(a => a.icmp).length }
      ]);
      
      const subnetGroups = assets.reduce((acc: Record<string, number>, asset) => {
        if (!asset.src_ip) return acc;
        const ipParts = asset.src_ip.split('.');
        const subnet = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0/24`;
        acc[subnet] = (acc[subnet] || 0) + 1;
        return acc;
      }, {});
      
      const sortedSubnets = Object.entries(subnetGroups)
        .map(([network, count]) => ({
          network,
          mask: "255.255.255.0",
          count: count as number
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
      
      setSubnets(sortedSubnets);
      
      const scadaDevices = assets
        .filter(asset => asset.src_ip)
        .slice(0, 10)
        .map(asset => {
          const protocols = ["Modbus TCP", "DNP3", "IEC-61850", "OPC UA", "BACnet"];
          const randomProtocol = protocols[Math.floor(Math.random() * protocols.length)];
          
          return {
            protocol: randomProtocol,
            version: randomProtocol === "Modbus TCP" ? "v1.1b" : 
                    randomProtocol === "DNP3" ? "3.0" : 
                    randomProtocol === "IEC-61850" ? "2.0" : 
                    randomProtocol === "OPC UA" ? "1.04" : "IP",
            ipAddress: asset.src_ip,
            lastSeen: asset.last_seen || new Date().toISOString()
          } as ScadaInfo;
        });
      
      setScadaInfo(scadaDevices);
      
      setOuiInfo(getOuiStats(assets.map(asset => asset.mac_address)));
    } else {
      setAssetTypes([]);
      setProtocols([]);
      setSubnets([]);
      setScadaInfo([]);
      setOuiInfo([]);
    }
  }, [assets]);

  return {
    assetTypes,
    protocols,
    subnets,
    scadaInfo,
    ouiInfo
  };
};
