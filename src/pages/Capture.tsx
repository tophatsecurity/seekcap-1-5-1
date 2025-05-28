
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, Plus, Upload, Activity, Settings, Target, FileText, FolderOpen, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { UploadPcapModal } from '@/components/capture/UploadPcapModal';
import { StartCaptureModal } from '@/components/capture/StartCaptureModal';
import { CaptureFilesTab } from '@/components/capture/CaptureFilesTab';
import { FileDetailsTab } from '@/components/capture/FileDetailsTab';
import { ActiveCapturesTab } from '@/components/capture/ActiveCapturesTab';
import { SystemLimitsTab } from '@/components/capture/SystemLimitsTab';
import { AssignmentsTab } from '@/components/capture/AssignmentsTab';
import { downloadPcapFile } from '@/lib/utils/pcapFileUtils';
import { deletePcapFile } from "@/lib/db/captures";
import { bytesToSize } from "@/lib/utils";
import { EnhancedPcapFile } from '@/lib/types';
import { 
  generateSamplePcapFiles, 
  generateActiveCaptures, 
  generateSystemLimits, 
  generateCaptureAssignments 
} from '@/utils/captureDataGenerator';

export default function Capture() {
  const [selectedFile, setSelectedFile] = useState<EnhancedPcapFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<EnhancedPcapFile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [startCaptureModalOpen, setStartCaptureModalOpen] = useState(false);
  
  // Use sample data for demonstration
  const pcapFiles = generateSamplePcapFiles();
  const activeCaptures = generateActiveCaptures();
  const systemLimits = generateSystemLimits();
  const assignments = generateCaptureAssignments();
  const isLoading = false;
  const error = null;
  
  const refetch = () => {
    toast({
      title: "Data refreshed",
      description: "Capture data has been updated",
    });
  };

  const handleDownload = (file: EnhancedPcapFile) => {
    downloadPcapFile(file as any);
  };

  const handleDeleteClick = (file: EnhancedPcapFile) => {
    setFileToDelete(file);
  };

  const confirmDelete = async () => {
    if (!fileToDelete) return;
    
    const success = await deletePcapFile(fileToDelete.id);
    if (success) {
      refetch();
    }
    setFileToDelete(null);
  };

  const handleEditCapture = (capture: any) => {
    toast({
      title: "Edit Capture",
      description: `Editing capture on ${capture.switch}:${capture.port}`,
    });
  };

  const handleEditLimit = (limit: any) => {
    toast({
      title: "Edit System Limit",
      description: `Editing ${limit.parameter} thresholds`,
    });
  };

  const handleEditAssignment = (assignment: any) => {
    toast({
      title: "Edit Assignment",
      description: `Editing assignment: ${assignment.name}`,
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'capturing': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'processing': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Packet Captures</h1>
          <p className="text-muted-foreground">View and manage packet capture files and monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setUploadModalOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload PCAP
          </Button>
          <Button onClick={() => setStartCaptureModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Start Capture
          </Button>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="files">
            <FileText className="mr-2 h-4 w-4" />
            Capture Files
          </TabsTrigger>
          <TabsTrigger value="details">
            <FolderOpen className="mr-2 h-4 w-4" />
            File Details
          </TabsTrigger>
          <TabsTrigger value="active">
            <Activity className="mr-2 h-4 w-4" />
            Active Captures
          </TabsTrigger>
          <TabsTrigger value="limits">
            <Settings className="mr-2 h-4 w-4" />
            System Limits
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <Target className="mr-2 h-4 w-4" />
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="files">
          <CaptureFilesTab
            pcapFiles={pcapFiles}
            isLoading={isLoading}
            error={error}
            onFileSelect={setSelectedFile}
            onDownload={handleDownload}
            onDeleteClick={handleDeleteClick}
          />
        </TabsContent>

        <TabsContent value="details">
          <FileDetailsTab
            pcapFiles={pcapFiles}
            onDownload={handleDownload}
          />
        </TabsContent>

        <TabsContent value="active">
          <ActiveCapturesTab
            activeCaptures={activeCaptures}
            onEditCapture={handleEditCapture}
          />
        </TabsContent>

        <TabsContent value="limits">
          <SystemLimitsTab
            systemLimits={systemLimits}
            onEditLimit={handleEditLimit}
          />
        </TabsContent>

        <TabsContent value="assignments">
          <AssignmentsTab
            assignments={assignments}
            onEditAssignment={handleEditAssignment}
          />
        </TabsContent>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!fileToDelete} onOpenChange={(open) => !open && setFileToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the capture file "{fileToDelete?.file_name}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* File Details Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={(open) => !open && setSelectedFile(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Capture File Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected capture file.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">File Name</p>
                  <p>{selectedFile.file_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Size</p>
                  <p>{bytesToSize(selectedFile.file_size_bytes)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge className={statusColor(selectedFile.status)}>
                    {selectedFile.status.charAt(0).toUpperCase() + selectedFile.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Packet Count</p>
                  <p>{selectedFile.packet_count?.toLocaleString() || 'N/A'}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Storage Path</p>
                  <p className="font-mono text-xs bg-muted p-2 rounded">{selectedFile.storage_path}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium">Capture Period</p>
                  <p>
                    {new Date(selectedFile.capture_start).toLocaleString()}
                    {selectedFile.capture_end && ` to ${new Date(selectedFile.capture_end).toLocaleString()}`}
                  </p>
                </div>
                {selectedFile.device && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Device</p>
                    <p>{selectedFile.device.name} ({selectedFile.device.vendor})</p>
                  </div>
                )}
                {selectedFile.protocols_detected && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Protocols Detected</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedFile.protocols_detected.map((protocol: string) => (
                        <Badge key={protocol} variant="secondary" className="text-xs">
                          {protocol}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => selectedFile && handleDownload(selectedFile)}
              disabled={selectedFile?.status === 'capturing' || selectedFile?.status === 'processing'}
            >
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Upload PCAP Modal */}
      <UploadPcapModal 
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onSuccess={() => refetch()}
      />
      
      {/* Start Capture Modal */}
      <StartCaptureModal
        open={startCaptureModalOpen}
        onOpenChange={setStartCaptureModalOpen}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
