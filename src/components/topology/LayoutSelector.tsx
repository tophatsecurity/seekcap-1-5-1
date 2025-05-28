
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Grid, Circle, TreePine, Zap, Layers } from 'lucide-react';

export type LayoutType = 'hierarchical' | 'circular' | 'grid' | 'force' | 'radial';

interface LayoutSelectorProps {
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  variant?: 'select' | 'toggle';
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({
  selectedLayout,
  onLayoutChange,
  variant = 'toggle'
}) => {
  const layouts = [
    { value: 'hierarchical', label: 'Hierarchical', icon: TreePine },
    { value: 'circular', label: 'Circular', icon: Circle },
    { value: 'grid', label: 'Grid', icon: Grid },
    { value: 'force', label: 'Force-Directed', icon: Zap },
    { value: 'radial', label: 'Radial', icon: Layers },
  ] as const;

  if (variant === 'select') {
    return (
      <Select value={selectedLayout} onValueChange={(value) => onLayoutChange(value as LayoutType)}>
        <SelectTrigger className="w-40 border-blue-600 text-blue-300 bg-black/80">
          <SelectValue placeholder="Select Layout" />
        </SelectTrigger>
        <SelectContent className="bg-black/90 border-blue-600">
          {layouts.map((layout) => (
            <SelectItem 
              key={layout.value} 
              value={layout.value}
              className="text-blue-300 hover:bg-blue-900/50"
            >
              <div className="flex items-center gap-2">
                <layout.icon className="h-4 w-4" />
                {layout.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <ToggleGroup 
      type="single" 
      value={selectedLayout} 
      onValueChange={(value) => value && onLayoutChange(value as LayoutType)}
      className="bg-black/80 border border-blue-600 rounded-lg p-1"
    >
      {layouts.map((layout) => (
        <ToggleGroupItem 
          key={layout.value} 
          value={layout.value}
          className="text-blue-300 hover:bg-blue-900/50 data-[state=on]:bg-blue-600 data-[state=on]:text-white"
          title={layout.label}
        >
          <layout.icon className="h-4 w-4" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
