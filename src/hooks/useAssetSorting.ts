
import { useState, useMemo } from "react";
import { Asset } from "@/lib/db/types";

export type SortField = 
  | 'name' 
  | 'src_ip' 
  | 'ip_address'
  | 'mac_address' 
  | 'vendor' 
  | 'device_type' 
  | 'eth_proto'
  | 'download_bps'
  | 'upload_bps'
  | 'last_seen';

export type SortDirection = 'asc' | 'desc' | null;

export const useAssetSorting = (assets: Asset[]) => {
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortField(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedAssets = useMemo(() => {
    if (!sortField || !sortDirection) {
      return assets;
    }

    return [...assets].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'src_ip':
        case 'ip_address':
          aValue = a.src_ip || a.ip_address || '';
          bValue = b.src_ip || b.ip_address || '';
          break;
        case 'mac_address':
          aValue = a.mac_address;
          bValue = b.mac_address;
          break;
        case 'vendor':
          aValue = a.vendor || '';
          bValue = b.vendor || '';
          break;
        case 'device_type':
          aValue = a.device_type || '';
          bValue = b.device_type || '';
          break;
        case 'eth_proto':
          aValue = a.eth_proto || ('scada_protocols' in a && a.scada_protocols?.[0]) || '';
          bValue = b.eth_proto || ('scada_protocols' in b && b.scada_protocols?.[0]) || '';
          break;
        case 'download_bps':
          aValue = a.download_bps || 0;
          bValue = b.download_bps || 0;
          break;
        case 'upload_bps':
          aValue = a.upload_bps || 0;
          bValue = b.upload_bps || 0;
          break;
        case 'last_seen':
          aValue = a.last_seen ? new Date(a.last_seen).getTime() : 0;
          bValue = b.last_seen ? new Date(b.last_seen).getTime() : 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [assets, sortField, sortDirection]);

  return {
    sortedAssets,
    sortField,
    sortDirection,
    handleSort
  };
};
