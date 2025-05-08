
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Typings for topology data
export interface TopologyNode {
  id: number;
  name: string;
  type: 'device' | 'router' | 'switch' | 'vlan' | 'server' | 'endpoint';
  x_position: number;
  y_position: number;
  properties: Record<string, any>;
  organization_id?: number;
  created_at: string;
  updated_at: string;
}

export interface TopologyEdge {
  id: number;
  source_id: number;
  target_id: number;
  label?: string;
  type?: 'wired' | 'wireless' | 'virtual';
  properties?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

// Fetch topology nodes and edges
export async function fetchTopology(): Promise<{ nodes: TopologyNode[], edges: TopologyEdge[] }> {
  try {
    const [nodesResult, edgesResult] = await Promise.all([
      (supabase.from('topology_nodes').select('*') as any),
      (supabase.from('topology_edges').select('*') as any)
    ]);
    
    if (nodesResult.error) throw nodesResult.error;
    if (edgesResult.error) throw edgesResult.error;
    
    return {
      nodes: nodesResult.data || [],
      edges: edgesResult.data || []
    };
  } catch (error) {
    console.error("Error fetching topology data:", error);
    toast({
      title: "Error fetching network topology",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return { nodes: [], edges: [] };
  }
}

// Update node position
export async function updateNodePosition(nodeId: number, x: number, y: number): Promise<boolean> {
  try {
    const { error } = await (supabase
      .from('topology_nodes')
      .update({
        x_position: x,
        y_position: y,
        updated_at: new Date().toISOString()
      })
      .eq('id', nodeId) as any);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating node position:", error);
    toast({
      title: "Error updating topology",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

// Create new node
export async function createNode(node: Omit<TopologyNode, 'id' | 'created_at' | 'updated_at'>): Promise<TopologyNode | null> {
  try {
    const { data, error } = await (supabase
      .from('topology_nodes')
      .insert({
        name: node.name,
        type: node.type,
        x_position: node.x_position,
        y_position: node.y_position,
        properties: node.properties,
        organization_id: node.organization_id
      })
      .select()
      .single() as any);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating topology node:", error);
    toast({
      title: "Error creating node",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

// Create new edge
export async function createEdge(edge: Omit<TopologyEdge, 'id' | 'created_at' | 'updated_at'>): Promise<TopologyEdge | null> {
  try {
    const { data, error } = await (supabase
      .from('topology_edges')
      .insert({
        source_id: edge.source_id,
        target_id: edge.target_id,
        label: edge.label,
        type: edge.type,
        properties: edge.properties
      })
      .select()
      .single() as any);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating topology edge:", error);
    toast({
      title: "Error creating connection",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return null;
  }
}

// Delete node
export async function deleteNode(nodeId: number): Promise<boolean> {
  try {
    const { error } = await (supabase
      .from('topology_nodes')
      .delete()
      .eq('id', nodeId) as any);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting topology node:", error);
    toast({
      title: "Error deleting node",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}

// Delete edge
export async function deleteEdge(edgeId: number): Promise<boolean> {
  try {
    const { error } = await (supabase
      .from('topology_edges')
      .delete()
      .eq('id', edgeId) as any);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting topology edge:", error);
    toast({
      title: "Error deleting connection",
      description: error instanceof Error ? error.message : "Unknown error",
      variant: "destructive",
    });
    return false;
  }
}
