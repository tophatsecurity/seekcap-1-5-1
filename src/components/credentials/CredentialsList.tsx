
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { CredentialSet } from "@/lib/db/types";
import { deleteCredentialSet } from "@/lib/db/credentials";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CredentialsListProps {
  credentials: CredentialSet[];
  onEdit: (credential: CredentialSet) => void;
  onUpdated: () => void;
}

const CredentialsList: React.FC<CredentialsListProps> = ({
  credentials,
  onEdit,
  onUpdated,
}) => {
  const [showPasswords, setShowPasswords] = React.useState<Record<number, boolean>>({});

  const handleDelete = async (id: number) => {
    const success = await deleteCredentialSet(id);
    if (success) {
      onUpdated();
    }
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (credentials.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No credential sets configured.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add your first credential set to start managing device authentication.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {credentials.map((credential) => (
        <div
          key={credential.id}
          className="border rounded-lg p-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h3 className="font-medium">{credential.name}</h3>
              <Badge variant="outline">
                Username: {credential.user_name}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(credential)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Credential Set</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{credential.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => credential.id && handleDelete(credential.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Password:</span>
              <div className="flex items-center space-x-2 mt-1">
                <span className="font-mono">
                  {showPasswords[credential.id!] ? credential.password : '••••••••'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePasswordVisibility(credential.id!)}
                >
                  {showPasswords[credential.id!] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {credential.enable_required && (
              <div>
                <span className="text-muted-foreground">Enable Password:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-mono">
                    {showPasswords[credential.id!] ? credential.enable_password : '••••••••'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {credential.enable_required && (
              <Badge variant="secondary">Enable Required</Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Created: {new Date(credential.created_at!).toLocaleDateString()}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CredentialsList;
