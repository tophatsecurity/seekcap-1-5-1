
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Organization, OrganizationIpRange, OrganizationVendor } from "./types";

// Organization CRUD functions
export async function fetchOrganizations() {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching organizations:", error);
    toast({
      title: "Error fetching organizations",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return [];
  }
}

export async function fetchOrganization(id: number) {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching organization with ID ${id}:`, error);
    toast({
      title: "Error fetching organization",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

export async function createOrganization(organization: Omit<Organization, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .insert([organization])
      .select();

    if (error) throw error;
    
    toast({
      title: "Organization created",
      description: `${organization.name} has been created successfully.`,
    });
    
    return data?.[0] || null;
  } catch (error) {
    console.error("Error creating organization:", error);
    toast({
      title: "Error creating organization",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

export async function updateOrganization(id: number, organization: Partial<Omit<Organization, 'id' | 'created_at'>>) {
  try {
    const { data, error } = await supabase
      .from('organizations')
      .update(organization)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    toast({
      title: "Organization updated",
      description: "Organization has been updated successfully.",
    });
    
    return data?.[0] || null;
  } catch (error) {
    console.error(`Error updating organization with ID ${id}:`, error);
    toast({
      title: "Error updating organization",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteOrganization(id: number) {
  try {
    const { error } = await supabase
      .from('organizations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast({
      title: "Organization deleted",
      description: "Organization has been deleted successfully.",
    });
    
    return true;
  } catch (error) {
    console.error(`Error deleting organization with ID ${id}:`, error);
    toast({
      title: "Error deleting organization",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

// IP Range CRUD functions
export async function fetchOrganizationIpRanges(organizationId: number) {
  try {
    const { data, error } = await supabase
      .from('organization_ip_ranges')
      .select('*')
      .eq('organization_id', organizationId)
      .order('network');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching IP ranges for organization ${organizationId}:`, error);
    return [];
  }
}

export async function addOrganizationIpRange(ipRange: Omit<OrganizationIpRange, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('organization_ip_ranges')
      .insert([ipRange])
      .select();

    if (error) throw error;
    
    toast({
      title: "IP Range added",
      description: `IP Range ${ipRange.network}/${ipRange.netmask} has been added.`,
    });
    
    return data?.[0] || null;
  } catch (error) {
    console.error("Error adding IP range:", error);
    toast({
      title: "Error adding IP range",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteOrganizationIpRange(id: number) {
  try {
    const { error } = await supabase
      .from('organization_ip_ranges')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast({
      title: "IP Range deleted",
      description: "IP Range has been removed.",
    });
    
    return true;
  } catch (error) {
    console.error(`Error deleting IP range with ID ${id}:`, error);
    toast({
      title: "Error deleting IP range",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

// Vendor CRUD functions
export async function fetchOrganizationVendors(organizationId: number) {
  try {
    const { data, error } = await supabase
      .from('organization_vendors')
      .select('*')
      .eq('organization_id', organizationId)
      .order('vendor');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching vendors for organization ${organizationId}:`, error);
    return [];
  }
}

export async function addOrganizationVendor(vendor: Omit<OrganizationVendor, 'id'>) {
  try {
    const { data, error } = await supabase
      .from('organization_vendors')
      .insert([vendor])
      .select();

    if (error) throw error;
    
    toast({
      title: "Vendor added",
      description: `Vendor ${vendor.vendor} has been added.`,
    });
    
    return data?.[0] || null;
  } catch (error) {
    console.error("Error adding vendor:", error);
    toast({
      title: "Error adding vendor",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

export async function deleteOrganizationVendor(id: number) {
  try {
    const { error } = await supabase
      .from('organization_vendors')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    toast({
      title: "Vendor deleted",
      description: "Vendor has been removed.",
    });
    
    return true;
  } catch (error) {
    console.error(`Error deleting vendor with ID ${id}:`, error);
    toast({
      title: "Error deleting vendor",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

// Asset assignment
export async function assignAssetToOrganization(macAddress: string, organizationId: number | null) {
  try {
    const { error } = await supabase
      .from('assets')
      .update({ organization_id: organizationId })
      .eq('mac_address', macAddress);

    if (error) throw error;
    
    toast({
      title: "Asset assigned",
      description: organizationId 
        ? "Asset has been assigned to the organization." 
        : "Asset has been unassigned from the organization.",
    });
    
    return true;
  } catch (error) {
    console.error(`Error assigning asset ${macAddress} to organization:`, error);
    toast({
      title: "Error assigning asset",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

// Utility function to check if an IP address is within a subnet
export function isIpInSubnet(ip: string, subnet: string, netmask: string): boolean {
  try {
    const ipParts = ip.split('.').map(part => parseInt(part, 10));
    const subnetParts = subnet.split('.').map(part => parseInt(part, 10));
    const maskParts = netmask.split('.').map(part => parseInt(part, 10));
    
    for (let i = 0; i < 4; i++) {
      // Check if the masked portions of the IP and subnet match
      if ((ipParts[i] & maskParts[i]) !== (subnetParts[i] & maskParts[i])) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking IP in subnet:", error);
    return false;
  }
}
