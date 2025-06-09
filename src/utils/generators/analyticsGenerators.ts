
import { Asset, Protocol, Subnet, ScadaInfo, OuiInfo } from "@/lib/db/types";
import { subnetData } from "./networkData";

export const generateAssetTypes = (assets: Asset[]) => {
  const typeCount = assets.reduce((acc, asset) => {
    const type = asset.device_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(typeCount).map(([type, count]) => ({
    type,
    count
  }));
};

export const generateProtocols = (assets: Asset[]): Protocol[] => {
  const protocols = ['Modbus TCP', 'EtherNet/IP', 'DNP3', 'PROFINET', 'OPC UA', 'BACnet', 'TCP', 'UDP'];
  return protocols.map(protocol => ({
    protocol,
    count: Math.floor(Math.random() * 200) + 50
  }));
};

export const generateSubnets = (): Subnet[] => {
  return subnetData.map(subnet => ({
    subnet: subnet.subnet,
    count: Math.floor(Math.random() * 300) + 100
  }));
};

export const generateScadaInfo = (assets: Asset[]): ScadaInfo[] => {
  const scadaAssets = assets.filter(asset => 'scada_protocols' in asset && asset.scada_protocols && asset.scada_protocols.length > 0);
  const protocolCount = scadaAssets.reduce((acc, asset) => {
    if ('scada_protocols' in asset && asset.scada_protocols) {
      asset.scada_protocols.forEach(protocol => {
        acc[protocol] = (acc[protocol] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(protocolCount).map(([protocol, devices]) => ({
    protocol,
    devices: devices as number
  }));
};

export const generateOuiInfo = (assets: Asset[]): OuiInfo[] => {
  const vendorCount = assets.reduce((acc, asset) => {
    const vendor = asset.vendor || 'Unknown';
    acc[vendor] = (acc[vendor] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(vendorCount).map(([vendor, count]) => ({
    vendor,
    count: count as number
  }));
};
