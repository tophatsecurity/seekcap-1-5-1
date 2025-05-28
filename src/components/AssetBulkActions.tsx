
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Tag, Shield } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AssetBulkActionsProps {
  selectedCount: number;
  onReclassify?: (newType: string) => void;
  onDelete?: () => void;
  onMarkSafe?: () => void;
  onClearSelection: () => void;
}

export const AssetBulkActions = ({
  selectedCount,
  onReclassify,
  onDelete,
  onMarkSafe,
  onClearSelection,
}: AssetBulkActionsProps) => {
  const [reclassifyType, setReclassifyType] = useState("");

  const deviceTypes = [
    "PLC",
    "HMI",
    "RTU",
    "SCADA Server",
    "Engineering Workstation",
    "Historian",
    "Safety System",
    "Network Device",
    "Unknown"
  ];

  const handleReclassify = () => {
    if (reclassifyType && onReclassify) {
      onReclassify(reclassifyType);
      setReclassifyType("");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const handleMarkSafe = () => {
    if (onMarkSafe) {
      onMarkSafe();
    }
  };

  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between p-4 bg-primary/10 border rounded-lg">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="text-sm">
          {selectedCount} asset{selectedCount !== 1 ? 's' : ''} selected
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="text-muted-foreground"
        >
          Clear selection
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        {onReclassify && (
          <div className="flex items-center gap-2">
            <Select value={reclassifyType} onValueChange={setReclassifyType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select new type..." />
              </SelectTrigger>
              <SelectContent>
                {deviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReclassify}
              disabled={!reclassifyType}
              className="gap-2"
            >
              <Tag className="h-4 w-4" />
              Reclassify
            </Button>
          </div>
        )}
        
        {onMarkSafe && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleMarkSafe}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Mark Safe
          </Button>
        )}
        
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Assets</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete {selectedCount} asset{selectedCount !== 1 ? 's' : ''}? 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};
