
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

interface FilterState {
  deviceType: string;
  vendor: string;
  protocol: string;
  ipRange: string;
}

interface AssetFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  deviceTypes: string[];
  vendors: string[];
  protocols: string[];
}

export const AssetFilters = ({ 
  filters, 
  onFiltersChange, 
  deviceTypes, 
  vendors, 
  protocols 
}: AssetFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof FilterState) => {
    onFiltersChange({ ...filters, [key]: "" });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      deviceType: "",
      vendor: "",
      protocol: "",
      ipRange: "",
    });
  };

  const activeFiltersCount = Object.values(filters).filter(value => value !== "").length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border rounded-lg bg-muted/20">
          <div className="space-y-2">
            <label className="text-sm font-medium">Device Type</label>
            <div className="flex items-center gap-2">
              <Select value={filters.deviceType} onValueChange={(value) => updateFilter("deviceType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {deviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.deviceType && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearFilter("deviceType")}
                  className="h-8 w-8"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vendor</label>
            <div className="flex items-center gap-2">
              <Select value={filters.vendor} onValueChange={(value) => updateFilter("vendor", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All vendors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All vendors</SelectItem>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor} value={vendor}>
                      {vendor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.vendor && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearFilter("vendor")}
                  className="h-8 w-8"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Protocol</label>
            <div className="flex items-center gap-2">
              <Select value={filters.protocol} onValueChange={(value) => updateFilter("protocol", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All protocols" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All protocols</SelectItem>
                  {protocols.map((protocol) => (
                    <SelectItem key={protocol} value={protocol}>
                      {protocol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {filters.protocol && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearFilter("protocol")}
                  className="h-8 w-8"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">IP Range</label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="e.g., 192.168.1.0/24"
                value={filters.ipRange}
                onChange={(e) => updateFilter("ipRange", e.target.value)}
              />
              {filters.ipRange && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => clearFilter("ipRange")}
                  className="h-8 w-8"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
