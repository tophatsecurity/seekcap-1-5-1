
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Plus, X, AlertTriangle, ActivitySquare, Zap, Clock, Wifi, Router, Ban } from "lucide-react";
import { updateFailSafeSettings } from "@/lib/db/capture";
import { FailSafeSettings as FailSafeSettingsType } from "@/lib/db/types";

interface Props {
  settings?: FailSafeSettingsType;
}

const DEFAULT_SETTINGS: FailSafeSettingsType = {
  enabled: false,
  cpu_limit: 80,
  bandwidth_limit_mbps: 500,
  measure_method: "average",
  notify_on_low_resources: true,
  notify_on_peak: true,
  reboot_wait_minutes: 5,
  uptime_alert_threshold_minutes: 15,
  connection_up_required: true,
  excluded_switches: {
    names: [],
    ip_ranges: []
  },
  excluded_mac_addresses: [],
  relay_switches: [],
  port_types: {
    access: true,
    trunk: true,
    hybrid: false
  }
};

export function FailSafeSettings({ settings }: Props) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [failSafeSettings, setFailSafeSettings] = useState<FailSafeSettingsType>(
    settings || DEFAULT_SETTINGS
  );
  
  // Form state
  const [newExcludedName, setNewExcludedName] = useState("");
  const [newExcludedIpRange, setNewExcludedIpRange] = useState("");
  const [newExcludedMac, setNewExcludedMac] = useState("");
  const [newRelayName, setNewRelayName] = useState("");
  const [newRelayIp, setNewRelayIp] = useState("");

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await updateFailSafeSettings(failSafeSettings);
      toast({
        title: "Settings Saved",
        description: "Fail Safe settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
      console.error("Error saving fail safe settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExcludedName = () => {
    if (newExcludedName && !failSafeSettings.excluded_switches.names.includes(newExcludedName)) {
      setFailSafeSettings({
        ...failSafeSettings,
        excluded_switches: {
          ...failSafeSettings.excluded_switches,
          names: [...failSafeSettings.excluded_switches.names, newExcludedName]
        }
      });
      setNewExcludedName("");
    }
  };

  const removeExcludedName = (name: string) => {
    setFailSafeSettings({
      ...failSafeSettings,
      excluded_switches: {
        ...failSafeSettings.excluded_switches,
        names: failSafeSettings.excluded_switches.names.filter(n => n !== name)
      }
    });
  };

  const addExcludedIpRange = () => {
    if (newExcludedIpRange && !failSafeSettings.excluded_switches.ip_ranges.includes(newExcludedIpRange)) {
      setFailSafeSettings({
        ...failSafeSettings,
        excluded_switches: {
          ...failSafeSettings.excluded_switches,
          ip_ranges: [...failSafeSettings.excluded_switches.ip_ranges, newExcludedIpRange]
        }
      });
      setNewExcludedIpRange("");
    }
  };

  const removeExcludedIpRange = (range: string) => {
    setFailSafeSettings({
      ...failSafeSettings,
      excluded_switches: {
        ...failSafeSettings.excluded_switches,
        ip_ranges: failSafeSettings.excluded_switches.ip_ranges.filter(r => r !== range)
      }
    });
  };

  const addExcludedMac = () => {
    if (newExcludedMac && !failSafeSettings.excluded_mac_addresses.includes(newExcludedMac)) {
      setFailSafeSettings({
        ...failSafeSettings,
        excluded_mac_addresses: [...failSafeSettings.excluded_mac_addresses, newExcludedMac]
      });
      setNewExcludedMac("");
    }
  };

  const removeExcludedMac = (mac: string) => {
    setFailSafeSettings({
      ...failSafeSettings,
      excluded_mac_addresses: failSafeSettings.excluded_mac_addresses.filter(m => m !== mac)
    });
  };

  const addRelaySwitch = () => {
    if (newRelayName && newRelayIp) {
      setFailSafeSettings({
        ...failSafeSettings,
        relay_switches: [
          ...failSafeSettings.relay_switches,
          { name: newRelayName, ip: newRelayIp }
        ]
      });
      setNewRelayName("");
      setNewRelayIp("");
    }
  };

  const removeRelaySwitch = (name: string) => {
    setFailSafeSettings({
      ...failSafeSettings,
      relay_switches: failSafeSettings.relay_switches.filter(s => s.name !== name)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Fail Safe Settings</CardTitle>
              <CardDescription>
                Configure safety limits and alerts for capture operations
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="enableFailSafe">Enable Fail Safe</Label>
              <Switch
                id="enableFailSafe"
                checked={failSafeSettings.enabled}
                onCheckedChange={(checked) => 
                  setFailSafeSettings({ ...failSafeSettings, enabled: checked })
                }
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Resource Limits */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <ActivitySquare className="mr-2 h-5 w-5" />
                  Resource Limits
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cpuLimit">CPU Limit (%): {failSafeSettings.cpu_limit}%</Label>
                    <Slider 
                      id="cpuLimit" 
                      min={10} 
                      max={95} 
                      step={5}
                      value={[failSafeSettings.cpu_limit]} 
                      onValueChange={(value) => 
                        setFailSafeSettings({ ...failSafeSettings, cpu_limit: value[0] })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bandwidthLimit">Bandwidth Limit (Mbps): {failSafeSettings.bandwidth_limit_mbps} Mbps</Label>
                    <Slider 
                      id="bandwidthLimit" 
                      min={100} 
                      max={10000} 
                      step={100}
                      value={[failSafeSettings.bandwidth_limit_mbps]} 
                      onValueChange={(value) => 
                        setFailSafeSettings({ ...failSafeSettings, bandwidth_limit_mbps: value[0] })
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Measurement Method</Label>
                    <RadioGroup 
                      value={failSafeSettings.measure_method}
                      onValueChange={(value) => 
                        setFailSafeSettings({ 
                          ...failSafeSettings, 
                          measure_method: value as 'average' | 'peak' 
                        })
                      }
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="average" id="measureAverage" />
                        <Label htmlFor="measureAverage">Average</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="peak" id="measurePeak" />
                        <Label htmlFor="measurePeak">Peak</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </div>
              
              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Notifications
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyLow">Notify on Low Resources</Label>
                    <Switch
                      id="notifyLow"
                      checked={failSafeSettings.notify_on_low_resources}
                      onCheckedChange={(checked) => 
                        setFailSafeSettings({ ...failSafeSettings, notify_on_low_resources: checked })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notifyPeak">Notify on Peak Usage</Label>
                    <Switch
                      id="notifyPeak"
                      checked={failSafeSettings.notify_on_peak}
                      onCheckedChange={(checked) => 
                        setFailSafeSettings({ ...failSafeSettings, notify_on_peak: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Timing Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Timing Settings
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rebootWait">Reboot Wait (minutes)</Label>
                      <Input
                        id="rebootWait"
                        type="number"
                        min={1}
                        max={60}
                        value={failSafeSettings.reboot_wait_minutes}
                        onChange={(e) => 
                          setFailSafeSettings({ 
                            ...failSafeSettings, 
                            reboot_wait_minutes: parseInt(e.target.value) || 1 
                          })
                        }
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="uptimeAlert">Uptime Alert (minutes)</Label>
                      <Input
                        id="uptimeAlert"
                        type="number"
                        min={5}
                        max={1440}
                        value={failSafeSettings.uptime_alert_threshold_minutes}
                        onChange={(e) => 
                          setFailSafeSettings({ 
                            ...failSafeSettings, 
                            uptime_alert_threshold_minutes: parseInt(e.target.value) || 5 
                          })
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="connectionUp">Connection Up Required</Label>
                    <Switch
                      id="connectionUp"
                      checked={failSafeSettings.connection_up_required}
                      onCheckedChange={(checked) => 
                        setFailSafeSettings({ ...failSafeSettings, connection_up_required: checked })
                      }
                    />
                  </div>
                </div>
              </div>
              
              {/* Port Types */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Zap className="mr-2 h-5 w-5" />
                  Port Types
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="accessPort">Access Ports</Label>
                    <Switch
                      id="accessPort"
                      checked={failSafeSettings.port_types.access}
                      onCheckedChange={(checked) => 
                        setFailSafeSettings({ 
                          ...failSafeSettings, 
                          port_types: { ...failSafeSettings.port_types, access: checked } 
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="trunkPort">Trunk Ports</Label>
                    <Switch
                      id="trunkPort"
                      checked={failSafeSettings.port_types.trunk}
                      onCheckedChange={(checked) => 
                        setFailSafeSettings({ 
                          ...failSafeSettings, 
                          port_types: { ...failSafeSettings.port_types, trunk: checked } 
                        })
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="hybridPort">Hybrid Ports</Label>
                    <Switch
                      id="hybridPort"
                      checked={failSafeSettings.port_types.hybrid}
                      onCheckedChange={(checked) => 
                        setFailSafeSettings({ 
                          ...failSafeSettings, 
                          port_types: { ...failSafeSettings.port_types, hybrid: checked } 
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Exclusions */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Ban className="mr-2 h-5 w-5" />
                Exclusions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Excluded Switch Names */}
                <div className="space-y-4">
                  <h4 className="font-medium">Excluded Switch Names</h4>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Switch name"
                      value={newExcludedName}
                      onChange={(e) => setNewExcludedName(e.target.value)}
                    />
                    <Button type="button" size="sm" onClick={addExcludedName}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {failSafeSettings.excluded_switches.names.map((name) => (
                      <Badge key={name} variant="secondary" className="flex items-center gap-1">
                        {name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeExcludedName(name)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Excluded IP Ranges */}
                <div className="space-y-4">
                  <h4 className="font-medium">Excluded IP Ranges</h4>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="IP range (e.g., 192.168.1.0/24)"
                      value={newExcludedIpRange}
                      onChange={(e) => setNewExcludedIpRange(e.target.value)}
                    />
                    <Button type="button" size="sm" onClick={addExcludedIpRange}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {failSafeSettings.excluded_switches.ip_ranges.map((range) => (
                      <Badge key={range} variant="secondary" className="flex items-center gap-1">
                        {range}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeExcludedIpRange(range)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Excluded MAC Addresses */}
              <div className="space-y-4">
                <h4 className="font-medium">Excluded MAC Addresses</h4>
                <div className="flex space-x-2">
                  <Input
                    placeholder="MAC address (e.g., 00:1A:2B:3C:4D:5E)"
                    value={newExcludedMac}
                    onChange={(e) => setNewExcludedMac(e.target.value)}
                  />
                  <Button type="button" size="sm" onClick={addExcludedMac}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {failSafeSettings.excluded_mac_addresses.map((mac) => (
                    <Badge key={mac} variant="secondary" className="flex items-center gap-1">
                      {mac}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeExcludedMac(mac)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Relay Switches */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Router className="mr-2 h-5 w-5" />
                Relay Switches
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                <Input
                  placeholder="Switch name"
                  value={newRelayName}
                  onChange={(e) => setNewRelayName(e.target.value)}
                />
                <Input
                  placeholder="IP address"
                  value={newRelayIp}
                  onChange={(e) => setNewRelayIp(e.target.value)}
                />
                <Button type="button" onClick={addRelaySwitch}>
                  Add Relay Switch
                </Button>
              </div>
              
              {failSafeSettings.relay_switches.length > 0 ? (
                <div className="border rounded-md">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">IP Address</th>
                        <th className="px-4 py-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {failSafeSettings.relay_switches.map((relay) => (
                        <tr key={relay.name} className="border-b">
                          <td className="px-4 py-2">{relay.name}</td>
                          <td className="px-4 py-2">{relay.ip}</td>
                          <td className="px-4 py-2 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRelaySwitch(relay.name)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center p-4 border rounded-md text-muted-foreground">
                  No relay switches configured
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Fail Safe Settings"}
        </Button>
      </div>
    </div>
  );
}
