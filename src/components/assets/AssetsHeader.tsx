
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AssetsHeaderProps {
  totalAssets: number;
  rockwellCount: number;
  modbusCount: number;
}

export const AssetsHeader = ({ totalAssets, rockwellCount, modbusCount }: AssetsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Network Assets</h1>
        <p className="text-muted-foreground mt-1">
          {totalAssets} total assets • {rockwellCount} Rockwell/Allen-Bradley • {modbusCount} Modbus devices
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};
