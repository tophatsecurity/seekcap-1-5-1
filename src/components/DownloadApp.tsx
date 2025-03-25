
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useJsonData } from '@/context/JsonDataContext';

export const DownloadApp = () => {
  const { toast } = useToast();
  const { jsonData } = useJsonData();

  const handleDownload = () => {
    try {
      // Create a data object that contains app configuration and data
      const appData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        config: {
          appName: 'SEEKCAP Explorer',
          description: 'Network asset discovery and monitoring tool'
        },
        data: jsonData
      };

      // Convert to JSON string
      const dataStr = JSON.stringify(appData, null, 2);
      
      // Create a blob from the data
      const blob = new Blob([dataStr], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger the download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'seekcap-explorer.json';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download complete",
        description: "Your app data has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Download failed:', error);
      toast({
        title: "Download failed",
        description: "There was a problem downloading your app data.",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={handleDownload} 
      className="flex items-center gap-2"
      variant="outline"
    >
      <Download size={16} />
      <span>Download App Data</span>
    </Button>
  );
};

export default DownloadApp;
