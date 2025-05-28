
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Edit } from "lucide-react";
import { bytesToSize } from "@/lib/utils";
import { EnhancedPcapFile } from '@/lib/types';

interface FileDetailsTabProps {
  pcapFiles: EnhancedPcapFile[];
  onDownload: (file: EnhancedPcapFile) => void;
}

export function FileDetailsTab({ pcapFiles, onDownload }: FileDetailsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>File Details & Storage Information</CardTitle>
        <CardDescription>
          Detailed information about capture files including server location, size, and detected protocols
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Server Location</TableHead>
                <TableHead>Storage Path</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Protocols Detected</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pcapFiles.map(file => (
                <TableRow key={file.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <div>
                        <div>{file.file_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {file.device?.name} ({file.device?.vendor})
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{file.server_location}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {file.storage_path}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{bytesToSize(file.file_size_bytes)}</div>
                      <div className="text-xs text-muted-foreground">
                        {file.packet_count?.toLocaleString()} packets
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {file.protocols_detected.map((protocol: string) => (
                        <Badge key={protocol} variant="secondary" className="text-xs">
                          {protocol}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onDownload(file)}
                        disabled={file.status === 'capturing' || file.status === 'processing'}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
