
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { CaptureAssignment } from '@/lib/types';

interface AssignmentsTabProps {
  assignments: CaptureAssignment[];
  onEditAssignment: (assignment: CaptureAssignment) => void;
}

export function AssignmentsTab({ assignments, onEditAssignment }: AssignmentsTabProps) {
  const getAssignmentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'standby': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
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
                    {assignment.rotationInterval && `${assignment.rotationInterval}`}
                    {assignment.threshold && `Threshold: ${assignment.threshold}`}
                    {assignment.protocols && `Protocols: ${assignment.protocols.join(', ')}`}
                    {assignment.alertOnNew && 'Alert on new devices'}
                    {assignment.minThreshold && `Min: ${assignment.minThreshold}`}
                    {assignment.manualControl && 'Manual control'}
                  </TableCell>
                  <TableCell>
                    <Badge className={getAssignmentStatusColor(assignment.status)}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditAssignment(assignment)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
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
