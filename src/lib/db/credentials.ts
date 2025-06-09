
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CredentialSet } from "./types";

export async function fetchCredentialSets(): Promise<CredentialSet[]> {
  try {
    const { data, error } = await supabase
      .from('credential_sets')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching credential sets:", error);
    toast({
      title: "Error fetching credentials",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return [];
  }
}

export async function createCredentialSet(credentialData: Omit<CredentialSet, 'id' | 'created_at' | 'updated_at'>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('credential_sets')
      .insert({
        name: credentialData.name,
        user_name: credentialData.user_name,
        password: credentialData.password,
        enable_required: credentialData.enable_required || false,
        enable_password: credentialData.enable_password || null,
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error creating credential set:", error);
    toast({
      title: "Error creating credential set",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

export async function updateCredentialSet(
  id: number, 
  credentialData: Omit<CredentialSet, 'id' | 'created_at' | 'updated_at'>
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('credential_sets')
      .update({
        name: credentialData.name,
        user_name: credentialData.user_name,
        password: credentialData.password,
        enable_required: credentialData.enable_required || false,
        enable_password: credentialData.enable_password || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating credential set:", error);
    toast({
      title: "Error updating credential set",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

export async function deleteCredentialSet(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('credential_sets')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Credential set deleted",
      description: "The credential set has been successfully removed.",
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting credential set:", error);
    toast({
      title: "Error deleting credential set",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}
