import { Node, Edge } from '@xyflow/react';
import { LayoutType } from '@/components/topology/LayoutSelector';

interface LayoutOptions {
  width: number;
  height: number;
  spacing: number;
}

export function applyLayout(
  nodes: Node[], 
  edges: Edge[], 
  layoutType: LayoutType, 
  options: LayoutOptions
): Node[] {
  const { width, height, spacing } = options;

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
}

function applyHierarchicalLayout(nodes: Node[], edges: Edge[], options: LayoutOptions): Node[] {
  const { spacing } = options;
  const levels: { [key: string]: number } = {};
  const nodeChildren: { [key: string]: string[] } = {};
  
  // Build hierarchy from edges
  edges.forEach(edge => {
    if (!nodeChildren[edge.source]) {
      nodeChildren[edge.source] = [];
    }
    nodeChildren[edge.source].push(edge.target);
  });

  // Find root nodes (nodes with no incoming edges)
  const hasIncoming = new Set(edges.map(edge => edge.target));
  const rootNodes = nodes.filter(node => !hasIncoming.has(node.id));

  // Assign levels using BFS
  const queue = rootNodes.map(node => ({ id: node.id, level: 0 }));
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    levels[id] = level;
    
    if (nodeChildren[id]) {
      nodeChildren[id].forEach(childId => {
        if (levels[childId] === undefined || levels[childId] < level + 1) {
          queue.push({ id: childId, level: level + 1 });
        }
      });
    }
  }

  // Group nodes by level
  const levelGroups: { [level: number]: Node[] } = {};
  nodes.forEach(node => {
    const level = levels[node.id] || 0;
    if (!levelGroups[level]) {
      levelGroups[level] = [];
    }
    levelGroups[level].push(node);
  });

  // Position nodes
  return nodes.map(node => {
    const level = levels[node.id] || 0;
    const levelNodes = levelGroups[level];
    const indexInLevel = levelNodes.findIndex(n => n.id === node.id);
    const levelWidth = levelNodes.length * spacing;
    const startX = (options.width - levelWidth) / 2;

    return {
      ...node,
      position: {
        x: startX + indexInLevel * spacing,
        y: level * spacing * 1.5 + 50
      }
    };
  });
}

function applyCircularLayout(nodes: Node[], options: LayoutOptions): Node[] {
  const { width, height, spacing } = options;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 3 + (spacing / 10);

  return nodes.map((node, index) => {
    const angle = (2 * Math.PI * index) / nodes.length;
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    };
  });
}

function applyGridLayout(nodes: Node[], options: LayoutOptions): Node[] {
  const { spacing } = options;
  const cols = Math.ceil(Math.sqrt(nodes.length));
  
  return nodes.map((node, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    
    return {
      ...node,
      position: {
        x: col * spacing + 50,
        y: row * spacing + 50
      }
    };
  });
}

function applyForceDirectedLayout(nodes: Node[], edges: Edge[], options: LayoutOptions): Node[] {
  const { width, height, spacing } = options;
  
  // Simple force-directed layout simulation
  const positions = new Map(nodes.map(node => [
    node.id, 
    { 
      x: Math.random() * width, 
      y: Math.random() * height,
      vx: 0,
      vy: 0
    }
  ]));

  const iterations = 100;
  const k = spacing / 2; // Spring constant
  const repulsion = spacing * 5; // Repulsion strength

  for (let i = 0; i < iterations; i++) {
    // Reset forces
    positions.forEach(pos => {
      pos.vx = 0;
      pos.vy = 0;
    });

    // Repulsion between all nodes
    nodes.forEach(nodeA => {
      nodes.forEach(nodeB => {
        if (nodeA.id !== nodeB.id) {
          const posA = positions.get(nodeA.id)!;
          const posB = positions.get(nodeB.id)!;
          const dx = posA.x - posB.x;
          const dy = posA.y - posB.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = repulsion / (distance * distance);
          
          posA.vx += (dx / distance) * force;
          posA.vy += (dy / distance) * force;
        }
      });
    });

    // Attraction along edges
    edges.forEach(edge => {
      const posA = positions.get(edge.source);
      const posB = positions.get(edge.target);
      if (posA && posB) {
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (distance - k) * 0.1;
        
        posA.vx += (dx / distance) * force;
        posA.vy += (dy / distance) * force;
        posB.vx -= (dx / distance) * force;
        posB.vy -= (dy / distance) * force;
      }
    });

    // Update positions
    positions.forEach(pos => {
      pos.x += pos.vx * 0.1;
      pos.y += pos.vy * 0.1;
      
      // Keep within bounds
      pos.x = Math.max(50, Math.min(width - 50, pos.x));
      pos.y = Math.max(50, Math.min(height - 50, pos.y));
    });
  }

  return nodes.map(node => {
    const pos = positions.get(node.id)!;
    return {
      ...node,
      position: { x: pos.x, y: pos.y }
    };
  });
}

function applyRadialLayout(nodes: Node[], edges: Edge[], options: LayoutOptions): Node[] {
  const { width, height, spacing } = options;
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Find root nodes (nodes with no incoming edges)
  const hasIncoming = new Set(edges.map(edge => edge.target));
  const rootNodes = nodes.filter(node => !hasIncoming.has(node.id));
  
  if (rootNodes.length === 0) {
    return applyCircularLayout(nodes, options);
  }

  const levels: { [key: string]: number } = {};
  const nodeChildren: { [key: string]: string[] } = {};
  
  // Build hierarchy
  edges.forEach(edge => {
    if (!nodeChildren[edge.source]) {
      nodeChildren[edge.source] = [];
    }
    nodeChildren[edge.source].push(edge.target);
  });

  // Assign levels using BFS from root
  const queue = rootNodes.map(node => ({ id: node.id, level: 0 }));
  while (queue.length > 0) {
    const { id, level } = queue.shift()!;
    levels[id] = level;
    
    if (nodeChildren[id]) {
      nodeChildren[id].forEach(childId => {
        if (levels[childId] === undefined) {
          queue.push({ id: childId, level: level + 1 });
        }
      });
    }
  }

  // Group nodes by level
  const levelGroups: { [level: number]: Node[] } = {};
  nodes.forEach(node => {
    const level = levels[node.id] || 0;
    if (!levelGroups[level]) {
      levelGroups[level] = [];
    }
    levelGroups[level].push(node);
  });

  // Position nodes in concentric circles
  return nodes.map(node => {
    const level = levels[node.id] || 0;
    const levelNodes = levelGroups[level];
    const indexInLevel = levelNodes.findIndex(n => n.id === node.id);
    
    if (level === 0) {
      // Root nodes at center
      return {
        ...node,
        position: {
          x: centerX + (indexInLevel - rootNodes.length / 2) * spacing / 2,
          y: centerY
        }
      };
    }
    
    const radius = level * spacing * 0.8;
    const angle = (2 * Math.PI * indexInLevel) / levelNodes.length;
    
    return {
      ...node,
      position: {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    };
  });
}
