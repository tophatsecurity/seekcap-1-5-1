
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  useSampleData: boolean;
  setUseSampleData: (value: boolean) => void;
}

export const DashboardHeader = ({
  useSampleData,
  setUseSampleData
}: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-3">
        <Button
          variant={useSampleData ? "default" : "outline"}
          size="sm"
          onClick={() => setUseSampleData(!useSampleData)}
        >
          {useSampleData ? "Using Sample Data" : "Use Sample Data"}
        </Button>
      </div>
    </div>
  );
};
