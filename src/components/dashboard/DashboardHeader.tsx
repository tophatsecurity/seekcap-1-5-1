
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DashboardHeaderProps {
  useSampleData: boolean;
  setUseSampleData: (value: boolean) => void;
  selectedFile: File | null;
  importing: boolean;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleImport: () => void;
}

export const DashboardHeader = ({
  useSampleData,
  setUseSampleData,
  selectedFile,
  importing,
  handleFileChange,
  handleImport
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
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="outline" asChild>
            <span>Select File</span>
          </Button>
        </label>
        <Button 
          onClick={handleImport} 
          disabled={!selectedFile || importing}
        >
          <Upload className="mr-2 h-4 w-4" />
          {importing ? "Importing..." : "Import Data"}
        </Button>
      </div>
    </div>
  );
};
