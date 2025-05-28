import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchPcapFiles, PcapFile, deletePcapFile } from "@/lib/db/captures";
import { bytesToSize } from "@/lib/utils";
import { FileText, Download, Trash2, RefreshCw, Loader2, Plus, Upload, Activity, Settings, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UploadPcapModal } from '@/components/capture/UploadPcapModal';
import { StartCaptureModal } from '@/components/capture/StartCaptureModal';
import { downloadPcapFile } from '@/lib/utils/pcapFileUtils';

// Sample data for active captures
const activeCaptures = [
  {
    id: 1,
    switch: "SW-Core-01",
    port: "GigE0/1",
    packetCount: 15420,
    duration: "00:23:15",
    status: "capturing",
    assignmentType: "Most Active"
  },
  {
    id: 2,
    switch: "SW-Access-02",
    port: "Fa0/12",
    packetCount: 8932,
    duration: "00:18:42",
    status: "capturing",
    assignmentType: "Protocol Hover"
  },
  {
    id: 3,
    switch: "SW-Core-01",
    port: "GigE0/24",
    packetCount: 45231,
    duration: "01:12:08",
    status: "processing",
    assignmentType: "Rotate"
  }
];

// Sample data for limits
const systemLimits = [
  {
    id: 1,
    parameter: "CPU Usage",
    currentValue: "65%",
    warningThreshold: "80%",
    criticalThreshold: "95%",
    status: "normal"
  },
  {
    id: 2,
    parameter: "Memory Usage",
    currentValue: "72%",
    warningThreshold: "85%",
    criticalThreshold: "95%",
    status: "normal"
  },
  {
    id: 3,
    parameter: "Bandwidth Utilization",
    currentValue: "1.2 Gbps",
    warningThreshold: "8 Gbps",
    criticalThreshold: "9.5 Gbps",
    status: "normal"
  },
  {
    id: 4,
    parameter: "Storage Space",
    currentValue: "450 GB",
    warningThreshold: "800 GB",
    criticalThreshold: "900 GB",
    status: "normal"
  },
  {
    id: 5,
    parameter: "Fulfillment Time",
    currentValue: "2.3 sec",
    warningThreshold: "30 sec",
    criticalThreshold: "60 sec",
    status: "normal"
  }
];

// Sample data for assignments
const assignments = [
  {
    id: 1,
    name: "Core Network Monitoring",
    switches: ["SW-Core-01", "SW-Core-02"],
    ports: ["GigE0/1-24"],
    type: "Rotate",
    rotationInterval: "15 min",
    status: "active"
  },
  {
    id: 2,
    name: "High Traffic Analysis",
    switches: ["SW-Access-01", "SW-Access-02", "SW-Access-03"],
    ports: ["All Active"],
    type: "Most Active",
    threshold: "100 Mbps",
    status: "active"
  },
  {
    id: 3,
    name: "Protocol Inspection",
    switches: ["SW-DMZ-01"],
    ports: ["Fa0/1-12"],
    type: "Protocol Hover",
    protocols: ["HTTP", "HTTPS", "SSH"],
    status: "paused"
  },
  {
    id: 4,
    name: "New Device Detection",
    switches: ["SW-Access-*"],
    ports: ["All"],
    type: "New Ports",
    alertOnNew: true,
    status: "active"
  },
  {
    id: 5,
    name: "Baseline Monitoring",
    switches: ["SW-Edge-01"],
    ports: ["Fa0/20-24"],
    type: "Least Active",
    minThreshold: "1 Mbps",
    status: "active"
  },
  {
    id: 6,
    name: "Manual Override",
    switches: ["SW-Lab-01"],
    ports: ["GigE0/1"],
    type: "Hover",
    manualControl: true,
    status: "standby"
  }
];

export default function Capture() {
  const [selectedFile, setSelectedFile] = useState<PcapFile | null>(null);
  const [fileToDelete, setFileToDelete] = useState<PcapFile | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [startCaptureModalOpen, setStartCaptureModalOpen] = useState(false);
  
  const { data: pcapFiles = [], isLoading, error, refetch } = useQuery({
    queryKey: ['pcapFiles'],
    queryFn: fetchPcapFiles
  });

  const handleDownload = (file: PcapFile) => {
    downloadPcapFile(file);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'standby': return 'bg-gray-500';
      default: return 'bg-blue-500';
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="files">
            <FileText className="mr-2 h-4 w-4" />
            Capture Files
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
                        <TableRow key={file.id} onClick={() => setSelectedFile(file)} className="cursor-pointer">
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(file);
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
                                handleDeleteClick(file);
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
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Captures</CardTitle>
              <CardDescription>
                Currently running packet captures across network devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Switch</TableHead>
                      <TableHead>Port</TableHead>
                      <TableHead>Packet Count</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Assignment Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCaptures.map(capture => (
                      <TableRow key={capture.id}>
                        <TableCell className="font-medium">{capture.switch}</TableCell>
                        <TableCell>{capture.port}</TableCell>
                        <TableCell>{capture.packetCount.toLocaleString()}</TableCell>
                        <TableCell>{capture.duration}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{capture.assignmentType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColor(capture.status)}>
                            {capture.status.charAt(0).toUpperCase() + capture.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Stop
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="limits">
          <Card>
            <CardHeader>
              <CardTitle>System Limits & Alerts</CardTitle>
              <CardDescription>
                Monitor system resources and performance thresholds
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parameter</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Warning Threshold</TableHead>
                      <TableHead>Critical Threshold</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systemLimits.map(limit => (
                      <TableRow key={limit.id}>
                        <TableCell className="font-medium">{limit.parameter}</TableCell>
                        <TableCell>{limit.currentValue}</TableCell>
                        <TableCell>{limit.warningThreshold}</TableCell>
                        <TableCell>{limit.criticalThreshold}</TableCell>
                        <TableCell>
                          <span className={getStatusColor(limit.status)}>
                            {limit.status.charAt(0).toUpperCase() + limit.status.slice(1)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card>
            <CardHeader>
              <CardTitle>Capture Assignments</CardTitle>
              <CardDescription>
                Configure automatic capture assignments for switches and ports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment Name</TableHead>
                      <TableHead>Switches</TableHead>
                      <TableHead>Ports</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Configuration</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assignments.map(assignment => (
                      <TableRow key={assignment.id}>
                        <TableCell className="font-medium">{assignment.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {assignment.switches.map(sw => (
                              <Badge key={sw} variant="secondary" className="text-xs">
                                {sw}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {assignment.ports.map(port => (
                              <Badge key={port} variant="outline" className="text-xs">
                                {port}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{assignment.type}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {'rotationInterval' in assignment && `${assignment.rotationInterval}`}
                          {'threshold' in assignment && `Threshold: ${assignment.threshold}`}
                          {'protocols' in assignment && `Protocols: ${assignment.protocols?.join(', ')}`}
                          {'alertOnNew' in assignment && assignment.alertOnNew && 'Alert on new devices'}
                          {'minThreshold' in assignment && `Min: ${assignment.minThreshold}`}
                          {'manualControl' in assignment && assignment.manualControl && 'Manual control'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getAssignmentStatusColor(assignment.status)}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
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
                {selectedFile.device && (
                  <div className="col-span-2">
                    <p className="text-sm font-medium">Device</p>
                    <p>{selectedFile.device.name} ({selectedFile.device.vendor})</p>
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
