
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchAssetDetails } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Server, Wifi, Clock, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AssetDetail = () => {
  const { macAddress } = useParams<{ macAddress: string }>();
  
  const { data: asset, isLoading } = useQuery({
    queryKey: ["asset", macAddress],
    queryFn: () => fetchAssetDetails(macAddress as string),
    enabled: !!macAddress,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading asset details...</p>
      </div>
    );
  }

  if (!asset) {
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

  // Format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/assets">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Asset Details</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MAC Address</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold break-all">{asset.mac_address}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">IP Address</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">{asset.src_ip || "—"}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">First Seen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg">{formatDate(asset.first_seen)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Last Seen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg">{formatDate(asset.last_seen)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ports">Ports</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="scada">SCADA Data</TabsTrigger>
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
                  <p className="text-md">{asset.eth_proto || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">ICMP Status</h3>
                  <p className="text-md">{asset.icmp ? "Responding" : "Not responding"}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">IP Protocols</h3>
                {asset.ip_protocols && asset.ip_protocols.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {asset.ip_protocols.map((protocol) => (
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
              {asset.tcp_ports && asset.tcp_ports.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {asset.tcp_ports.map((port) => (
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
              {asset.udp_ports && asset.udp_ports.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {asset.udp_ports.map((port) => (
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
              {asset.scada_protocols && asset.scada_protocols.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {asset.scada_protocols.map((protocol) => (
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
              {asset.scada_data && Object.keys(asset.scada_data).length > 0 ? (
                <pre className="bg-muted p-4 rounded-md overflow-auto">
                  {JSON.stringify(asset.scada_data, null, 2)}
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
      </Tabs>
    </div>
  );
};

export default AssetDetail;
