
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Asset } from "./types";
import { fetchAssetsFromAPI } from "./asset-api";
import { generateDetailedSampleAssets } from "@/utils/sampleTopologyData";

export async function fetchAssets(): Promise<Asset[]> {
  try {
    // First try to get assets from API
    const apiAssets = await fetchAssetsFromAPI();
    if (apiAssets.length > 0) {
      console.log(`Found ${apiAssets.length} assets from API`);
      return apiAssets;
    }

    // Fallback to database assets
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*, organizations(name)')
      .order('last_seen', { ascending: false });

    if (error) {
      console.error("Error in fetchAssets:", error);
      throw error;
    }
    
    if (!assets || assets.length === 0) {
      console.log("No assets found in the database");
      // Return sample data with proper typing
      return generateDetailedSampleAssets();
    } else {
      console.log(`Found ${assets.length} assets in the database`);
    }
    
    return assets || [];
  } catch (error) {
    console.error("Error fetching assets:", error);
    return generateDetailedSampleAssets();
  }
}

export async function fetchAssetDetails(macAddress: string) {
  try {
    const { data: asset, error: assetError } = await supabase
      .from('assets')
      .select('*, organizations(id, name, description)')
      .eq('mac_address', macAddress)
      .single();

    if (assetError) throw assetError;

    const [ipProtocols, tcpPorts, udpPorts, scadaProtocols, scadaData] = await Promise.all([
      supabase.from('ip_protocols').select('protocol').eq('asset_mac', macAddress),
      supabase.from('tcp_ports').select('port').eq('asset_mac', macAddress),
      supabase.from('udp_ports').select('port').eq('asset_mac', macAddress),
      supabase.from('scada_protocols').select('protocol').eq('asset_mac', macAddress),
      supabase.from('scada_data').select('key, value').eq('asset_mac', macAddress)
    ]);

    return {
      ...asset,
      ip_protocols: ipProtocols.data?.map(p => p.protocol) || [],
      tcp_ports: tcpPorts.data?.map(p => p.port) || [],
      udp_ports: udpPorts.data?.map(p => p.port) || [],
      scada_protocols: scadaProtocols.data?.map(p => p.protocol) || [],
      scada_data: scadaData.data?.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {} as Record<string, any>) || {}
    };
  } catch (error) {
    console.error("Error fetching asset details:", error);
    return null;
  }
}

export async function updateAssetOrganization(macAddress: string, organizationId: number | null) {
  try {
    const { error } = await supabase
      .from('assets')
      .update({ organization_id: organizationId })
      .eq('mac_address', macAddress);

    if (error) throw error;
    
    toast({
      title: "Asset updated",
      description: "Organization assignment has been updated.",
    });
    
    return true;
  } catch (error) {
    console.error("Error updating asset organization:", error);
    toast({
      title: "Error updating asset",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}
