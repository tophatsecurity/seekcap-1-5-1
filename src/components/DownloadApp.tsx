
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileCode, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useJsonData } from '@/context/JsonDataContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const DownloadApp = () => {
  const { toast } = useToast();
  const { jsonData } = useJsonData();
  const [pythonDialogOpen, setPythonDialogOpen] = useState(false);

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

  const handleDownloadWithPythonInfo = () => {
    setPythonDialogOpen(true);
  };

  const pythonSnippet = `
# Example Python code to load the exported JSON data
import json

# Load the exported data
with open('seekcap-explorer.json', 'r') as file:
    data = json.load(file)

# Access the asset data
assets = data['data']

# Process the data as needed
for asset in assets:
    print(f"Asset: {asset.get('name', 'Unknown')} | MAC: {asset.get('mac_address', 'Unknown')}")

# You can further process this data with libraries like pandas, matplotlib, etc.
import pandas as pd

# Convert to pandas DataFrame for analysis
df = pd.DataFrame(assets)
print(df.head())
`;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Download size={16} />
            <span>Download</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Download Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDownload}>
            <Download size={16} className="mr-2" />
            Download JSON Data
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadWithPythonInfo}>
            <FileCode size={16} className="mr-2" />
            Python Integration Info
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={pythonDialogOpen} onOpenChange={setPythonDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Python Integration</DialogTitle>
            <DialogDescription>
              Use this Python code snippet to work with your downloaded data
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-muted p-4 rounded-md overflow-auto max-h-[300px]">
              <pre className="text-sm">{pythonSnippet}</pre>
            </div>
            <div className="mt-4 flex items-start">
              <AlertCircle size={16} className="mr-2 text-amber-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                After downloading the JSON data, you can use this Python code to process it. 
                The JSON export contains all your network asset data in a format compatible with Python's 
                json module, pandas, and other data analysis libraries.
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" onClick={handleDownload}>
                      <Download size={16} className="mr-2" />
                      Download JSON Data
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download data to use with Python</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button variant="outline" onClick={() => setPythonDialogOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DownloadApp;
