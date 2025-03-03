
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Upload, Download } from "lucide-react";
import { fetchCaptureSettings } from "@/lib/db/capture";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CredentialSet } from "@/lib/db/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";

export default function Auth() {
  const navigate = useNavigate();
  const [credentialSets, setCredentialSets] = useState<Record<string, CredentialSet>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCredential, setIsAddingCredential] = useState(false);
  const [isEditingCredential, setIsEditingCredential] = useState(false);
  const [currentCredential, setCurrentCredential] = useState<string | null>(null);
  
  // Form state
  const [credentialName, setCredentialName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authType, setAuthType] = useState<"password" | "certificate">("password");
  const [certificate, setCertificate] = useState("");
  const [enableRequired, setEnableRequired] = useState(false);
  const [enablePassword, setEnablePassword] = useState("");

  useEffect(() => {
    loadCredentialSets();
  }, []);

  const loadCredentialSets = async () => {
    setIsLoading(true);
    try {
      const settings = await fetchCaptureSettings();
      if (settings && settings.credentials) {
        setCredentialSets(settings.credentials);
      } else {
        await createDefaultCredentialSets();
      }
    } catch (error) {
      console.error("Error loading credential sets:", error);
      toast({
        title: "Error",
        description: "Failed to load credential sets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultCredentialSets = async () => {
    try {
      const defaultCredentials: Record<string, CredentialSet> = {
        "default_credential": {
          user: "admin",
          password: "admin",
          enable_required: true,
          enable_password: "admin"
        },
        "return_path_credential": {
          user: "return",
          password: "return",
          enable_required: false
        }
      };

      const { data: settings, error: fetchError } = await supabase
        .from('capture_settings')
        .select('credentials')
        .eq('id', 1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const currentCredentials = (settings?.credentials as Record<string, CredentialSet>) || {};
      
      const updatedCredentials = { ...currentCredentials, ...defaultCredentials };

      const { error: updateError } = await supabase
        .from('capture_settings')
        .update({ credentials: updatedCredentials })
        .eq('id', 1);

      if (updateError) throw updateError;

      setCredentialSets(updatedCredentials);
      
      toast({
        title: "Success",
        description: "Default credential sets created",
      });
    } catch (error) {
      console.error("Error creating default credential sets:", error);
      toast({
        title: "Error",
        description: "Failed to create default credential sets",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setCredentialName("");
    setUsername("");
    setPassword("");
    setAuthType("password");
    setCertificate("");
    setEnableRequired(false);
    setEnablePassword("");
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddingCredential(true);
  };

  const openEditDialog = (name: string) => {
    const credential = credentialSets[name];
    setCredentialName(name);
    setUsername(credential.user);
    setPassword(credential.password || "");
    setAuthType(credential.certificate ? "certificate" : "password");
    setCertificate(credential.certificate || "");
    setEnableRequired(credential.enable_required);
    setEnablePassword(credential.enable_password || "");
    setCurrentCredential(name);
    setIsEditingCredential(true);
  };

  const handleSaveCredential = async () => {
    try {
      if (!credentialName.trim()) {
        toast({
          title: "Error",
          description: "Credential set name is required",
          variant: "destructive",
        });
        return;
      }

      const { data: settings, error: fetchError } = await supabase
        .from('capture_settings')
        .select('credentials')
        .eq('id', 1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const currentCredentials = (settings?.credentials as Record<string, CredentialSet>) || {};
      const updatedCredentials = { ...currentCredentials };
      
      updatedCredentials[credentialName] = {
        user: username,
        password: authType === "password" ? password : undefined,
        certificate: authType === "certificate" ? certificate : undefined,
        enable_required: enableRequired,
        ...(enableRequired && enablePassword ? { enable_password: enablePassword } : {})
      };

      const { error: updateError } = await supabase
        .from('capture_settings')
        .update({ credentials: updatedCredentials })
        .eq('id', 1);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: `Credential set ${isEditingCredential ? "updated" : "added"} successfully`,
      });

      loadCredentialSets();
      setIsAddingCredential(false);
      setIsEditingCredential(false);
    } catch (error) {
      console.error("Error saving credential set:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditingCredential ? "update" : "add"} credential set`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteCredential = async (name: string) => {
    if (!confirm(`Are you sure you want to delete the credential set "${name}"?`)) {
      return;
    }

    try {
      const { data: settings, error: fetchError } = await supabase
        .from('capture_settings')
        .select('credentials')
        .eq('id', 1)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const currentCredentials = (settings?.credentials as Record<string, CredentialSet>) || {};
      const updatedCredentials = { ...currentCredentials };
      delete updatedCredentials[name];

      const { error: updateError } = await supabase
        .from('capture_settings')
        .update({ credentials: updatedCredentials })
        .eq('id', 1);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Credential set deleted successfully",
      });

      loadCredentialSets();
    } catch (error) {
      console.error("Error deleting credential set:", error);
      toast({
        title: "Error",
        description: "Failed to delete credential set",
        variant: "destructive",
      });
    }
  };

  const handleExportCredentials = () => {
    const dataStr = JSON.stringify(credentialSets, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = 'credential_sets.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportCredentials = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importedCredentials = JSON.parse(content);
          
          if (typeof importedCredentials !== 'object') {
            throw new Error('Invalid file format. Expected a JSON object.');
          }
          
          const { data: settings, error: fetchError } = await supabase
            .from('capture_settings')
            .select('credentials')
            .eq('id', 1)
            .maybeSingle();

          if (fetchError) throw fetchError;

          const currentCredentials = (settings?.credentials as Record<string, CredentialSet>) || {};
          const updatedCredentials = { ...currentCredentials, ...importedCredentials };

          const { error: updateError } = await supabase
            .from('capture_settings')
            .update({ credentials: updatedCredentials })
            .eq('id', 1);

          if (updateError) throw updateError;

          toast({
            title: "Success",
            description: "Credential sets imported successfully",
          });

          loadCredentialSets();
        } catch (error) {
          console.error("Error importing credential sets:", error);
          toast({
            title: "Error",
            description: "Failed to import credential sets. Make sure the file contains valid JSON.",
            variant: "destructive",
          });
        }
      };
      
      reader.readAsText(file);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Authentication and Credentials</h2>
          <p className="text-muted-foreground">
            Manage credential sets used as templates for authenticating to capture devices.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Credential Sets</h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handleExportCredentials}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <label htmlFor="import-credentials" className="cursor-pointer">
                <Button size="sm" variant="outline" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input
                  id="import-credentials"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportCredentials}
                />
              </label>
              <Button size="sm" onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Credential Set
              </Button>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Loading credential sets...</p>
            </div>
          ) : Object.keys(credentialSets).length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Auth Type</TableHead>
                    <TableHead>Enable Required</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(credentialSets).map(([name, cred]) => (
                    <TableRow key={name}>
                      <TableCell className="font-medium">{name}</TableCell>
                      <TableCell>{cred.user}</TableCell>
                      <TableCell>
                        {cred.certificate ? "Certificate" : "Password"}
                      </TableCell>
                      <TableCell>
                        {cred.enable_required ? "Yes" : "No"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(name)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCredential(name)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p>No credential sets configured.</p>
              <p className="text-sm">Add a credential set to get started.</p>
            </div>
          )}
          
          <div className="bg-muted p-4 rounded-md mt-6">
            <h4 className="font-medium mb-2">About Credential Sets</h4>
            <p className="text-sm text-muted-foreground">
              Credential sets defined here will be used as templates for authenticating to capture devices.
              These credentials are used for accessing network devices to capture traffic for analysis.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              For SSH devices, you can use either password or certificate-based authentication, and specify
              if enable mode is required for privileged commands.
            </p>
          </div>
        </div>
      </div>

      {/* Add Credential Dialog */}
      <Dialog open={isAddingCredential} onOpenChange={setIsAddingCredential}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Credential Set</DialogTitle>
            <DialogDescription>
              Create a new credential set for device authentication
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="credentialName">Credential Set Name</Label>
              <Input
                id="credentialName"
                value={credentialName}
                onChange={(e) => setCredentialName(e.target.value)}
                placeholder="e.g., ssh_credential"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Authentication Type</Label>
              <Select value={authType} onValueChange={(value: "password" | "certificate") => setAuthType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {authType === "password" ? (
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="certificate">SSH Certificate</Label>
                <Textarea
                  id="certificate"
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  placeholder="Paste your SSH certificate here"
                  className="min-h-[100px]"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enableRequired">Enable Required</Label>
                <p className="text-sm text-muted-foreground">
                  Does this device require enable mode?
                </p>
              </div>
              <Switch
                id="enableRequired"
                checked={enableRequired}
                onCheckedChange={setEnableRequired}
              />
            </div>
            {enableRequired && (
              <div className="grid gap-2">
                <Label htmlFor="enablePassword">Enable Password</Label>
                <Input
                  id="enablePassword"
                  type="password"
                  value={enablePassword}
                  onChange={(e) => setEnablePassword(e.target.value)}
                  placeholder="Enable password"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingCredential(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCredential}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Credential Dialog */}
      <Dialog open={isEditingCredential} onOpenChange={setIsEditingCredential}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Credential Set</DialogTitle>
            <DialogDescription>
              Update an existing credential set
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editCredentialName">Credential Set Name</Label>
              <Input
                id="editCredentialName"
                value={credentialName}
                onChange={(e) => setCredentialName(e.target.value)}
                placeholder="e.g., ssh_credential"
                disabled={currentCredential !== null}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editUsername">Username</Label>
              <Input
                id="editUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Authentication Type</Label>
              <Select value={authType} onValueChange={(value: "password" | "certificate") => setAuthType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select auth type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {authType === "password" ? (
              <div className="grid gap-2">
                <Label htmlFor="editPassword">Password</Label>
                <Input
                  id="editPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
            ) : (
              <div className="grid gap-2">
                <Label htmlFor="editCertificate">SSH Certificate</Label>
                <Textarea
                  id="editCertificate"
                  value={certificate}
                  onChange={(e) => setCertificate(e.target.value)}
                  placeholder="Paste your SSH certificate here"
                  className="min-h-[100px]"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="editEnableRequired">Enable Required</Label>
                <p className="text-sm text-muted-foreground">
                  Does this device require enable mode?
                </p>
              </div>
              <Switch
                id="editEnableRequired"
                checked={enableRequired}
                onCheckedChange={setEnableRequired}
              />
            </div>
            {enableRequired && (
              <div className="grid gap-2">
                <Label htmlFor="editEnablePassword">Enable Password</Label>
                <Input
                  id="editEnablePassword"
                  type="password"
                  value={enablePassword}
                  onChange={(e) => setEnablePassword(e.target.value)}
                  placeholder="Enable password"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditingCredential(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCredential}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
