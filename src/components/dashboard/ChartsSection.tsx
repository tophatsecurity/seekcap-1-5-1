
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { OuiInfo, Subnet } from "@/lib/types";

interface ChartsSectionProps {
  ouiInfo: OuiInfo[];
  subnets: Subnet[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const ChartsSection = ({ ouiInfo, subnets }: ChartsSectionProps) => {
  // Transform subnet data for the bar chart
  const subnetChartData = subnets.slice(0, 10).map(subnet => ({
    network: subnet.subnet,
    count: subnet.count,
    shortName: subnet.subnet.split('/')[0] // Show just the network part for better display
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Vendors</CardTitle>
          <CardDescription>Hardware manufacturer distribution</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={ouiInfo.slice(0, 6)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="vendor"
                label={({ vendor, percent }) => `${vendor}: ${(percent * 100).toFixed(0)}%`}
              >
                {ouiInfo.slice(0, 6).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`${value} devices`, props.payload.vendor]} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Network Subnets</CardTitle>
          <CardDescription>Top 10 subnets by host count (Format: network/CIDR)</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          {subnets.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subnetChartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 80,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="network" 
                  angle={-45} 
                  textAnchor="end"
                  height={80}
                  interval={0}
                  fontSize={11}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} hosts`, 'Host Count']}
                  labelFormatter={(label) => `Network: ${label}`}
                />
                <Bar dataKey="count" name="Hosts" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex justify-center items-center h-full">
              No subnet data available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
