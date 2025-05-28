
import React from 'react';
import { Lock, Unlock, RotateCcw, Grid, Zap, Plus, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LayoutSelector, LayoutType } from './LayoutSelector';

interface NetworkToolbarProps {
  isLocked: boolean;
  onToggleLock: () => void;
  onAutoLayout: () => void;
  onGridLayout: () => void;
  onAddDevice: () => void;
  onReset: () => void;
  animationsEnabled: boolean;
  onToggleAnimations: () => void;
  newDeviceCount?: number;
  selectedLayout: LayoutType;
  onLayoutChange: (layout: LayoutType) => void;
  spacing?: number;
  onSpacingChange?: (spacing: number) => void;
}

export const NetworkToolbar: React.FC<NetworkToolbarProps> = ({
  isLocked,
  onToggleLock,
  onAutoLayout,
  onGridLayout,
  onAddDevice,
  onReset,
  animationsEnabled,
  onToggleAnimations,
  newDeviceCount = 0,
  selectedLayout,
  onLayoutChange,
  spacing = 200,
  onSpacingChange
}) => {
  return (
    <div className="absolute top-16 left-4 z-10 bg-black/80 border border-blue-600 rounded-lg p-2 flex items-center gap-2 flex-wrap">
      <Button
        variant={isLocked ? "default" : "outline"}
        size="sm"
        onClick={onToggleLock}
        className={`${isLocked ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-blue-600 text-blue-300 hover:bg-blue-900/50'}`}
        title={isLocked ? "Unlock map (allow dragging)" : "Lock map (prevent dragging)"}
      >
        {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
        {isLocked ? "Locked" : "Unlocked"}
      </Button>

      <Separator orientation="vertical" className="h-6 bg-blue-600" />

      <LayoutSelector 
        selectedLayout={selectedLayout}
        onLayoutChange={onLayoutChange}
        variant="toggle"
      />

      <Separator orientation="vertical" className="h-6 bg-blue-600" />

      {onSpacingChange && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
                title="Adjust node spacing"
              >
                <Settings className="h-4 w-4 mr-1" />
                Spacing
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-black/90 border-blue-600">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-blue-300">
                    Node Spacing: {spacing}px
                  </label>
                  <Slider
                    value={[spacing]}
                    onValueChange={(value) => onSpacingChange(value[0])}
                    max={400}
                    min={100}
                    step={25}
                    className="w-full"
                  />
                </div>
                <div className="text-xs text-blue-400">
                  Adjust the distance between nodes in the layout
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Separator orientation="vertical" className="h-6 bg-blue-600" />
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onAutoLayout}
        className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
        title="Auto arrange layout"
        disabled={isLocked}
      >
        <RotateCcw className="h-4 w-4 mr-1" />
        Auto Layout
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onGridLayout}
        className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
        title="Arrange in grid"
        disabled={isLocked}
      >
        <Grid className="h-4 w-4 mr-1" />
        Grid
      </Button>

      <Separator orientation="vertical" className="h-6 bg-blue-600" />

      <Button
        variant="outline"
        size="sm"
        onClick={onAddDevice}
        className="border-blue-600 text-blue-300 hover:bg-blue-900/50"
        title="Add new device"
        disabled={isLocked}
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Device
      </Button>

      <Button
        variant={animationsEnabled ? "default" : "outline"}
        size="sm"
        onClick={onToggleAnimations}
        className={`${animationsEnabled ? 'bg-purple-600 hover:bg-purple-700' : 'border-blue-600 text-blue-300 hover:bg-blue-900/50'}`}
        title={animationsEnabled ? "Disable animations" : "Enable animations"}
      >
        <Zap className="h-4 w-4 mr-1" />
        Animations
      </Button>

      {newDeviceCount > 0 && (
        <>
          <Separator orientation="vertical" className="h-6 bg-blue-600" />
          <Badge variant="secondary" className="bg-green-600 text-white animate-pulse">
            +{newDeviceCount} New
          </Badge>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="border-red-600 text-red-300 hover:bg-red-900/50"
        title="Reset layout"
      >
        Reset
      </Button>
    </div>
  );
};
