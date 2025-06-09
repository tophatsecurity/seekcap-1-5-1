
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Router, Network, Database, Shield } from "lucide-react";

interface QuickActionButtonsProps {
  onDeviceClick: (deviceType: string) => void;
}

const QuickActionButtons: React.FC<QuickActionButtonsProps> = ({ onDeviceClick }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={() => onDeviceClick('router')}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> 
        <Router className="h-4 w-4 text-blue-500" /> 
        Add Router
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onDeviceClick('switch')}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> 
        <Network className="h-4 w-4 text-green-500" /> 
        Add Switch
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onDeviceClick('server')}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> 
        <Database className="h-4 w-4 text-purple-500" /> 
        Add Server
      </Button>
      <Button 
        variant="outline" 
        onClick={() => onDeviceClick('security')}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" /> 
        <Shield className="h-4 w-4 text-red-500" /> 
        Add Security Device
      </Button>
    </div>
  );
};

export default QuickActionButtons;
