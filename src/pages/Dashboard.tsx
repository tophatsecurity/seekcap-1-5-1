
import React, { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { ProtocolsSection } from '@/components/dashboard/ProtocolsSection';
import { SystemInfo } from '@/components/dashboard/SystemInfo';

export default function Dashboard() {
  const [useSampleData, setUseSampleData] = useState(false);
  const dashboardData = useDashboardData(useSampleData);

  return (
    <div className="space-y-6">
      <DashboardHeader 
        useSampleData={useSampleData}
        setUseSampleData={setUseSampleData}
      />
      <MetricsCards 
        assetTypes={dashboardData.assetTypes}
        protocols={dashboardData.protocols}
        subnets={dashboardData.subnets}
      />
      <ChartsSection 
        assetTypes={dashboardData.assetTypes}
        subnets={dashboardData.subnets}
      />
      <ProtocolsSection 
        protocols={dashboardData.protocols}
        scadaInfo={dashboardData.scadaInfo}
        ouiInfo={dashboardData.ouiInfo}
      />
      <SystemInfo />
    </div>
  );
}
