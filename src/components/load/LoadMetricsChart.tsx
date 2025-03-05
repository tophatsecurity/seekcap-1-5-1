
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeviceLoadStats } from "@/lib/db/types";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cpu, HardDrive, Server, SignalHigh } from "lucide-react";

type ChartMetric = 'load' | 'memory' | 'storage' | 'traffic';

interface LoadMetricsChartProps {
  devices: DeviceLoadStats[];
  timeRange?: '15m' | '1h' | '6h' | '24h';
}

export function LoadMetricsChart({ devices, timeRange = '1h' }: LoadMetricsChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('load');
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  
  // Generate time series data (mock data for now)
  // In a real implementation, this would come from historical data
  const generateTimeSeriesData = () => {
    // Generate timestamps for the past hour with 5-minute intervals
    const timestamps: Date[] = [];
    const now = new Date();
    
    let intervalMinutes = 5;
    let dataPoints = 12; // Default for 1h with 5-minute intervals
    
    if (timeRange === '15m') {
      intervalMinutes = 1;
      dataPoints = 15;
    } else if (timeRange === '6h') {
      intervalMinutes = 30;
      dataPoints = 12;
    } else if (timeRange === '24h') {
      intervalMinutes = 120; // 2 hours
      dataPoints = 12;
    }
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now);
      timestamp.setMinutes(now.getMinutes() - i * intervalMinutes);
      timestamps.push(timestamp);
    }
    
    // Generate data for each device
    return timestamps.map((timestamp) => {
      const dataPoint: any = {
        time: timestamp.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit'
        })
      };
      
      // Add data for each device
      devices.forEach((device) => {
        const deviceId = `device-${device.id}`;
        const baseValue = getBaseValueForDevice(device, selectedMetric);
        const randomFactor = Math.random() * 0.3 - 0.15; // +/- 15%
        
        dataPoint[deviceId] = Math.max(0, baseValue * (1 + randomFactor));
      });
      
      return dataPoint;
    });
  };
  
  const getBaseValueForDevice = (device: DeviceLoadStats, metric: ChartMetric) => {
    switch (metric) {
      case 'load':
        return device.load_avg_1m;
      case 'memory':
        return device.memory_used_percent;
      case 'storage':
        return device.storage_used_percent;
      case 'traffic':
        return (device.traffic_in_mbps + device.traffic_out_mbps) / 2;
    }
  };
  
  const getYAxisLabel = () => {
    switch (selectedMetric) {
      case 'load':
        return 'Load Average';
      case 'memory':
        return 'Memory %';
      case 'storage':
        return 'Storage %';
      case 'traffic':
        return 'Traffic (Mbps)';
    }
  };
  
  const getMetricIcon = (metric: ChartMetric) => {
    switch (metric) {
      case 'load':
        return <Server className="h-4 w-4" />;
      case 'memory':
        return <Cpu className="h-4 w-4" />;
      case 'storage':
        return <HardDrive className="h-4 w-4" />;
      case 'traffic':
        return <SignalHigh className="h-4 w-4" />;
    }
  };
  
  const toggleDeviceSelection = (deviceId: number) => {
    if (selectedDevices.includes(deviceId)) {
      setSelectedDevices(selectedDevices.filter(id => id !== deviceId));
    } else {
      setSelectedDevices([...selectedDevices, deviceId]);
    }
  };
  
  const isDeviceSelected = (deviceId: number) => {
    return selectedDevices.length === 0 || selectedDevices.includes(deviceId);
  };
  
  const chartData = generateTimeSeriesData();
  const colorPalette = [
    '#0284c7', '#0369a1', '#0e7490', '#0891b2', 
    '#2dd4bf', '#14b8a6', '#0d9488', '#059669',
    '#16a34a', '#65a30d', '#ca8a04', '#d97706',
    '#ea580c', '#dc2626', '#e11d48', '#db2777'
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <CardTitle className="flex items-center gap-2">
            {getMetricIcon(selectedMetric)}
            <span>System Metrics Over Time</span>
          </CardTitle>
          
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Select value={selectedMetric} onValueChange={(value) => setSelectedMetric(value as ChartMetric)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="load">Load Avg</SelectItem>
                <SelectItem value="memory">Memory</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="traffic">Traffic</SelectItem>
              </SelectContent>
            </Select>
            
            <Tabs defaultValue="1h" value={timeRange}>
              <TabsList className="grid grid-cols-4 w-fit">
                <TabsTrigger value="15m">15m</TabsTrigger>
                <TabsTrigger value="1h">1h</TabsTrigger>
                <TabsTrigger value="6h">6h</TabsTrigger>
                <TabsTrigger value="24h">24h</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="time" />
              <YAxis 
                label={{ 
                  value: getYAxisLabel(), 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' } 
                }} 
              />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(0, 0, 0, 0.8)", borderColor: "#374151" }}
                itemStyle={{ color: "#fff" }}
                formatter={(value: number) => [
                  selectedMetric === 'traffic' 
                    ? `${value.toFixed(2)} Mbps` 
                    : selectedMetric === 'load' 
                      ? value.toFixed(2) 
                      : `${value.toFixed(1)}%`,
                  ''
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: "10px" }}
                onClick={(entry) => {
                  const deviceId = parseInt(entry.dataKey.replace('device-', ''));
                  toggleDeviceSelection(deviceId);
                }}
              />
              {devices.map((device, index) => {
                const deviceKey = `device-${device.id}`;
                if (!isDeviceSelected(device.id)) return null;
                return (
                  <Area
                    key={deviceKey}
                    type="monotone"
                    dataKey={deviceKey}
                    name={device.device_name}
                    stroke={colorPalette[index % colorPalette.length]}
                    fill={colorPalette[index % colorPalette.length]}
                    fillOpacity={0.2}
                  />
                );
              })}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
