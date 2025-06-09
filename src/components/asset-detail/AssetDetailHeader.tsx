
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';

interface AssetDetailHeaderProps {
  macAddress: string;
  hasBannerData: boolean;
}

export const AssetDetailHeader: React.FC<AssetDetailHeaderProps> = ({ 
  macAddress, 
  hasBannerData 
}) => (
  <div className="flex items-center gap-4">
    <Button variant="outline" size="icon" asChild>
      <Link to="/assets">
        <ArrowLeft className="h-4 w-4" />
      </Link>
    </Button>
    <h1 className="text-3xl font-bold">Asset Details</h1>
    
    {hasBannerData && (
      <Badge variant="outline" className="ml-2">Banner Data Available</Badge>
    )}
  </div>
);
