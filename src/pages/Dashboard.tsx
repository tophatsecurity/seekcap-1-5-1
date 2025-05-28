
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { ChartsSection } from "@/components/dashboard/ChartsSection";
import { ProtocolsSection } from "@/components/dashboard/ProtocolsSection";
import { SystemInfo } from "@/components/dashboard/SystemInfo";

const Dashboard = () => {
  const { assets, networkDevices, isLoading, error } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error loading dashboard data: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHeader />
      <MetricsCards assets={assets} networkDevices={networkDevices} />
      <ChartsSection assets={assets} />
      <ProtocolsSection assets={assets} />
      <SystemInfo />
    </div>
  );
};

export default Dashboard;
