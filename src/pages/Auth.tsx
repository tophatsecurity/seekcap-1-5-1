
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { fetchCaptureSettings } from "@/lib/db/capture";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CredentialSet } from "@/lib/db/types";

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
  const [enableRequired, setEnableRequired] = useState(false);
  const [enablePassword, setEnablePassword] = useState("");

  const handleContinue = () => {
    navigate("/");
  };

  useEffect(() => {
    loadCredentialSets();
  }, []);

  const loadCredentialSets = async () => {
    setIsLoading(true);
    try {
      const settings = await fetchCaptureSettings();
      if (settings && settings.credentials) {
        setCredentialSets(settings.credentials);
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

  const resetForm = () => {
    setCredentialName("");
    setUsername("");
    setPassword("");
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
    setPassword(credential.password);
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
        .single();

      if (fetchError) throw fetchError;

      // Fix: Use type assertion to ensure TypeScript knows this is an object
      const currentCredentials = (settings?.credentials as Record<string, CredentialSet>) || {};
      const updatedCredentials = { ...currentCredentials };
      
      // Add or update the credential
      updatedCredentials[credentialName] = {
        user: username,
        password: password,
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

      // Refresh credential sets
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
        .single();

      if (fetchError) throw fetchError;

      // Fix: Use type assertion to ensure TypeScript knows this is an object
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

      // Refresh credential sets
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-4xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">THS|SEEKCAP</CardTitle>
          <CardDescription>Authentication and Credentials Management</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="welcome" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="credentials">Credential Sets</TabsTrigger>
          </TabsList>
          
          <TabsContent value="welcome" className="pt-4">
            <CardContent className="space-y-4">
              <p className="text-center">
                This is a simple welcome page. No authentication is required to use this application.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleContinue} className="w-full">
                Continue to Dashboard
              </Button>
            </CardFooter>
          </TabsContent>
          
          <TabsContent value="credentials" className="pt-4">
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Credential Sets</h3>
                <Button size="sm" onClick={openAddDialog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credential Set
                </Button>
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
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>

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
                placeholder="e.g., admin_set"
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
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
                placeholder="e.g., admin_set"
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
              <Label htmlFor="editPassword">Password</Label>
              <Input
                id="editPassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
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
    </div>
  );
}
