
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAssets } from "@/lib/db/asset";
import { fetchNetworkDevices } from "@/lib/db/network";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkTopology } from "@/components/topology/NetworkTopology";
import { NetworkDeviceTree } from "@/components/topology/NetworkDeviceTree";
import { Asset } from "@/lib/db/types";
import { NetworkDevice } from "@/lib/db/types";
import { toast } from "@/hooks/use-toast";

const Topology = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [networkDevices, setNetworkDevices] = useState<NetworkDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | Asset | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [assetsData, networkDevicesData] = await Promise.all([
        fetchAssets(),
        fetchNetworkDevices()
      ]);
      
      // Transform the database assets to match our Asset type
      const typedAssets: Asset[] = assetsData.map(asset => ({
        ...asset,
        // Ensure experience is one of the allowed values or null
        experience: (asset.experience === 'Excellent' || 
                    asset.experience === 'Good' || 
                    asset.experience === 'Fair' || 
                    asset.experience === 'Poor') 
                    ? asset.experience as 'Excellent' | 'Good' | 'Fair' | 'Poor' 
                    : null
      }));
      
      setAssets(typedAssets);
      setNetworkDevices(networkDevicesData);
    } catch (error) {
      console.error("Error fetching data for topology view:", error);
      toast({
        title: "Error loading topology data",
        description: "Could not load network devices and connections",
        variant: "destructive",
      });
      
      // If no data was loaded, set both to empty arrays to ensure the sample data is shown
      setAssets([]);
      setNetworkDevices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    fetchData();
  };

  const handleDeviceClick = (device: NetworkDevice | Asset) => {
    setSelectedDevice(device);
    console.log('Device selected:', device);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Network Topology</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-200px)]">
        {/* Device Tree - Left Sidebar */}
        <div className="lg:col-span-1">
          {loading ? (
            <Card className="bg-black border-blue-600 h-full">
              <CardContent className="flex items-center justify-center h-full">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                  <span className="text-sm text-blue-500">Loading devices...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <NetworkDeviceTree 
              assets={assets} 
              networkDevices={networkDevices}
              onDeviceClick={handleDeviceClick}
            />
          )}
        </div>

        {/* Main Topology View */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden h-full">
            <CardHeader className="pb-3">
              <CardTitle>Network Topology Map</CardTitle>
              <CardDescription>
                Interactive visualization of your network devices and connections
                {selectedDevice && (
                  <span className="block mt-1 text-blue-500">
                    Selected: {selectedDevice.name || 'Unknown Device'}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[calc(100vh-300px)] bg-black bg-opacity-90 border-t">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                    <span className="ml-2 text-blue-500">Loading network topology...</span>
                  </div>
                ) : (
                  <NetworkTopology 
                    assets={assets} 
                    networkDevices={networkDevices} 
                    selectedDevice={selectedDevice}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Topology;
