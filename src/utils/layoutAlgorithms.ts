import { Node, Edge } from '@xyflow/react';
import { LayoutType } from '@/components/topology/LayoutSelector';

export interface LayoutOptions {
  width: number;
  height: number;
  spacing: number;
}

export const applyLayout = (
  nodes: Node[],
  edges: Edge[],
  layoutType: LayoutType,
  options: LayoutOptions = { width: 800, height: 600, spacing: 150 }
): Node[] => {
  switch (layoutType) {
    case 'hierarchical':
      return applyHierarchicalLayout(nodes, edges, options);
    case 'circular':
      return applyCircularLayout(nodes, options);
    case 'grid':
      return applyGridLayout(nodes, options);
    case 'force':
      return applyForceDirectedLayout(nodes, edges, options);
    case 'radial':
      return applyRadialLayout(nodes, edges, options);
    default:
      return nodes;
  }
};

const applyHierarchicalLayout = (nodes: Node[], edges: Edge[], options: LayoutOptions): Node[] => {
  const levels: { [key: number]: Node[] } = {};
  const nodeDepths: { [key: string]: number } = {};
  
  // Find root nodes (nodes with no incoming edges)
  const incomingEdges = new Set(edges.map(e => e.target));
  const rootNodes = nodes.filter(node => !incomingEdges.has(node.id));
  
  // BFS to assign levels
  const queue = rootNodes.map(node => ({ node, depth: 0 }));
  const visited = new Set<string>();
  
  while (queue.length > 0) {
    const { node, depth } = queue.shift()!;
    
    if (visited.has(node.id)) continue;
    visited.add(node.id);
    
    nodeDepths[node.id] = depth;
    if (!levels[depth]) levels[depth] = [];
    levels[depth].push(node);
    
    // Add children to queue
    const childEdges = edges.filter(e => e.source === node.id);
    childEdges.forEach(edge => {
      const childNode = nodes.find(n => n.id === edge.target);
      if (childNode && !visited.has(childNode.id)) {
        queue.push({ node: childNode, depth: depth + 1 });
      }
    });
  }
  
  // Position nodes
  return nodes.map(node => {
    const depth = nodeDepths[node.id] || 0;
    const levelNodes = levels[depth] || [];
    const indexInLevel = levelNodes.findIndex(n => n.id === node.id);
    
    const x = (indexInLevel - (levelNodes.length - 1) / 2) * options.spacing + options.width / 2;
    const y = depth * options.spacing + 100;
    
    return { ...node, position: { x, y } };
  });
};

const applyCircularLayout = (nodes: Node[], options: LayoutOptions): Node[] => {
  const centerX = options.width / 2;
  const centerY = options.height / 2;
  const radius = Math.min(options.width, options.height) / 3;
  
  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    return { ...node, position: { x, y } };
  });
};

const applyGridLayout = (nodes: Node[], options: LayoutOptions): Node[] => {
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const spacing = options.spacing;
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const x = col * spacing + 100;
    const y = row * spacing + 100;
    
    return { ...node, position: { x, y } };
  });
};

const applyForceDirectedLayout = (nodes: Node[], edges: Edge[], options: LayoutOptions): Node[] => {
  // Simple force-directed layout using basic physics
  const nodePositions = new Map(nodes.map(node => [node.id, { ...node.position }]));
  const iterations = 50;
  const repulsionStrength = 1000;
  const attractionStrength = 0.1;
  const damping = 0.9;
  
  for (let iter = 0; iter < iterations; iter++) {
    const forces = new Map(nodes.map(node => [node.id, { x: 0, y: 0 }]));
    
    // Repulsion between all nodes
    for (const node1 of nodes) {
      for (const node2 of nodes) {
        if (node1.id === node2.id) continue;
        
        const pos1 = nodePositions.get(node1.id)!;
        const pos2 = nodePositions.get(node2.id)!;
        const dx = pos1.x - pos2.x;
        const dy = pos1.y - pos2.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        
        const force = repulsionStrength / (distance * distance);
        const fx = (dx / distance) * force;
        const fy = (dy / distance) * force;
        
        const currentForce = forces.get(node1.id)!;
        forces.set(node1.id, { x: currentForce.x + fx, y: currentForce.y + fy });
      }
    }
    
    // Attraction along edges
    for (const edge of edges) {
      const pos1 = nodePositions.get(edge.source);
      const pos2 = nodePositions.get(edge.target);
      
      if (!pos1 || !pos2) continue;
      
      const dx = pos2.x - pos1.x;
      const dy = pos2.y - pos1.y;
      const distance = Math.sqrt(dx * dx + dy * dy) || 1;
      
      const force = distance * attractionStrength;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      
      const force1 = forces.get(edge.source)!;
      const force2 = forces.get(edge.target)!;
      forces.set(edge.source, { x: force1.x + fx, y: force1.y + fy });
      forces.set(edge.target, { x: force2.x - fx, y: force2.y - fy });
    }
    
    // Apply forces
    for (const node of nodes) {
      const pos = nodePositions.get(node.id)!;
      const force = forces.get(node.id)!;
      
      pos.x += force.x * damping;
      pos.y += force.y * damping;
      
      // Keep within bounds
      pos.x = Math.max(50, Math.min(options.width - 50, pos.x));
      pos.y = Math.max(50, Math.min(options.height - 50, pos.y));
    }
  }
  
  return nodes.map(node => ({
    ...node,
    position: nodePositions.get(node.id)!
  }));
};

const applyRadialLayout = (nodes: Node[], edges: Edge[], options: LayoutOptions): Node[] => {
  const centerX = options.width / 2;
  const centerY = options.height / 2;
  
  // Find central node (most connected)
  const connections = new Map<string, number>();
  edges.forEach(edge => {
    connections.set(edge.source, (connections.get(edge.source) || 0) + 1);
    connections.set(edge.target, (connections.get(edge.target) || 0) + 1);
  });
  
  const centralNode = nodes.reduce((prev, current) => 
    (connections.get(current.id) || 0) > (connections.get(prev.id) || 0) ? current : prev
  );
  
  // BFS from central node to assign levels
  const levels: { [key: number]: Node[] } = { 0: [centralNode] };
  const visited = new Set([centralNode.id]);
  const queue = [{ node: centralNode, level: 0 }];
  
  while (queue.length > 0) {
    const { node, level } = queue.shift()!;
    
    const connectedEdges = edges.filter(e => e.source === node.id || e.target === node.id);
    connectedEdges.forEach(edge => {
      const connectedNodeId = edge.source === node.id ? edge.target : edge.source;
      const connectedNode = nodes.find(n => n.id === connectedNodeId);
      
      if (connectedNode && !visited.has(connectedNodeId)) {
        visited.add(connectedNodeId);
        const nextLevel = level + 1;
        if (!levels[nextLevel]) levels[nextLevel] = [];
        levels[nextLevel].push(connectedNode);
        queue.push({ node: connectedNode, level: nextLevel });
      }
    });
  }
  
  // Position nodes in concentric circles
  return nodes.map(node => {
    if (node.id === centralNode.id) {
      return { ...node, position: { x: centerX, y: centerY } };
    }
    
    let level = 0;
    for (const [lvl, levelNodes] of Object.entries(levels)) {
      if (levelNodes.some(n => n.id === node.id)) {
        level = parseInt(lvl);
        break;
      }
    }
    
    const levelNodes = levels[level] || [];
    const indexInLevel = levelNodes.findIndex(n => n.id === node.id);
    const radius = level * 120 + 80;
    const angle = (2 * Math.PI * indexInLevel) / levelNodes.length;
    
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    return { ...node, position: { x, y } };
  });
};
