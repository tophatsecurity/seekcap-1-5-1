
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { ActiveCapture } from '@/lib/types';

interface ActiveCapturesTabProps {
  activeCaptures: ActiveCapture[];
  onEditCapture: (capture: ActiveCapture) => void;
}

export function ActiveCapturesTab({ activeCaptures, onEditCapture }: ActiveCapturesTabProps) {
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
                    <div className="flex gap-1 justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onEditCapture(capture)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        Stop
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
