
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { SystemLimit } from '@/lib/types';

interface SystemLimitsTabProps {
  systemLimits: SystemLimit[];
  onEditLimit: (limit: SystemLimit) => void;
}

export function SystemLimitsTab({ systemLimits, onEditLimit }: SystemLimitsTabProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
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
                <TableHead className="text-right">Actions</TableHead>
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
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onEditLimit(limit)}
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
