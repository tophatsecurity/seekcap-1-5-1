
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Database } from 'lucide-react';
import { Asset } from '@/lib/db/types';
import { BasicInfoSection } from './asset-detail/BasicInfoSection';
import { NetworkInfoSection } from './asset-detail/NetworkInfoSection';
import { ProtocolInfoSection } from './asset-detail/ProtocolInfoSection';
import { PerformanceSection } from './asset-detail/PerformanceSection';
import { WirelessInfoSection } from './asset-detail/WirelessInfoSection';
import { TimingInfoSection } from './asset-detail/TimingInfoSection';
import { SCADAProtocolSection } from './asset-detail/SCADAProtocolSection';
import { PortInfoSection } from './asset-detail/PortInfoSection';
import { AdditionalSCADADataSection } from './asset-detail/AdditionalSCADADataSection';

interface AssetDetailModalProps {
  asset: Asset;
  open: boolean;
  onClose: () => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  open,
  onClose,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Asset Details: {asset.name || 'Unknown Device'}
          </DialogTitle>
          <DialogDescription>
            Detailed information for {asset.mac_address}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoSection asset={asset} />
          <NetworkInfoSection asset={asset} />
          <ProtocolInfoSection asset={asset} />
          <PerformanceSection asset={asset} />
          <WirelessInfoSection asset={asset} />
          <TimingInfoSection asset={asset} />
        </div>

        <SCADAProtocolSection asset={asset} />
        <PortInfoSection asset={asset} />
        <AdditionalSCADADataSection asset={asset} />
      </DialogContent>
    </Dialog>
  );
};
