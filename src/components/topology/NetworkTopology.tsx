
import React, { useState, useEffect } from 'react';
import { Asset, NetworkDevice } from '@/lib/db/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkToolbar } from './NetworkToolbar';
import { DeviceTopologyView } from './DeviceTopologyView';
import { FlowMapView } from './FlowMapView';
import { LayoutType } from './LayoutSelector';
import { generateDetailedSampleAssets, generateRealisticNetworkDevices } from '@/utils/sampleTopologyData';

interface NetworkTopologyProps {
  assets: Asset[];
  networkDevices: NetworkDevice[];
  selectedDevice?: NetworkDevice | Asset | null;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({ 
  assets: propAssets, 
  networkDevices: propNetworkDevices,
  selectedDevice
}) => {
  const [isLocked, setIsLocked] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [newDeviceCount, setNewDeviceCount] = useState(0);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('hierarchical');
  const [spacing, setSpacing] = useState(200);
  
  // Use enhanced sample data if no real data provided
  const assets = propAssets.length === 0 ? generateDetailedSampleAssets() : propAssets;
  const networkDevices = propNetworkDevices.length === 0 ? generateRealisticNetworkDevices() : propNetworkDevices;

  const handleAddDevice = (portId?: string) => {
    console.log('Adding device to port:', portId);
    setNewDeviceCount(prev => prev + 1);
  };

  const handleAutoLayout = () => {
    // This will trigger a layout update in the topology view
    console.log('Auto layout triggered with layout type:', selectedLayout, 'spacing:', spacing);
  };

  const handleGridLayout = () => {
    setSelectedLayout('grid');
    console.log('Grid layout triggered with spacing:', spacing);
  };

  const handleReset = () => {
    setNewDeviceCount(0);
    setSelectedLayout('hierarchical');
    setSpacing(200);
    console.log('Reset triggered');
  };

  const handleLayoutChange = (layout: LayoutType) => {
    setSelectedLayout(layout);
    console.log('Layout changed to:', layout, 'with spacing:', spacing);
  };

  const handleSpacingChange = (newSpacing: number) => {
    setSpacing(newSpacing);
    console.log('Spacing changed to:', newSpacing);
  };

  // Simulate new device discovery
  useEffect(() => {
    if (animationsEnabled && !isLocked) {
      const interval = setInterval(() => {
        if (Math.random() > 0.95) {
          setNewDeviceCount(prev => prev + 1);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [animationsEnabled, isLocked]);

  return (
    <div className="w-full h-full relative">
      <NetworkToolbar
        isLocked={isLocked}
        onToggleLock={() => setIsLocked(!isLocked)}
        onAutoLayout={handleAutoLayout}
        onGridLayout={handleGridLayout}
        onAddDevice={() => handleAddDevice()}
        onReset={handleReset}
        animationsEnabled={animationsEnabled}
        onToggleAnimations={() => setAnimationsEnabled(!animationsEnabled)}
        newDeviceCount={newDeviceCount}
        selectedLayout={selectedLayout}
        onLayoutChange={handleLayoutChange}
        spacing={spacing}
        onSpacingChange={handleSpacingChange}
      />
      
      <Tabs defaultValue="topology" className="w-full h-full">
        <TabsList className="absolute top-4 left-4 z-10 bg-black/80 border-blue-600">
          <TabsTrigger value="topology" className="text-blue-300 data-[state=active]:bg-blue-900/50">
            Device Topology
          </TabsTrigger>
          <TabsTrigger value="flowmap" className="text-blue-300 data-[state=active]:bg-blue-900/50">
            Flow Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="topology" className="w-full h-full mt-0">
          <DeviceTopologyView
            assets={assets}
            networkDevices={networkDevices}
            selectedDevice={selectedDevice}
            isLocked={isLocked}
            onAddDevice={handleAddDevice}
            selectedLayout={selectedLayout}
            spacing={spacing}
          />
        </TabsContent>

        <TabsContent value="flowmap" className="w-full h-full mt-0">
          <FlowMapView
            isLocked={isLocked}
            animationsEnabled={animationsEnabled}
            selectedLayout={selectedLayout}
            spacing={spacing}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
