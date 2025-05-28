
import { useQuery } from '@tanstack/react-query';
import { fetchAssets, Asset } from '@/lib/db/asset';
import { fetchNetworkDevices, NetworkDevice } from '@/lib/db/network';
import { generateSampleAssets, generateSampleNetworkDevices } from '@/utils/sampleDataGenerator';

export interface DashboardData {
  assets: Asset[];
  networkDevices: NetworkDevice[];
  assetTypes: Array<{ type: string; count: number }>;
  protocols: Array<{ protocol: string; count: number }>;
  subnets: Array<{ subnet: string; count: number }>;
  scadaInfo: Array<{ protocol: string; devices: number }>;
  ouiInfo: Array<{ vendor: string; count: number }>;
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

  const finalAssets = useSampleData ? generateSampleAssets() : assets;
  const finalNetworkDevices = useSampleData ? generateSampleNetworkDevices() : networkDevices;

  const assetTypes = finalAssets.reduce((acc, asset) => {
    const type = asset.device_type || 'Unknown';
    const existing = acc.find(item => item.type === type);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ type, count: 1 });
    }
    return acc;
  }, [] as Array<{ type: string; count: number }>);

  const protocols = finalAssets.reduce((acc, asset) => {
    if (asset.eth_proto) {
      const existing = acc.find(item => item.protocol === asset.eth_proto);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ protocol: asset.eth_proto, count: 1 });
      }
    }
    return acc;
  }, [] as Array<{ protocol: string; count: number }>);

  const subnets = finalAssets.reduce((acc, asset) => {
    if (asset.ip_address) {
      const subnet = asset.ip_address.split('.').slice(0, 3).join('.') + '.0/24';
      const existing = acc.find(item => item.subnet === subnet);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ subnet, count: 1 });
      }
    }
    return acc;
  }, [] as Array<{ subnet: string; count: number }>);

  const scadaInfo = [
    { protocol: 'Modbus TCP', devices: Math.floor(Math.random() * 10) + 1 },
    { protocol: 'DNP3', devices: Math.floor(Math.random() * 5) + 1 },
    { protocol: 'IEC 61850', devices: Math.floor(Math.random() * 8) + 1 }
  ];

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
  }, [] as Array<{ vendor: string; count: number }>);

  return {
    assets: finalAssets,
    networkDevices: finalNetworkDevices,
    assetTypes,
    protocols,
    subnets,
    scadaInfo,
    ouiInfo,
    isLoading: assetsLoading || devicesLoading,
    error: assetsError || devicesError
  };
}
