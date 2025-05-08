
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchSystemSettings, updateSystemSetting, SystemSetting } from "@/lib/db/settings";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { Loader2, CheckCircle2 } from "lucide-react";

export function SystemSettingsForm() {
  const { user } = useAuth();
  const userId = user?.id;
  
  const [selectedTab, setSelectedTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [generalSettings, setGeneralSettings] = useState<Record<string, any>>({});
  const [notificationSettings, setNotificationSettings] = useState<Record<string, any>>({});
  const [securitySettings, setSecuritySettings] = useState<Record<string, any>>({});
  const [storageSettings, setStorageSettings] = useState<Record<string, any>>({});
  const [uiSettings, setUiSettings] = useState<Record<string, any>>({});
  
  // Fetch settings from database
  const { data: settings, isLoading, error, refetch } = useQuery({
    queryKey: ['systemSettings'],
    queryFn: fetchSystemSettings
  });
  
  // Initialize settings from fetched data
  useEffect(() => {
    if (!settings) return;
    
    settings.forEach((setting: SystemSetting) => {
      switch (setting.setting_key) {
        case 'general':
          setGeneralSettings(setting.setting_value);
          break;
        case 'notification':
          setNotificationSettings(setting.setting_value);
          break;
        case 'security':
          setSecuritySettings(setting.setting_value);
          break;
        case 'storage':
          setStorageSettings(setting.setting_value);
          break;
        case 'ui':
          setUiSettings(setting.setting_value);
          break;
      }
    });
  }, [settings]);
  
  const handleGeneralChange = (key: string, value: any) => {
    setGeneralSettings({ ...generalSettings, [key]: value });
  };
  
  const handleNotificationChange = (key: string, value: any) => {
    setNotificationSettings({ ...notificationSettings, [key]: value });
  };
  
  const handleSecurityChange = (key: string, value: any) => {
    setSecuritySettings({ ...securitySettings, [key]: value });
  };
  
  const handleStorageChange = (key: string, value: any) => {
    setStorageSettings({ ...storageSettings, [key]: value });
  };
  
  const handleUiChange = (key: string, value: any) => {
    setUiSettings({ ...uiSettings, [key]: value });
  };
  
  const saveSettings = async () => {
    setSaving(true);
    
    try {
      switch (selectedTab) {
        case 'general':
          await updateSystemSetting('general', generalSettings, userId);
          break;
        case 'notification':
          await updateSystemSetting('notification', notificationSettings, userId);
          break;
        case 'security':
          await updateSystemSetting('security', securitySettings, userId);
          break;
        case 'storage':
          await updateSystemSetting('storage', storageSettings, userId);
          break;
        case 'ui':
          await updateSystemSetting('ui', uiSettings, userId);
          break;
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setSaving(false);
      refetch();
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md text-red-800 dark:text-red-200">
        Error loading settings. Please try again.
      </div>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>
          Configure system-wide settings for the THS|SEEKCAP platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notification">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="storage">Storage</TabsTrigger>
            <TabsTrigger value="ui">UI</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="site_name">Site Name</Label>
                <Input 
                  id="site_name"
                  value={generalSettings.site_name || ''}
                  onChange={(e) => handleGeneralChange('site_name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input 
                  id="company_name"
                  value={generalSettings.company_name || ''}
                  onChange={(e) => handleGeneralChange('company_name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input 
                  id="contact_email"
                  value={generalSettings.contact_email || ''}
                  onChange={(e) => handleGeneralChange('contact_email', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notification" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email_alerts">Email Alerts</Label>
                  <p className="text-sm text-muted-foreground">Enable email notifications for critical events</p>
                </div>
                <Switch 
                  id="email_alerts"
                  checked={notificationSettings.email_alerts || false}
                  onCheckedChange={(checked) => handleNotificationChange('email_alerts', checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sms_alerts">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Enable SMS notifications for critical events</p>
                </div>
                <Switch 
                  id="sms_alerts"
                  checked={notificationSettings.sms_alerts || false}
                  onCheckedChange={(checked) => handleNotificationChange('sms_alerts', checked)}
                />
              </div>
              <div>
                <Label htmlFor="webhook_url">Webhook URL</Label>
                <Input 
                  id="webhook_url"
                  value={notificationSettings.webhook_url || ''}
                  onChange={(e) => handleNotificationChange('webhook_url', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="alert_threshold">Alert Threshold (%)</Label>
                <Input 
                  id="alert_threshold"
                  type="number"
                  value={notificationSettings.alert_threshold || 80}
                  onChange={(e) => handleNotificationChange('alert_threshold', parseInt(e.target.value))}
                  className="mt-1"
                  min="1"
                  max="100"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="password_expiry_days">Password Expiry (days)</Label>
                <Input 
                  id="password_expiry_days"
                  type="number"
                  value={securitySettings.password_expiry_days || 90}
                  onChange={(e) => handleSecurityChange('password_expiry_days', parseInt(e.target.value))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                <Input 
                  id="max_login_attempts"
                  type="number"
                  value={securitySettings.max_login_attempts || 5}
                  onChange={(e) => handleSecurityChange('max_login_attempts', parseInt(e.target.value))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="session_timeout_minutes">Session Timeout (minutes)</Label>
                <Input 
                  id="session_timeout_minutes"
                  type="number"
                  value={securitySettings.session_timeout_minutes || 30}
                  onChange={(e) => handleSecurityChange('session_timeout_minutes', parseInt(e.target.value))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="require_2fa">Require 2FA</Label>
                  <p className="text-sm text-muted-foreground">Require two-factor authentication for all users</p>
                </div>
                <Switch 
                  id="require_2fa"
                  checked={securitySettings.require_2fa || false}
                  onCheckedChange={(checked) => handleSecurityChange('require_2fa', checked)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="storage" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="max_capture_size_gb">Maximum Capture Size (GB)</Label>
                <Input 
                  id="max_capture_size_gb"
                  type="number"
                  value={storageSettings.max_capture_size_gb || 500}
                  onChange={(e) => handleStorageChange('max_capture_size_gb', parseInt(e.target.value))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div>
                <Label htmlFor="auto_delete_days">Auto-Delete After (days)</Label>
                <Input 
                  id="auto_delete_days"
                  type="number"
                  value={storageSettings.auto_delete_days || 30}
                  onChange={(e) => handleStorageChange('auto_delete_days', parseInt(e.target.value))}
                  className="mt-1"
                  min="1"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compression_enabled">Enable Compression</Label>
                  <p className="text-sm text-muted-foreground">Apply compression to store files more efficiently</p>
                </div>
                <Switch 
                  id="compression_enabled"
                  checked={storageSettings.compression_enabled || false}
                  onCheckedChange={(checked) => handleStorageChange('compression_enabled', checked)}
                />
              </div>
              <div>
                <Label htmlFor="storage_path">Storage Path</Label>
                <Input 
                  id="storage_path"
                  value={storageSettings.storage_path || ''}
                  onChange={(e) => handleStorageChange('storage_path', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ui" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <p className="text-sm text-muted-foreground">Select the default theme</p>
                </div>
                <select
                  id="theme"
                  value={uiSettings.theme || 'dark'}
                  onChange={(e) => handleUiChange('theme', e.target.value)}
                  className="border rounded px-3 py-2 bg-background"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sidebar_collapsed">Sidebar Collapsed by Default</Label>
                  <p className="text-sm text-muted-foreground">Start with sidebar collapsed on page load</p>
                </div>
                <Switch 
                  id="sidebar_collapsed"
                  checked={uiSettings.sidebar_collapsed || false}
                  onCheckedChange={(checked) => handleUiChange('sidebar_collapsed', checked)}
                />
              </div>
              <div>
                <Label htmlFor="items_per_page">Items Per Page</Label>
                <Input 
                  id="items_per_page"
                  type="number"
                  value={uiSettings.items_per_page || 25}
                  onChange={(e) => handleUiChange('items_per_page', parseInt(e.target.value))}
                  className="mt-1"
                  min="5"
                  max="100"
                />
              </div>
              <div>
                <Label htmlFor="default_dashboard">Default Dashboard</Label>
                <Input 
                  id="default_dashboard"
                  value={uiSettings.default_dashboard || 'overview'}
                  onChange={(e) => handleUiChange('default_dashboard', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={saveSettings} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" /> Save Settings
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
