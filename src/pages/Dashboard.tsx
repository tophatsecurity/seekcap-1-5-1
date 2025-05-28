
import React, { useState } from 'react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { ChartsSection } from '@/components/dashboard/ChartsSection';
import { ProtocolsSection } from '@/components/dashboard/ProtocolsSection';
import { SystemInfo } from '@/components/dashboard/SystemInfo';

export default function Dashboard() {
  const [useSampleData, setUseSampleData] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const dashboardData = useDashboardData(useSampleData);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setImporting(true);
    // Import logic would go here
    setTimeout(() => {
      setImporting(false);
      setSelectedFile(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <DashboardHeader 
        useSampleData={useSampleData}
        setUseSampleData={setUseSampleData}
        selectedFile={selectedFile}
        importing={importing}
        onFileSelect={handleFileSelect}
        onImport={handleImport}
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
