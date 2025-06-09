
import { supabase } from "@/integrations/supabase/client";

export async function fetchOrganizationAssets(organizationId: number) {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .eq('organization_id', organizationId)
      .order('last_seen', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching assets for organization ${organizationId}:`, error);
    return [];
  }
}

export async function fetchAssetsByIpRange(network: string, netmask: string) {
  try {
    const { data: assets, error } = await supabase
      .from('assets')
      .select('*')
      .not('src_ip', 'is', null);

    if (error) throw error;
    
    const inRange = assets?.filter(asset => {
      if (!asset.src_ip) return false;
      
      const ipParts = asset.src_ip.split('.').map(part => parseInt(part, 10));
      const networkParts = network.split('.').map(part => parseInt(part, 10));
      const maskParts = netmask.split('.').map(part => parseInt(part, 10));
      
      for (let i = 0; i < 4; i++) {
        if ((ipParts[i] & maskParts[i]) !== (networkParts[i] & maskParts[i])) {
          return false;
        }
      }
      
      return true;
    });
    
    return inRange || [];
  } catch (error) {
    console.error(`Error fetching assets for IP range ${network}/${netmask}:`, error);
    return [];
  }
}

export async function fetchAssetsByVendor(vendor: string) {
  try {
    const { data, error } = await supabase
      .from('assets')
      .select('*')
      .ilike('mac_address', `${vendor}%`);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching assets for vendor ${vendor}:`, error);
    return [];
  }
}
