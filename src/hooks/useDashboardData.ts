
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/lib/db/asset';
import { fetchNetworkDevices } from '@/lib/db/network';
import { generateDetailedSampleAssets } from '@/utils/generators/assetGenerator';
import { AssetType, Protocol, Subnet, ScadaInfo, OuiInfo } from '@/lib/types';

export interface DashboardData {
  assetTypes: AssetType[];
  protocols: Protocol[];
  subnets: Subnet[];
  scadaInfo: ScadaInfo[];
  ouiInfo: OuiInfo[];
  isLoading: boolean;
  error: any;
}

export function useDashboardData(useSampleData: boolean = false): DashboardData {
  const { data: assets = [], isLoading: assetsLoading, error: assetsError } = useQuery({
    queryKey: ['assets'],
    queryFn: fetchAssets,
    enabled: !useSampleData
  });

  const { data: networkDevices = [], isLoading: devicesLoading, error: devicesError } = useQuery({
    queryKey: ['networkDevices'],
    queryFn: fetchNetworkDevices,
    enabled: !useSampleData
  });

  const finalAssets = useSampleData || assets.length === 0 ? generateDetailedSampleAssets() : assets;

  const assetTypes = finalAssets.reduce((acc, asset) => {
    const type = asset.device_type || 'Unknown';
    const existing = acc.find(item => item.type === type);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ type, count: 1 });
    }
    return acc;
  }, [] as AssetType[]);

  const protocols = finalAssets.reduce((acc, asset) => {
    // Handle SCADA protocols - safely check if property exists
    if ('scada_protocols' in asset && asset.scada_protocols && asset.scada_protocols.length > 0) {
      asset.scada_protocols.forEach(protocol => {
        const existing = acc.find(item => item.protocol === protocol);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ protocol, count: 1 });
        }
      });
    }
    
    // Handle ethernet protocols
    if (asset.eth_proto) {
      const existing = acc.find(item => item.protocol === asset.eth_proto);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ protocol: asset.eth_proto, count: 1 });
      }
    }
    return acc;
  }, [] as Protocol[]);

  // Enhanced subnet calculation with proper CIDR notation and host counting
  const subnets = finalAssets.reduce((acc, asset) => {
    const ip = asset.src_ip || asset.ip_address;
    if (ip) {
      const ipParts = ip.split('.');
      if (ipParts.length >= 3) {
        const subnet = `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.0/24`;
        const existing = acc.find(item => item.subnet === subnet);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ subnet, count: 1 });
        }
      }
    }
    return acc;
  }, [] as Subnet[]).sort((a, b) => b.count - a.count); // Sort by host count descending

  // Enhanced SCADA info based on actual protocols detected - safely check if property exists
  const scadaProtocols = finalAssets.filter(asset => 
    'scada_protocols' in asset && asset.scada_protocols && asset.scada_protocols.length > 0
  );
  
  const scadaInfo = scadaProtocols.reduce((acc, asset) => {
    if ('scada_protocols' in asset && asset.scada_protocols) {
      asset.scada_protocols.forEach(protocol => {
        const existing = acc.find(item => item.protocol === protocol);
        if (existing) {
          existing.devices++;
        } else {
          acc.push({ protocol, devices: 1 });
        }
      });
    }
    return acc;
  }, [] as ScadaInfo[]).sort((a, b) => b.devices - a.devices);

  const ouiInfo = finalAssets.reduce((acc, asset) => {
    if (asset.vendor) {
      const existing = acc.find(item => item.vendor === asset.vendor);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ vendor: asset.vendor, count: 1 });
      }
    }
    return acc;
  }, [] as OuiInfo[]).sort((a, b) => b.count - a.count); // Sort by count descending

  return {
    assetTypes: assetTypes.sort((a, b) => b.count - a.count),
    protocols: protocols.sort((a, b) => b.count - a.count),
    subnets,
    scadaInfo,
    ouiInfo,
    isLoading: assetsLoading || devicesLoading,
    error: assetsError || devicesError
  };
}
