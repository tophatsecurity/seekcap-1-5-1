
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { AssetFilters } from "@/components/AssetFilters";
import { AssetType } from "@/lib/types";

interface AssetsSearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (value: string) => void;
  assetTypes: AssetType[];
}

export const AssetsSearchAndFilter = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  assetTypes
}: AssetsSearchAndFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Label htmlFor="search">Search Assets</Label>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name, IP, MAC, or vendor..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      
      <AssetFilters
        filterType={filterType}
        onFilterChange={onFilterChange}
        assetTypes={assetTypes}
      />
    </div>
  );
};
