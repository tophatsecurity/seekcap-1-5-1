
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type SystemSettingKey = 'general' | 'notification' | 'security' | 'storage' | 'ui';

export interface SystemSetting {
  id: number;
  setting_key: SystemSettingKey;
  setting_value: Record<string, any>;
  description: string | null;
  updated_at: string;
  updated_by: string | null;
}

export async function fetchSystemSettings(): Promise<SystemSetting[]> {
  try {
    // Use any type to override TypeScript's type checking for tables not in the schema
    const { data, error } = await (supabase
      .from('system_settings' as any)
      .select('*')) as unknown as { data: SystemSetting[] | null, error: any };
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching system settings:", error);
    toast({
      title: "Error fetching settings",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return [];
  }
}

export async function fetchSingleSetting(key: SystemSettingKey): Promise<SystemSetting | null> {
  try {
    // Use any type to override TypeScript's type checking for tables not in the schema
    const { data, error } = await (supabase
      .from('system_settings' as any)
      .select('*')
      .eq('setting_key', key)
      .maybeSingle()) as unknown as { data: SystemSetting | null, error: any };
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching ${key} settings:`, error);
    toast({
      title: `Error fetching ${key} settings`,
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

export async function updateSystemSetting(
  key: SystemSettingKey, 
  value: Record<string, any>,
  userId?: string
): Promise<boolean> {
  try {
    // Use any type to override TypeScript's type checking for tables not in the schema
    const { error } = await (supabase
      .from('system_settings' as any)
      .update({
        setting_value: value,
        updated_at: new Date().toISOString(),
        updated_by: userId || 'system'
      })
      .eq('setting_key', key)) as unknown as { error: any };
    
    if (error) throw error;
    
    toast({
      title: "Settings updated",
      description: `${key.charAt(0).toUpperCase() + key.slice(1)} settings have been updated.`,
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating ${key} settings:`, error);
    toast({
      title: `Error updating ${key} settings`,
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}
