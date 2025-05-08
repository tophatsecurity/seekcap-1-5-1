
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface PcapFile {
  id: number;
  file_name: string;
  file_size_bytes: number;
  device_id: number | null;
  capture_start: string;
  capture_end: string | null;
  status: 'capturing' | 'completed' | 'failed' | 'processing';
  packet_count: number | null;
  storage_path: string;
  created_at: string;
  device?: {
    name: string;
    vendor: string;
  };
}

export async function fetchPcapFiles(): Promise<PcapFile[]> {
  try {
    // Note: There's currently an issue with the foreign key constraint,
    // so we'll only fetch the basic pcap files data without the join
    const { data, error } = await supabase
      .from('pcap_files')
      .select('*')
      .order('capture_start', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching PCAP files:", error);
    toast({
      title: "Error fetching capture files",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return [];
  }
}

export async function createPcapFile(pcapFile: Omit<PcapFile, 'id' | 'created_at'>): Promise<PcapFile | null> {
  try {
    const { data, error } = await supabase
      .from('pcap_files')
      .insert({
        file_name: pcapFile.file_name,
        file_size_bytes: pcapFile.file_size_bytes,
        device_id: pcapFile.device_id,
        capture_start: pcapFile.capture_start,
        capture_end: pcapFile.capture_end,
        status: pcapFile.status,
        packet_count: pcapFile.packet_count,
        storage_path: pcapFile.storage_path
      })
      .select()
      .single();
    
    if (error) throw error;
    
    toast({
      title: "Capture file added",
      description: `${pcapFile.file_name} has been saved.`,
    });
    
    return data;
  } catch (error) {
    console.error("Error creating PCAP file record:", error);
    toast({
      title: "Error saving capture file",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

export async function updatePcapFileStatus(
  id: number, 
  status: 'capturing' | 'completed' | 'failed' | 'processing',
  packetCount?: number,
  captureEnd?: string
): Promise<boolean> {
  try {
    const updateData: any = { status };
    if (packetCount !== undefined) updateData.packet_count = packetCount;
    if (captureEnd) updateData.capture_end = captureEnd;
    
    const { error } = await supabase
      .from('pcap_files')
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating PCAP file status:", error);
    toast({
      title: "Error updating capture file",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

export async function deletePcapFile(id: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('pcap_files')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast({
      title: "Capture file deleted",
      description: "The capture file has been removed.",
    });
    
    return true;
  } catch (error) {
    console.error("Error deleting PCAP file:", error);
    toast({
      title: "Error deleting capture file",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}
