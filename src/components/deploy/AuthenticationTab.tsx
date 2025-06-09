
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Terminal, Lock } from "lucide-react";

interface AuthenticationTabProps {
  transformedCredentials: Record<string, any>;
}

const AuthenticationTab: React.FC<AuthenticationTabProps> = ({ transformedCredentials }) => {
  return (
    <div className="grid gap-6">
      <h3 className="text-lg font-semibold">Authentication Settings</h3>
      <p className="text-muted-foreground">
        Configure authentication methods for network device access.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Terminal className="h-8 w-8 text-blue-500" />
            <div>
              <CardTitle>SSH Authentication</CardTitle>
              <CardDescription>Secure Shell access configuration</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ssh-username">Username Template</Label>
              <Input 
                id="ssh-username" 
                placeholder="admin"
                defaultValue={transformedCredentials?.ssh?.username || ""} 
              />
              <p className="text-xs text-muted-foreground">
                Default username used for SSH connections
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ssh-key">SSH Key Authentication</Label>
              <div className="flex gap-2">
                <Input 
                  id="ssh-key" 
                  placeholder="Path to SSH key file"
                  className="flex-1"
                />
                <Button variant="outline">Browse</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Optional: Use SSH key instead of password
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ssh-port">Default SSH Port</Label>
              <Input 
                id="ssh-port" 
                type="number"
                placeholder="22"
                defaultValue="22"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save SSH Settings</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Lock className="h-8 w-8 text-amber-500" />
            <div>
              <CardTitle>Telnet Authentication</CardTitle>
              <CardDescription>Legacy Telnet access configuration</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telnet-username">Username Template</Label>
              <Input 
                id="telnet-username" 
                placeholder="admin"
                defaultValue={transformedCredentials?.telnet?.username || ""} 
              />
              <p className="text-xs text-muted-foreground">
                Default username used for Telnet connections
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="enable-password">Enable Password</Label>
              <Input 
                id="enable-password" 
                type="password"
                placeholder="Enable password for privileged mode"
              />
              <p className="text-xs text-muted-foreground">
                Used for entering privileged mode on network devices
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="telnet-port">Default Telnet Port</Label>
              <Input 
                id="telnet-port" 
                type="number"
                placeholder="23"
                defaultValue="23"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Telnet Settings</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Authentication Security Notice</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 p-4 rounded-md border border-amber-200 dark:border-amber-800">
            <h4 className="font-semibold mb-2">Security Recommendations</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Use SSH instead of Telnet whenever possible for secure communications</li>
              <li>Create dedicated user accounts with appropriate permissions for capture operations</li>
              <li>Use key-based authentication instead of passwords when supported</li>
              <li>Rotate credentials regularly according to your security policy</li>
              <li>Consider using a dedicated management network for device access</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthenticationTab;
