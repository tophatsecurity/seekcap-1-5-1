import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAssets } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, FileText, Printer } from "lucide-react";
import { JsonDataViewer } from "@/components/JsonDataViewer";
import { useJsonData } from "@/context/JsonDataContext";

const Reports = () => {
  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: fetchAssets,
  });

  const [reportType, setReportType] = useState("protocols");

  const { jsonData } = useJsonData();

  const protocolData = Array.from(
    assets.reduce((map, asset) => {
      if (asset.eth_proto) {
        map.set(asset.eth_proto, (map.get(asset.eth_proto) || 0) + 1);
      }
      return map;
    }, new Map())
  ).map(([name, value]) => ({ name, value }));

  const icmpData = [
    { name: "ICMP Enabled", value: assets.filter(a => a.icmp).length },
    { name: "ICMP Disabled", value: assets.filter(a => !a.icmp).length }
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const activityData = last7Days.map(day => {
    const count = assets.filter(asset => {
      const lastSeen = new Date(asset.last_seen).toISOString().split('T')[0];
      return lastSeen === day;
    }).length;
    
    return {
      date: new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      count
    };
  });

  const exportCSV = () => {
    let csvContent = "";
    
    let headers = ["MAC Address", "IP Address", "Ethernet Protocol", "ICMP", "First Seen", "Last Seen"];
    csvContent += headers.join(",") + "\n";
    
    assets.forEach(asset => {
      const row = [
        asset.mac_address,
        asset.src_ip || "",
        asset.eth_proto || "",
        asset.icmp ? "Yes" : "No",
        asset.first_seen || "",
        asset.last_seen || ""
      ];
      csvContent += row.join(",") + "\n";
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "scada-assets-report.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  const getReportData = () => {
    switch (reportType) {
      case "protocols":
        return protocolData;
      case "icmp":
        return icmpData;
      case "activity":
        return activityData;
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" onClick={printReport}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Asset Analysis Reports</CardTitle>
          <CardDescription>Generate and view various reports about discovered assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="w-full md:w-64">
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protocols">Ethernet Protocols</SelectItem>
                  <SelectItem value="icmp">ICMP Status</SelectItem>
                  <SelectItem value="activity">7-Day Activity</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span>Total Assets: {assets.length}</span>
            </div>
          </div>

          <div className="h-80 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              {reportType === "activity" ? (
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name="Active Assets" fill="#8884d8" />
                </BarChart>
              ) : (
                <BarChart data={getReportData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Count" fill="#82ca9d" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Report Summary</CardTitle>
          <CardDescription>Key findings from the analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Network Overview</h3>
            <p>Total assets discovered: {assets.length}</p>
            <p>Assets with ICMP enabled: {assets.filter(a => a.icmp).length}</p>
            <p>Unique Ethernet protocols: {new Set(assets.map(a => a.eth_proto).filter(Boolean)).size}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium">Activity Summary</h3>
            <p>
              Active in the last 24 hours: {
                assets.filter(a => new Date(a.last_seen) > new Date(Date.now() - 86400000)).length
              }
            </p>
            <p>
              Active in the last 7 days: {
                assets.filter(a => new Date(a.last_seen) > new Date(Date.now() - 7 * 86400000)).length
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {jsonData && (
        <JsonDataViewer title="Imported JSON Analysis" />
      )}
    </div>
  );
};

export default Reports;
