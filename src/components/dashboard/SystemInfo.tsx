
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export const SystemInfo = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>System Information</CardTitle>
        <Info className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Software Version</div>
            <div className="text-sm text-muted-foreground">THS|SEEKCAP v1.0.0</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Last Updated</div>
            <div className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Database Status</div>
            <div className="text-sm text-green-500">Connected</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
