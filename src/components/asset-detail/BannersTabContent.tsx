
import React from 'react';
import { Activity, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BannersTabContentProps {
  bannerRecords: Record<string, any>;
  hasBannerData: boolean;
}

export const BannersTabContent: React.FC<BannersTabContentProps> = ({
  bannerRecords,
  hasBannerData
}) => (
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
);
