
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AssetDetailHeader } from "@/components/asset-detail/AssetDetailHeader";
import { AssetOverviewCards } from "@/components/asset-detail/AssetOverviewCards";
import { OverviewTabContent } from "@/components/asset-detail/OverviewTabContent";
import { PortsTabContent } from "@/components/asset-detail/PortsTabContent";
import { ProtocolsTabContent } from "@/components/asset-detail/ProtocolsTabContent";
import { SCADADataTabContent } from "@/components/asset-detail/SCADADataTabContent";
import { BannersTabContent } from "@/components/asset-detail/BannersTabContent";
import { useAssetDetailData } from "@/components/asset-detail/useAssetDetailData";

const AssetDetail = () => {
  const {
    isLoading,
    hasAssetData,
    combinedAsset,
    bannerRecords,
    hasBannerData,
    formatDate,
    macAddress
  } = useAssetDetailData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading asset details...</p>
      </div>
    );
  }

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

  return (
    <div className="space-y-6">
      <AssetDetailHeader 
        macAddress={macAddress || ""}
        hasBannerData={hasBannerData}
      />

      <AssetOverviewCards
        macAddress={combinedAsset?.mac_address || ""}
        srcIp={combinedAsset?.src_ip || "—"}
        hostname={combinedAsset?.hostname || "—"}
        lastSeen={combinedAsset?.last_seen || ""}
        formatDate={formatDate}
      />

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
          <OverviewTabContent
            ethProto={combinedAsset?.eth_proto || "—"}
            icmp={combinedAsset?.icmp || false}
            ipProtocols={combinedAsset?.ip_protocols || []}
          />
        </TabsContent>
        
        <TabsContent value="ports" className="mt-4 space-y-4">
          <PortsTabContent
            tcpPorts={combinedAsset?.tcp_ports || []}
            udpPorts={combinedAsset?.udp_ports || []}
          />
        </TabsContent>
        
        <TabsContent value="protocols" className="mt-4">
          <ProtocolsTabContent
            scadaProtocols={combinedAsset?.scada_protocols || []}
          />
        </TabsContent>
        
        <TabsContent value="scada" className="mt-4">
          <SCADADataTabContent
            scadaData={combinedAsset?.scada_data || {}}
          />
        </TabsContent>
        
        <TabsContent value="banners" className="mt-4 space-y-4">
          <BannersTabContent
            bannerRecords={bannerRecords}
            hasBannerData={hasBannerData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetail;
