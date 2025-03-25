
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AssetDataLoader from '@/components/AssetDataLoader';
import AssetDataViewer from '@/components/AssetDataViewer';
import AssetFileImporter from '@/components/AssetFileImporter';
import { useJsonData } from '@/context/JsonDataContext';
import DownloadApp from '@/components/DownloadApp';

const Data = () => {
  const { jsonData } = useJsonData();
  
  return (
    <div className="container py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Data Management</h1>
          <p className="text-muted-foreground">Import, view, and manage asset data</p>
        </div>
        <div>
          <DownloadApp />
        </div>
      </div>
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Import Data</CardTitle>
            <CardDescription>
              Import data from JSON files or paste JSON directly
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssetFileImporter />
            <div className="mt-4">
              <AssetDataLoader />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Data Viewer</CardTitle>
            <CardDescription>
              View and explore imported data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jsonData ? (
              <AssetDataViewer data={jsonData} />
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                <p>No data loaded. Import data to view it here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Data;
