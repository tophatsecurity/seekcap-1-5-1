
import { useJsonData } from "@/context/JsonDataContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileJson } from "lucide-react";

export const JsonDataViewer = ({ title = "Imported JSON Data" }: { title?: string }) => {
  const { jsonData } = useJsonData();

  if (!jsonData || Object.keys(jsonData).length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-6">
          <FileJson className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-center text-muted-foreground">
            No JSON data available. Import data from the Data page.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Data imported from JSON file</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md overflow-auto max-h-[400px]">
          <pre className="text-sm">{JSON.stringify(jsonData, null, 2)}</pre>
        </div>
      </CardContent>
    </Card>
  );
};
