
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Computer, 
  Smartphone, 
  Printer, 
  Monitor, 
  Server, 
  HardDrive, 
  Laptop, 
  Tv, 
  Thermometer, 
  Cpu, 
  Video, 
  Lock, 
  Wrench,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

function getDeviceIcon(deviceType?: string) {
  const type = deviceType?.toLowerCase() || '';
  
  if (type.includes('computer') || type.includes('pc')) {
    return <Computer className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('phone') || type.includes('smartphone') || type.includes('mobile')) {
    return <Smartphone className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('printer')) {
    return <Printer className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('server')) {
    return <Server className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('storage') || type.includes('nas')) {
    return <HardDrive className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('laptop')) {
    return <Laptop className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('tv') || type.includes('television')) {
    return <Tv className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('bacnet') || type.includes('hvac') || type.includes('thermostat')) {
    return <Thermometer className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('plc') || type.includes('cip') || type.includes('controller')) {
    return <Cpu className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('camera') || type.includes('video')) {
    return <Video className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('security') || type.includes('access')) {
    return <Lock className="h-8 w-8 text-blue-400" />;
  } else if (type.includes('modbus') || type.includes('motor') || type.includes('drive')) {
    return <Wrench className="h-8 w-8 text-blue-400" />;
  } else {
    return <Monitor className="h-8 w-8 text-blue-400" />;
  }
}

function getProtocolColor(protocol?: string) {
  if (!protocol) return 'bg-gray-500';
  
  const protocolLower = protocol.toLowerCase();
  
  if (protocolLower.includes('bacnet')) return 'bg-yellow-600 text-yellow-100';
  if (protocolLower.includes('modbus')) return 'bg-red-600 text-red-100';
  if (protocolLower.includes('cip')) return 'bg-green-600 text-green-100';
  if (protocolLower.includes('mqtt')) return 'bg-purple-600 text-purple-100';
  if (protocolLower.includes('http')) return 'bg-blue-600 text-blue-100';
  if (protocolLower.includes('snmp')) return 'bg-orange-600 text-orange-100';
  
  return 'bg-gray-600 text-gray-100';
}

const DeviceNode = ({ data }) => {
  const { device } = data;
  const navigate = useNavigate();
  const icon = getDeviceIcon(device?.device_type);
  const ipAddress = device?.ip_address || device?.src_ip || 'Unknown IP';
  const name = device?.name || 'Unknown Device';
  const vendor = device?.vendor || '';
  const protocol = device?.protocol || '';
  const channel = device?.channel;
  const usage = device?.usage_mb;
  const downloadSpeed = device?.download_bps;
  const uploadSpeed = device?.upload_bps;
  const lastSeen = device?.last_seen;
  const uptime = device?.uptime;
  const macAddress = device?.mac_address;

  const handleDeviceClick = () => {
    if (macAddress) {
      navigate(`/assets/${encodeURIComponent(macAddress)}`);
    }
  };

  return (
    <Card 
      className="bg-black border border-blue-700 rounded-lg w-80 p-0 cursor-pointer hover:border-blue-500 transition-colors"
      onClick={handleDeviceClick}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="p-2 bg-blue-950 rounded-full">
            {icon}
          </div>
          <div className="flex flex-col items-end gap-1">
            {channel && (
              <Badge variant="outline" className="text-xs border-blue-600 text-blue-300">
                <Activity className="h-3 w-3 mr-1" />
                Ch {channel}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-2">
        <div className="text-center">
          <div className="text-sm font-medium text-blue-400 truncate">
            {name}
          </div>
          <div className="text-xs text-blue-300">
            {ipAddress}
          </div>
          {macAddress && (
            <div className="text-xs text-gray-400 font-mono">
              {macAddress}
            </div>
          )}
        </div>

        {vendor && (
          <div className="text-xs text-blue-300 text-center">
            <span className="font-medium">Vendor:</span> {vendor}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          {downloadSpeed && (
            <div className="text-center">
              <div className="text-gray-400">Download</div>
              <div className="text-green-400">{(downloadSpeed / 1000000).toFixed(1)}Mbps</div>
            </div>
          )}

          {uploadSpeed && (
            <div className="text-center">
              <div className="text-gray-400">Upload</div>
              <div className="text-orange-400">{(uploadSpeed / 1000000).toFixed(1)}Mbps</div>
            </div>
          )}

          {usage && (
            <div className="text-center">
              <div className="text-gray-400">Usage</div>
              <div className="text-purple-400">{usage}MB</div>
            </div>
          )}

          {uptime && (
            <div className="text-center">
              <div className="text-gray-400">Uptime</div>
              <div className="text-cyan-400">{uptime}</div>
            </div>
          )}
        </div>

        {lastSeen && (
          <div className="text-xs text-gray-400 text-center">
            <span className="font-medium">Last seen:</span><br />
            {new Date(lastSeen).toLocaleString()}
          </div>
        )}

        {protocol && (
          <div className="flex justify-center">
            <Badge 
              className={`text-[10px] px-2 py-0.5 ${getProtocolColor(protocol)}`}
              variant="secondary"
            >
              {protocol}
            </Badge>
          </div>
        )}
      </CardContent>
      
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500 !border-blue-700 w-3 h-1.5" />
    </Card>
  );
};

export default memo(DeviceNode);
