
// Weighted selection utility
interface WeightedItem {
  weight: number;
  [key: string]: any;
}

export function weightedRandom<T extends WeightedItem>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item;
    }
  }
  
  return items[items.length - 1];
}

// Define vendor data with weights favoring Rockwell
export const vendorData = [
  { name: 'Rockwell Automation', weight: 35 },
  { name: 'Allen-Bradley', weight: 25 },
  { name: 'Siemens', weight: 15 },
  { name: 'Schneider Electric', weight: 8 },
  { name: 'ABB', weight: 5 },
  { name: 'Honeywell', weight: 4 },
  { name: 'Emerson', weight: 3 },
  { name: 'General Electric', weight: 2 },
  { name: 'Yokogawa', weight: 2 },
  { name: 'Cisco Systems', weight: 1 }
];
