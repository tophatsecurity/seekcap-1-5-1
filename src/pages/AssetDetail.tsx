
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAssetDetails } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Server, Wifi, Clock, Info, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useJsonData } from "@/context/JsonDataContext";
import { useEffect, useState } from "react";

const AssetDetail = () => {
  const { macAddress } = useParams<{ macAddress: string }>();
  const { bannersData } = useJsonData();
  const [bannerDetails, setBannerDetails] = useState<any>(null);
  
  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", macAddress],
    queryFn: () => fetchAssetDetails(macAddress as string),
    enabled: !!macAddress,
  });

  useEffect(() => {
    if (bannersData && macAddress && bannersData[macAddress]) {
      setBannerDetails(bannersData[macAddress]);
    } else {
      setBannerDetails(null);
    }
  }, [bannersData, macAddress]);

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading asset details...</p>
      </div>
    );
  }

  // If we have neither asset data nor banner data, show not found
  const hasAssetData = asset || bannerDetails;
  
  if (!hasAssetData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-bold">Asset not found</h2>
        <p className="text-muted-foreground">
          The asset with MAC address {macAddress} could not be found.
        </p>
        <Button asChild>
          <Link to="/assets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Assets
          </Link>
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  // Create a safe combined asset object that doesn't rely on potentially undefined properties
  const combinedAsset = {
    mac_address: macAddress || "",
    src_ip: asset?.src_ip || bannerDetails?.src_ip || "—",
    eth_proto: asset?.eth_proto || "—",
    hostname: bannerDetails?.hostname || "—",
    last_seen: asset?.last_seen || "",
    ip_protocols: asset?.ip_protocols || [],
    tcp_ports: asset?.tcp_ports || [],
    udp_ports: asset?.udp_ports || [],
    scada_protocols: asset?.scada_protocols || [],
    scada_data: asset?.scada_data || {},
    icmp: asset?.icmp || false
  };

  // Safely access banner records
  const bannerRecords = bannerDetails?.records || {};
  const hasBannerData = Object.keys(bannerRecords).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/assets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Asset Details</h1>
        
        {bannerDetails && (
          <Badge variant="outline" className="ml-2">Banner Data Available</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MAC Address</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold break-all">{combinedAsset.mac_address}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">IP Address</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{combinedAsset.src_ip}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Hostname</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{combinedAsset.hostname}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Seen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg">{combinedAsset.last_seen ? formatDate(combinedAsset.last_seen) : "—"}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={hasBannerData ? "banners" : "overview"} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ports">Ports</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="scada">SCADA Data</TabsTrigger>
          <TabsTrigger value="banners" disabled={!hasBannerData}>
            Banners 
            {hasBannerData && <Badge variant="outline" className="ml-2">{Object.keys(bannerRecords).length}</Badge>}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Overview</CardTitle>
              <CardDescription>Basic information about this device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Ethernet Protocol</h3>
                  <p className="text-md">{combinedAsset.eth_proto}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">ICMP Status</h3>
                  <p className="text-md">{combinedAsset.icmp ? "Responding" : "Not responding"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">IP Protocols</h3>
                {combinedAsset.ip_protocols.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {combinedAsset.ip_protocols.map((protocol: string) => (
                      <Badge key={protocol} variant="outline">{protocol}</Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No IP protocols detected</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ports" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TCP Ports</CardTitle>
              <CardDescription>Open TCP ports on this device</CardDescription>
            </CardHeader>
            <CardContent>
              {combinedAsset.tcp_ports.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {combinedAsset.tcp_ports.map((port: number) => (
                    <Badge key={port} variant="outline">
                      {port}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No TCP ports detected</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>UDP Ports</CardTitle>
              <CardDescription>Open UDP ports on this device</CardDescription>
            </CardHeader>
            <CardContent>
              {combinedAsset.udp_ports.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {combinedAsset.udp_ports.map((port: number) => (
                    <Badge key={port} variant="outline">
                      {port}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No UDP ports detected</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="protocols" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SCADA Protocols</CardTitle>
              <CardDescription>Industrial protocols detected</CardDescription>
            </CardHeader>
            <CardContent>
              {combinedAsset.scada_protocols.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {combinedAsset.scada_protocols.map((protocol: string) => (
                    <Badge key={protocol} variant="outline">{protocol}</Badge>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" />
                  No SCADA protocols detected on this device
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="scada" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>SCADA Data</CardTitle>
              <CardDescription>Additional industrial control data</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(combinedAsset.scada_data).length > 0 ? (
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {JSON.stringify(combinedAsset.scada_data, null, 2)}
                </pre>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" />
                  No SCADA data available for this device
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="banners" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Banner Records</CardTitle>
              <CardDescription>Network services and banners detected for this device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasBannerData ? (
                <div className="space-y-6">
                  {Object.entries(bannerRecords).map(([port, record]: [string, any]) => (
                    <div key={port} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-medium">
                            Port {port} 
                            <Badge className="ml-2" variant="outline">{record.protocol}</Badge>
                          </h3>
                          <p className="text-sm text-muted-foreground">{record.service}</p>
                        </div>
                        <Badge variant={record.banner ? "default" : "outline"}>
                          {record.banner ? "Banner Captured" : "No Banner"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Source</p>
                          <p>{record.src_ip}:{record.sport}</p>
                          <p className="text-sm text-muted-foreground">{record.src_mac}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Destination</p>
                          <p>{record.dst_ip}:{record.dport}</p>
                          <p className="text-sm text-muted-foreground">{record.dst_mac}</p>
                        </div>
                      </div>
                      
                      {record.banner && (
                        <>
                          <h4 className="text-sm font-medium flex items-center mb-2">
                            <Activity className="h-4 w-4 mr-1" />
                            Banner Content
                            {record.entropy !== undefined && record.entropy > 0 && (
                              <Badge variant="outline" className="ml-2">
                                Entropy: {record.entropy.toFixed(2)}
                              </Badge>
                            )}
                          </h4>
                          <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-36">
                            {record.banner}
                          </pre>
                        </>
                      )}
                      
                      {record.matches && Object.values(record.matches).flat().length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">
                            <Info className="inline h-4 w-4 mr-1" />
                            Data Matches
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(record.matches).map(([key, values]: [string, any]) => 
                              values.length > 0 && (
                                <div key={key} className="text-sm">
                                  <span className="font-medium">{key}:</span> {values.join(", ")}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No banner data available for this device</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetail;
