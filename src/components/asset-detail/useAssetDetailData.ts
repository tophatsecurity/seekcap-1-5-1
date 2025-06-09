
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAssetDetails } from "@/lib/supabase";
import { useJsonData } from "@/context/JsonDataContext";
import { useEffect, useState } from "react";

export const useAssetDetailData = () => {
  const { macAddress } = useParams<{ macAddress: string }>();
  const { bannersData } = useJsonData();
  const [bannerDetails, setBannerDetails] = useState<any>(null);
  
  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", macAddress],
    queryFn: () => fetchAssetDetails(macAddress as string),
    enabled: !!macAddress,
  });

  useEffect(() => {
    if (bannersData && macAddress && bannersData[macAddress]) {
      setBannerDetails(bannersData[macAddress]);
    } else {
      setBannerDetails(null);
    }
  }, [bannersData, macAddress]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  // Display loading state
  if (isLoading) {
    return {
      isLoading: true,
      hasAssetData: false,
      combinedAsset: null,
      bannerRecords: {},
      hasBannerData: false,
      formatDate,
      macAddress
    };
  }

  // If we have neither asset data nor banner data, show not found
  const hasAssetData = asset || bannerDetails;
  
  if (!hasAssetData) {
    return {
      isLoading: false,
      hasAssetData: false,
      combinedAsset: null,
      bannerRecords: {},
      hasBannerData: false,
      formatDate,
      macAddress
    };
  }

  // Create a safe combined asset object that doesn't rely on potentially undefined properties
  const combinedAsset = {
    mac_address: macAddress || "",
    src_ip: asset?.src_ip || bannerDetails?.src_ip || "—",
    eth_proto: asset?.eth_proto || "—",
    hostname: bannerDetails?.hostname || "—",
    last_seen: asset?.last_seen || "",
    ip_protocols: asset?.ip_protocols || [],
    tcp_ports: asset?.tcp_ports || [],
    udp_ports: asset?.udp_ports || [],
    scada_protocols: asset?.scada_protocols || [],
    scada_data: asset?.scada_data || {},
    icmp: asset?.icmp || false
  };

  // Safely access banner records
  const bannerRecords = bannerDetails?.records || {};
  const hasBannerData = Object.keys(bannerRecords).length > 0;

  return {
    isLoading: false,
    hasAssetData: true,
    combinedAsset,
    bannerRecords,
    hasBannerData,
    formatDate,
    macAddress
  };
};
