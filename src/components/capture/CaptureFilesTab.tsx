
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trash2, Loader2 } from "lucide-react";
import { bytesToSize } from "@/lib/utils";
import { EnhancedPcapFile } from '@/lib/types';

interface CaptureFilesTabProps {
  pcapFiles: EnhancedPcapFile[];
  isLoading: boolean;
  error: any;
  onFileSelect: (file: EnhancedPcapFile) => void;
  onDownload: (file: EnhancedPcapFile) => void;
  onDeleteClick: (file: EnhancedPcapFile) => void;
}

export function CaptureFilesTab({ 
  pcapFiles, 
  isLoading, 
  error, 
  onFileSelect, 
  onDownload, 
  onDeleteClick 
}: CaptureFilesTabProps) {
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
            No capture files found. Upload a PCAP file or start a new capture.
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
                  <TableRow key={file.id} onClick={() => onFileSelect(file)} className="cursor-pointer">
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
                    <TableCell>{file.packet_count?.toLocaleString() || 'N/A'}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(file);
                        }}
                        disabled={file.status === 'capturing' || file.status === 'processing'}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteClick(file);
                        }}
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
  );
}
