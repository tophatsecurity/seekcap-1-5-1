
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AssetType } from "@/lib/types";

interface AssetFiltersProps {
  filterType: string;
  onFilterChange: (filterType: string) => void;
  assetTypes: AssetType[];
}

export const AssetFilters = ({ 
  filterType, 
  onFilterChange, 
  assetTypes 
}: AssetFiltersProps) => {
  return (
    <div className="w-full sm:w-48">
      <Select value={filterType} onValueChange={onFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {assetTypes.map((assetType) => (
            <SelectItem key={assetType.type} value={assetType.type}>
              {assetType.type} ({assetType.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
