
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchPcapFiles, PcapFile, deletePcapFile } from "@/lib/db/captures";
import { bytesToSize } from "@/lib/utils";
import { FileText, Download, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function Capture() {
  const [selectedFile, setSelectedFile] = useState<PcapFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<PcapFile | null>(null);
  
  const { data: pcapFiles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pcapFiles'],
    queryFn: fetchPcapFiles
  });

  const handleDownload = (file: PcapFile) => {
    // This would typically connect to a real download API
    toast({
      title: "Download started",
      description: `Downloading ${file.file_name}...`,
    });
    
    // Mock a download completion after 2 seconds
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${file.file_name} has been downloaded.`,
      });
    }, 2000);
  };

  const handleDeleteClick = (file: PcapFile) => {
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
          <p className="text-muted-foreground">View and manage packet capture files</p>
        </div>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Capture Files</CardTitle>
          <CardDescription>
            Network packet captures stored on the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-200">
              Error loading capture files. Please try again.
            </div>
          ) : pcapFiles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No capture files found.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File Name</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Capture Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Packet Count</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pcapFiles.map(file => (
                    <TableRow key={file.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                          {file.file_name}
                        </div>
                      </TableCell>
                      <TableCell>{bytesToSize(file.file_size_bytes)}</TableCell>
                      <TableCell>
                        {new Date(file.capture_start).toLocaleString()}
                        {file.capture_end && (
                          <>
                            <br />
                            <span className="text-xs text-muted-foreground">
                              to {new Date(file.capture_end).toLocaleString()}
                            </span>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColor(file.status)}>
                          {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{file.packet_count || 'N/A'}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDownload(file)}
                          disabled={file.status === 'capturing'}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteClick(file)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
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
                  <p>{selectedFile.packet_count || 'N/A'}</p>
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
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => selectedFile && handleDownload(selectedFile)}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
